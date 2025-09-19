const Booking = require('../models/Booking');
const Room = require('../models/Room');


exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
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