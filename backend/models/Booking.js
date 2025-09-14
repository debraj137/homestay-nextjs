const mongoose = require('mongoose');


const BookingSchema = new mongoose.Schema({
room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
name: { type: String, required: true },
email: { type: String, required: true },
checkIn: { type: Date, required: true },
checkOut: { type: Date, required: true },
totalPrice: { type: Number, required: true },
createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Booking', BookingSchema);