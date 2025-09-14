const Booking = require('../models/Booking');
const Room = require('../models/Room');


exports.createBooking = async (req, res) => {
try {
const { roomId, name, email, checkIn, checkOut, totalPrice } = req.body;


// Basic availability check (naive)
const room = await Room.findById(roomId);
if (!room) return res.status(404).json({ message: 'Room not found' });


// Here we would check overlaps with room.bookedDates — simplified for starter


const booking = new Booking({
room: roomId,
name,
email,
checkIn: new Date(checkIn),
checkOut: new Date(checkOut),
totalPrice
});


await booking.save();


// Optionally push to room.bookedDates (simple push of checkIn..checkOut range omitted)


res.status(201).json(booking);
} catch (err) {
res.status(500).json({ message: err.message });
}
};