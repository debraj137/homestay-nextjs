// const mongoose = require('mongoose');

// const bookingSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },

//   // Original date fields (kept for backward compatibility)
//   checkInDate: { type: Date, required: true },
//   checkOutDate: { type: Date, required: true },

//   // New fields to support hourly bookings
//   bookingType: { type: String, enum: ['full', 'hourly'], default: 'full' },
//   checkInTime: { type: String }, // e.g. "11:00 AM"
//   hours: { type: Number }, // e.g. 2, 3, ... 10

//   // Computed precise start and end datetimes used for overlap checks
//   startAt: { type: Date }, // exact start timestamp
//   endAt: { type: Date },   // exact end timestamp

//   numberOfAdult: { type: Number, required: true },
//   numberOfChild: { type: Number, required: true },
//   totalPrice: { type: Number, required: true },
//   status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
//   mobileNumber: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Booking', bookingSchema);
// backend/models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },

  // Original date fields (kept for backward compatibility)
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },

  // New fields to support hourly bookings
  bookingType: { type: String, enum: ['full', 'hourly'], default: 'full' },
  checkInTime: { type: String }, // e.g. "11:00 AM"
  hours: { type: Number }, // e.g. 2, 3, ... 10

  // Computed precise start and end datetimes used for overlap checks
  startAt: { type: Date }, // exact start timestamp
  endAt: { type: Date },   // exact end timestamp

  numberOfAdult: { type: Number, required: true },
  numberOfChild: { type: Number, required: true },

  // keep totalPrice for display and accounting
  totalPrice: { type: Number, required: true },

  // coupon snapshot (optional)
  coupon: {
    code: { type: String },
    discountType: { type: String, enum: ['percent', 'fixed'] },
    discountValue: { type: Number },
    discountAmount: { type: Number }, // actual discount applied in currency
  },

  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  mobileNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
