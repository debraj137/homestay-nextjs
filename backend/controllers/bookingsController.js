const Booking = require('../models/Booking');
const User = require('../models/User');
const Room = require('../models/Room');
const { bookingConfirmationTemplate, ownerNotificationTemplate } = require('../utils/emailTemplates');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

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
  try {
    const {
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfAdult,
      numberOfChild,
      totalPrice,
      mobileNumber,
      status = 'confirmed',

      // New/optional hourly fields:
      bookingType = 'full', // 'full' | 'hourly'
      checkInTime, // e.g. "04:00 PM"
      hours // integer 2..10
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
      // This effectively reserves the entire days from checkIn (inclusive) to checkOut (exclusive)
      startAt = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate(), 0, 0, 0, 0);
      endAt = new Date(checkOut.getFullYear(), checkOut.getMonth(), checkOut.getDate(), 0, 0, 0, 0);
    }

    // === Overlap check (time-aware) ===
    // We need to find any existing confirmed booking for same room where:
    // existing.startAt < newEnd && existing.endAt > newStart
    // But older records may not have startAt/endAt (backwards compatibility).
    // We'll check both cases using $or:
    const overlappingBooking = await Booking.findOne({
      roomId,
      status: 'confirmed',
      $or: [
        // bookings that have startAt & endAt saved
        {
          startAt: { $exists: true },
          endAt: { $exists: true },
          $and: [
            { startAt: { $lt: endAt } },
            { endAt: { $gt: startAt } }
          ]
        },
        // legacy bookings relying on checkInDate/checkOutDate (date-level)
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

    // ✅ Save booking (store startAt/endAt for future precise checks)
    const booking = new Booking({
      userId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      bookingType,
      checkInTime: bookingType === 'hourly' ? checkInTime : undefined,
      hours: bookingType === 'hourly' ? Number(hours) : undefined,
      startAt,
      endAt,
      checkInDate: bookingType === 'hourly' ? startAt : checkIn,
      checkOutDate: bookingType === 'hourly' ? endAt : checkOut,
      numberOfAdult,
      numberOfChild,
      totalPrice,
      mobileNumber,
      status
    });

    await booking.save();

    // Fetch extra info for notifications
    const room = await Room.findById(roomId).populate('ownerId');
    const user = await User.findById(userId);

    // Email + SMS content (use the booking.startAt/endAt info for details)
    const startStr = booking.startAt ? booking.startAt.toString() : new Date(booking.checkInDate).toDateString();
    const endStr = booking.endAt ? booking.endAt.toString() : new Date(booking.checkOutDate).toDateString();

    // Email Content
    const emailContent = `
      <h2>Booking Details</h2>
      <p><strong>Room:</strong> ${room?.title}</p>
      <p><strong>Check-in:</strong> ${startStr}</p>
      <p><strong>Check-out:</strong> ${endStr}</p>
      <p><strong>Guests:</strong> ${numberOfAdult} Adults, ${numberOfChild} Children</p>
      <p><strong>Total Price:</strong> ₹${totalPrice}</p>
    `;

    // Send confirmation email to user
    if (user?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Booking Confirmation - Awadh Hotels',
        html: bookingConfirmationTemplate(user, room, booking),
      });
    }

    // Send notification email to room owner
    if (room?.ownerId?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: room.ownerId.email,
        subject: 'New Booking Received',
        html: ownerNotificationTemplate(room.ownerId, user, room, booking),
      });
    }

    // SMS content
    const smsMessage = `Booking Confirmed: ${room?.title}, ${startStr} - ${endStr}, Guests: ${numberOfAdult}A/${numberOfChild}C, ₹${totalPrice}`;
    // Send SMS to user
    // if (user?.mobileNumber) {
    //   try {
    //     await twilioClient.messages.create({
    //       body: smsMessage,
    //       from: process.env.TWILIO_PHONE,
    //       to: `+91${user.mobileNumber}`,
    //     });
    //   } catch (smsErr) {
    //     console.warn('Failed to send SMS to user:', smsErr.message);
    //   }
    // }

    // Send SMS to owner
    // if (room?.ownerId?.mobileNumber) {
    //   try {
    //     await twilioClient.messages.create({
    //       body: `New Booking: ${room?.title}, ${startStr} - ${endStr}.`,
    //       from: process.env.TWILIO_PHONE,
    //       to: `+91${room.ownerId.mobileNumber}`,
    //     });
    //   } catch (smsErr) {
    //     console.warn('Failed to send SMS to owner:', smsErr.message);
    //   }
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
