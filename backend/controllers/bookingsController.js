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
      status = 'confirmed'
    } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // ✅ Validation: check-in must be before check-out
    if (checkIn >= checkOut) {
      return res.status(400).json({ message: 'Check-out date must be after check-in date' });
    }

    // ✅ Check if room is already booked for overlapping dates
    const overlappingBooking = await Booking.findOne({
      roomId,
      status: 'confirmed', // only consider active bookings
      $or: [
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({
        message: 'Room already booked for the selected dates',
      });
    }

    // ✅ Save new booking
    const booking = new Booking({
      userId,
      roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      numberOfAdult,
      numberOfChild,
      totalPrice,
      mobileNumber,
      status
    });

    await booking.save();
    // 🔹 Fetch extra info for notifications
    const room = await Room.findById(roomId).populate('ownerId');
    const user = await User.findById(userId);

    // 📧 Email Content
    const emailContent = `
      <h2>Booking Details</h2>
      <p><strong>Room:</strong> ${room?.title}</p>
      <p><strong>Check-in:</strong> ${checkIn.toDateString()}</p>
      <p><strong>Check-out:</strong> ${checkOut.toDateString()}</p>
      <p><strong>Guests:</strong> ${numberOfAdult} Adults, ${numberOfChild} Children</p>
      <p><strong>Total Price:</strong> ₹${totalPrice}</p>
    `;

    // 📧 Send confirmation email to user
    if (user?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Booking Confirmation - Awadh Hotels',
        html: bookingConfirmationTemplate(user, room, booking),
      });
    }

    // 📧 Send notification email to room owner
    if (room?.ownerId?.email) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: room.ownerId.email,
        subject: 'New Booking Received',
        html:ownerNotificationTemplate(room.ownerId, user, room, booking),
      });
    }

    // 📲 SMS content
    const smsMessage = `Booking Confirmed: ${room?.title}, ${checkIn.toDateString()} - ${checkOut.toDateString()}, Guests: ${numberOfAdult}A/${numberOfChild}C, ₹${totalPrice}`;
    console.log("SMS Message to:", user?.mobileNumber );
    // 📲 Send SMS to user
    if (user?.mobileNumber) {
      await twilioClient.messages.create({
        body: smsMessage,
        from: process.env.TWILIO_PHONE,
        to: `+91${user.mobileNumber}`,
      });
    }

    // 📲 Send SMS to owner
    if (room?.ownerId?.mobileNumber) {
      await twilioClient.messages.create({
        body: `New Booking: ${room?.title}, ${checkIn.toDateString()} - ${checkOut.toDateString()}.`,
        from: process.env.TWILIO_PHONE,
        to: `+91${room.ownerId.mobileNumber}`,
      });
    }
    res.status(201).json(booking); 
  } catch (err) {
    console.error("Booking creation error:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// ✅ Get bookings of a specific user
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