const Booking = require('../models/Booking');
const User = require('../models/User');
const Room = require('../models/Room');
const Coupon = require('../models/Coupon');
const { bookingConfirmationTemplate, ownerNotificationTemplate } = require('../utils/emailTemplates');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { sendSms } = require('../utils/sendSms');
// ✅ Email transporter (using Gmail or any SMTP)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // app password
  },
});

// ✅ Twilio Client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Helper: parse time string like "04:00 PM" or "16:00" into hours/minutes (24h)
 */
function parseTimeStringToHM(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  // Accept formats like "04:00 PM", "4:00 PM", "16:00"
  const pmMatcher = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
  const isoMatcher = /^(\d{1,2}):(\d{2})$/; // "16:00"
  let m = timeStr.match(pmMatcher);
  if (m) {
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && hh !== 12) hh += 12;
    if (ampm === 'AM' && hh === 12) hh = 0;
    return { hh, mm };
  }
  m = timeStr.match(isoMatcher);
  if (m) {
    return { hh: parseInt(m[1], 10), mm: parseInt(m[2], 10) };
  }
  return null;
}

/**
 * Create a Date at local timezone for dateString ("yyyy-mm-dd") and time {hh,mm}
 */
function makeLocalDateTime(dateString, { hh = 0, mm = 0 } = {}) {
  // dateString may be ISO or Date
  const d = new Date(dateString);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0-indexed
  const day = d.getDate();
  return new Date(year, month, day, hh, mm, 0, 0);
}

/**
 * Ensure hourly check-in rules:
 * - allowed check-in hours: 11:00 (11) to 22:00 (22) inclusive
 * - hours between 2 and 10
 * - resulting endAt must be before next-day 10:00 AM boundary (if crosses to next day)
 *
 * Returns { valid: boolean, message?: string }
 */
function validateHourlyRules(startAt, hours) {
  if (!startAt || !hours) return { valid: false, message: 'Invalid start time or hours' };
  if (hours < 2 || hours > 10) return { valid: false, message: 'Hourly booking must be between 2 and 10 hours' };

  const startHour = startAt.getHours();
  // Allowed start from 11:00 to 22:00
  if (startHour < 11 || startHour > 22) {
    return { valid: false, message: 'Hourly check-in must be between 11:00 and 22:00' };
  }

  // End time
  const endAt = new Date(startAt.getTime() + hours * 60 * 60 * 1000);

  // If end falls after next-day 10:00 AM, deny
  // Next day 10:00 AM boundary relative to booking start date:
  const boundary = new Date(startAt);
  boundary.setDate(boundary.getDate() + 1);
  boundary.setHours(10, 0, 0, 0);

  if (endAt > boundary) {
    return { valid: false, message: 'Hourly booking must end before 10:00 AM next day' };
  }

  return { valid: true, endAt };
}

