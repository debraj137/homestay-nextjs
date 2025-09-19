const Booking = require('../models/Booking');
const Room = require('../models/Room');


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