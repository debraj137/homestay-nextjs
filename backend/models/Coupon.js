// backend/models/Coupon.js
const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  description: { type: String },
  discountType: { type: String, enum: ['percent', 'fixed'], default: 'percent' }, // percent or fixed amount
  discountValue: { type: Number, required: true }, // percent (0-100) or fixed amount
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  minBookingAmount: { type: Number, default: 0 },
  applicableRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }], // empty => all rooms
  maxUses: { type: Number, default: 0 }, // 0 => unlimited
  maxUsesPerUser: { type: Number, default: 1 }, // per-user limit
  usesCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  combinable: { type: Boolean, default: false }, // allow combos (not used currently)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // admin id
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