exports.createBooking = async (req, res) => {
  console.log("Create booking request body:", req.body);
  try {
    const {
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfAdult,
      numberOfChild,
      // totalPrice,  <-- IGNORE client totalPrice for server-side price calc
      mobileNumber,
      status = 'confirmed',

      // New/optional hourly fields:
      bookingType = 'full', // 'full' | 'hourly'
      checkInTime, // e.g. "04:00 PM"
      hours, // integer 2..10

      couponCode // NEW: string coupon code
    } = req.body;

    // Basic validation
    if (!userId || !roomId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Missing required booking fields' });
    }

    // compute base dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // For full-day bookings, ensure date range is valid
    if (bookingType === 'full') {
      if (checkIn >= checkOut) {
        return res.status(400).json({ message: 'Check-out date must be after check-in date' });
      }
    }

    // Compute startAt and endAt depending on booking type
    let startAt = null;
    let endAt = null;

    if (bookingType === 'hourly') {
      // checkInDate + checkInTime + hours must exist
      if (!checkInTime) {
        return res.status(400).json({ message: 'checkInTime is required for hourly bookings' });
      }
      if (!hours && hours !== 0) {
        return res.status(400).json({ message: 'hours is required for hourly bookings' });
      }

      // parse time
      const hm = parseTimeStringToHM(checkInTime);
      if (!hm) {
        return res.status(400).json({ message: 'Invalid checkInTime format' });
      }

      // Build startAt using local date/time from checkInDate + time
      startAt = makeLocalDateTime(checkInDate, hm);

      // Validate rules and compute endAt
      const validation = validateHourlyRules(startAt, Number(hours));
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      endAt = validation.endAt;
    } else {
      // full-day — compute startAt at 00:00 of checkIn and endAt at 00:00 of checkOut
      startAt = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate(), 0, 0, 0, 0);
      endAt = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate(), 0, 0, 0, 0);
    }

    // === Overlap check (time-aware) ===
    const overlappingBooking = await Booking.findOne({
      roomId,
      status: 'confirmed',
      $or: [
        {
          startAt: { $exists: true },
          endAt: { $exists: true },
          $and: [
            { startAt: { $lt: endAt } },
            { endAt: { $gt: startAt } }
          ]
        },
        {
          startAt: { $exists: false },
          $and: [
            { checkInDate: { $lt: endAt } },
            { checkOutDate: { $gt: startAt } }
          ]
        }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Room already booked for the selected time range'
      });
    }

    // -----------------------------
    // NEW: Load room and compute server-side original price
    // -----------------------------
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Apply room-level discount (if present)
    // const roomBasePrice = room.discount && room.discount > 0
    //   ? Math.round(room.price * (1 - room.discount / 100))
    //   : room.price;

    // Compute original price depending on booking type (same formula as frontend)
    // let originalPrice = 0;
    // if (bookingType === 'hourly' && hours) {
    //   if (hours <= 3) {
    //     originalPrice = roomBasePrice / 4;
    //   } else {
    //     originalPrice = roomBasePrice / 4 + (roomBasePrice / 12) * (hours - 3);
    //   }
    //   originalPrice = Math.round(originalPrice);
    // } else {
    //   const nights = Math.max(
    //     1,
    //     (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    //   );
    //   originalPrice = roomBasePrice * nights;
    // }

    // ===============================
    // ACTUAL PRICE (NO DISCOUNT)
    // ===============================
    let actualPrice = 0;

    if (bookingType === 'hourly' && hours) {
      if (hours <= 3) {
        actualPrice = room.price / 4;
      } else {
        actualPrice = room.price / 4 + (room.price / 12) * (hours - 3);
      }
      actualPrice = Math.round(actualPrice);
    } else {
      const nights = Math.max(
        1,
        (checkOut - checkIn) / (1000 * 60 * 60 * 24)
      );
      actualPrice = room.price * nights;
    }

    // ROOM DISCOUNT (used ONLY if coupon NOT applied)
    const roomDiscountSaving =
      room.discount > 0
        ? Math.round((actualPrice * room.discount) / 100)
        : 0;


    // ===== Coupon handling: validate and compute discount using originalPrice (server-side) =====
    let coupon = null;
    let discountAmount = 0;
    if (couponCode) {
      const code = couponCode.toUpperCase();
      coupon = await Coupon.findOne({ code, isActive: true });
      if (!coupon) return res.status(400).json({ message: 'Invalid coupon code' });

      const now = new Date();
      if (now < coupon.startsAt) return res.status(400).json({ message: 'Coupon not active yet' });
      if (now > coupon.endsAt) return res.status(400).json({ message: 'Coupon expired' });

      if (coupon.maxUses > 0 && (coupon.usesCount || 0) >= coupon.maxUses) {
        return res.status(400).json({ message: 'Coupon usage limit reached' });
      }

      if (coupon.maxUsesPerUser > 0) {
        const userUses = await Booking.countDocuments({ userId, 'coupon.code': coupon.code });
        if (userUses >= coupon.maxUsesPerUser) {
          return res.status(400).json({ message: 'You have already used this coupon the maximum times' });
        }
      }

      // min booking amount: check against server-side originalPrice (NOT client totalPrice)
      if (actualPrice < (coupon.minBookingAmount || 0)) {
        return res.status(400).json({ message: `Minimum booking amount for this coupon is ${coupon.minBookingAmount}` });
      }

      // applicableRooms check
      if (coupon.applicableRooms && coupon.applicableRooms.length > 0) {
        const isApplicable = coupon.applicableRooms.some(r => r.toString() === roomId.toString());
        if (!isApplicable) return res.status(400).json({ message: 'Coupon not applicable for this room' });
      }

      // compute discountAmount based on originalPrice
      if (coupon.discountType === 'percent') {
        const pct = Math.min(Math.max(coupon.discountValue, 0), 100);
        discountAmount = Math.round((actualPrice * (pct / 100)) * 100) / 100;
      } else {
        discountAmount = Math.min(actualPrice, coupon.discountValue);
      }
    }

    // Final price computed server-side
    let finalPrice;

    if (coupon && discountAmount > 0) {
      // coupon overrides room discount
      finalPrice = actualPrice - discountAmount;
    } else {
      finalPrice = actualPrice - roomDiscountSaving;
    }

    finalPrice = Math.max(0, Math.round(finalPrice));

    // Prepare booking object (include coupon snapshot if present)
    const bookingData = {
      userId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      bookingType,
      checkInTime: bookingType === 'hourly' ? checkInTime : undefined,
      hours: bookingType === 'hourly' ? Number(hours) : undefined,
      startAt,
      endAt,
      numberOfAdult,
      numberOfChild,
      // 👇 ADD THESE (CRITICAL)
      subtotal: actualPrice,               // actual/original price
      roomDiscountAmount: coupon ? 0 : roomDiscountSaving,
      totalPrice: finalPrice, // final price after coupon (server-side)
      mobileNumber,
      status,
      coupon: coupon ? {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      } : undefined
    };

    const booking = new Booking(bookingData);
    await booking.save();

    // If coupon used, increment coupon.usesCount atomically; if fails, rollback booking
    if (coupon) {
      // attempt atomic increment only if maxUses not exceeded (or maxUses==0)
      const filter = { _id: coupon._id };
      if (coupon.maxUses > 0) {
        filter.$expr = { $lt: ["$usesCount", coupon.maxUses] }; // ensure usesCount < maxUses
      }
      // try increment
      const updated = await Coupon.findOneAndUpdate(filter, { $inc: { usesCount: 1 } }, { new: true });
      if (!updated) {
        // rollback booking
        await Booking.findByIdAndDelete(booking._id);
        return res.status(400).json({ message: 'Coupon usage limit reached (race). Please try again.' });
      }
    }

    // Fetch extra info for notifications (we already have room above; fetch owner)
    const populatedRoom = await Room.findById(roomId).populate('ownerId');
    const userDoc = await User.findById(userId);

    const startStr = booking.startAt ? booking.startAt.toString() : new Date(booking.checkInDate).toDateString();
    const endStr = booking.endAt ? booking.endAt.toString() : new Date(booking.checkOutDate).toDateString();

    // Send emails/SMS (unchanged)
    if (userDoc?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: userDoc.email,
        subject: 'Booking Confirmation - Awadh Hotels',
        html: bookingConfirmationTemplate(userDoc, populatedRoom, booking),
      });
    }

    if (populatedRoom?.ownerId?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: populatedRoom.ownerId.email,
        subject: 'New Booking Received',
        html: ownerNotificationTemplate(populatedRoom.ownerId, userDoc, populatedRoom, booking),
      });
    }
    //  const smsMessage = 'hello'; 
    const smsMessage = `Booking Confirmed: ${populatedRoom?.title}, ${startStr} - ${endStr}, Guests: ${numberOfAdult}A/${numberOfChild}C, ₹${booking.totalPrice}`;
    // if (userDoc?.mobileNumber) {
    //   try {
    //     await twilioClient.messages.create({
    //       body: smsMessage,
    //       from: process.env.TWILIO_PHONE,
    //       to: `+91${userDoc.mobileNumber}`,
    //     });
    //   } catch (smsErr) {
    //     console.warn('Failed to send SMS to user:', smsErr.message);
    //   }
    // }
    // if (populatedRoom?.ownerId?.mobileNumber) {
    //   try {
    //     await twilioClient.messages.create({
    //       body: `New Booking: ${populatedRoom?.title}, ${startStr} - ${endStr}.`,
    //       from: process.env.TWILIO_PHONE,
    //       to: `+91${populatedRoom.ownerId.mobileNumber}`,
    //     });
    //   } catch (smsErr) {
    //     console.warn('Failed to send SMS to owner:', smsErr.message);
    //   }
    // }

    if (userDoc?.mobileNumber) {
      await sendSms({
        to: userDoc.mobileNumber,
        message: smsMessage,
      });
    }
    // if (populatedRoom?.ownerId?.mobileNumber) {
    //   await sendSms({
    //     to: populatedRoom.ownerId.mobileNumber,
    //     message: `New Booking: ${populatedRoom?.title}, ${startStr} - ${endStr}.`,
    //   });
    // }


    res.status(201).json(booking);
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};



// Get bookings for a user (unchanged except returns booking info)
exports.getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ userId })
      .populate('roomId', 'title price location images') // fetch room details
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Get user bookings error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Cancel booking before 24 hours
exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Already canceled?
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    // Get check-in time (startAt for hourly, checkInDate for full)
    const checkInTime = booking.startAt || booking.checkInDate;
    const currentTime = new Date();

    // Must be at least 24h before check-in
    const timeDiffHours = (checkInTime - currentTime) / (1000 * 60 * 60);
    if (timeDiffHours < 24) {
      return res.status(400).json({
        message: "You can cancel your booking only before 24 hours of check-in time",
      });
    }

    // Update booking status
    booking.status = "cancelled";
    await booking.save();

    // Optional: send cancellation email to user and owner
    // (You can create a cancelNotificationTemplate later)
    // await transporter.sendMail(...)

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ✅ Modify booking by admin (with pricing logic)
exports.modifyBookingByAdmin = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const {
      checkInDate,
      checkOutDate,
      checkInTime,
      hours,
      numberOfAdult,
      numberOfChild,
      status,
    } = req.body;

    const booking = await Booking.findById(bookingId).populate("roomId");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const room = booking.roomId;
    console.log("Modifying booking for room:", room);
    if (!room) {
      return res.status(404).json({ message: "Room not found for this booking" });
    }

    // ✅ Use discount percentage if available
    let basePrice = room.price;
    if (room.discount && room.discount > 0) {
      basePrice = Math.round(room.price * (1 - room.discount / 100));
    }

    // Update values based on booking type
    if (booking.bookingType === "full") {
      if (checkInDate) booking.checkInDate = new Date(checkInDate);
      if (checkOutDate) booking.checkOutDate = new Date(checkOutDate);

      // Calculate nights
      const nights = Math.max(
        1,
        (booking.checkOutDate - booking.checkInDate) / (1000 * 60 * 60 * 24)
      );

      booking.totalPrice = basePrice * nights;
    } else if (booking.bookingType === "hourly") {
      if (checkInDate) booking.checkInDate = new Date(checkInDate);
      if (checkInTime) booking.checkInTime = checkInTime;
      if (hours) booking.hours = Number(hours);

      // Parse check-in time and calculate startAt and endAt
      const parseTimeStringToHM = (timeStr) => {
        const pmMatcher = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;
        const isoMatcher = /^(\d{1,2}):(\d{2})$/;
        let m = timeStr.match(pmMatcher);
        if (m) {
          let hh = parseInt(m[1], 10);
          const mm = parseInt(m[2], 10);
          const ampm = m[3].toUpperCase();
          if (ampm === "PM" && hh !== 12) hh += 12;
          if (ampm === "AM" && hh === 12) hh = 0;
          return { hh, mm };
        }
        m = timeStr.match(isoMatcher);
        if (m) {
          return { hh: parseInt(m[1], 10), mm: parseInt(m[2], 10) };
        }
        return null;
      };

      const hm = parseTimeStringToHM(booking.checkInTime);
      const makeLocalDateTime = (dateString, { hh = 0, mm = 0 } = {}) => {
        const d = new Date(dateString);
        const year = d.getFullYear();
        const month = d.getMonth();
        const day = d.getDate();
        return new Date(year, month, day, hh, mm, 0, 0);
      };

      const startAt = makeLocalDateTime(booking.checkInDate, hm);
      const endAt = new Date(startAt.getTime() + booking.hours * 60 * 60 * 1000);

      booking.startAt = startAt;
      booking.endAt = endAt;

      // Calculate hourly total price
      let totalPrice = 0;
      if (booking.hours <= 3) {
        totalPrice = basePrice / 4;
      } else {
        totalPrice = basePrice / 4 + (basePrice / 12) * (booking.hours - 3);
      }
      booking.totalPrice = Math.round(totalPrice);
    }

    // Common updates
    if (typeof numberOfAdult !== "undefined")
      booking.numberOfAdult = Number(numberOfAdult);
    if (typeof numberOfChild !== "undefined")
      booking.numberOfChild = Number(numberOfChild);
    // if (status) booking.status = status;
    // -----------------------------
    // ADMIN cancellation validation (24-hour rule)
    // -----------------------------
    if (status === "cancelled" && booking.status !== "cancelled") {
      // Determine check-in time
      const checkInTime = booking.startAt || booking.checkInDate;
      const now = new Date();
      console.log('checkInDate:', booking.checkInDate, ' startAt:', booking.startAt);
      console.log("chekckInTime:", checkInTime, " now:", now);
      // const diffHours = (checkInTime - now) / (1000 * 60 * 60); 
      const diffHours = (booking.checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      if (diffHours < 24) {
        console.log("Admin cancellation denied: less than 24 hours to check-in", diffHours);
        return res.status(400).json({
          message: "Admin can cancel booking only before 24 hours of check-in time",
        });
      }

      booking.status = "cancelled";
    }


    // Send cancellation email to user if cancelled by admin
    if (status === "cancelled" && booking.status === "cancelled") {
      const user = await User.findById(booking.userId);
      const room = await Room.findById(booking.roomId);

      if (user?.email) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Booking Cancelled by Admin - Awadh Hotels",
          html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
          <h2 style="color:#b91c1c;">Booking Cancelled</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>
            Your booking for <strong>${room.title}</strong> has been
            <strong>cancelled by our admin team</strong>.
          </p>
          <p>
            <strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}<br/>
            <strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}
          </p>
          <p>
            If you have already made a payment, our support team will assist you
            with the refund as per policy.
          </p>
          <p style="margin-top:20px;">
            Regards,<br/>
            <strong>Awadh Hotels Support</strong>
          </p>
        </div>
      `,
        });
      }
    }


    await booking.save();

    return res.json({ message: "Booking updated successfully", booking });
  } catch (err) {
    console.error("Modify booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


