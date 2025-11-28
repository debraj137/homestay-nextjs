// backend/controllers/couponController.js
const Coupon = require('../models/Coupon');
const Booking = require('../models/Booking');
const mongoose = require('mongoose');

/**
 * Validate + compute discount for a given coupon code and booking subtotal
 * Input: { code, bookingSubtotal, roomIds } 
 * Returns: { success, coupon, discountAmount, newTotal, message }
 */
exports.validateCoupon = async (req, res) => {
  try {
    const { code, bookingSubtotal = 0, roomIds = [] } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code required' });

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Invalid coupon code' });

    const now = new Date();
    if (now < coupon.startsAt) return res.status(400).json({ success: false, message: 'Coupon not active yet' });
    if (now > coupon.endsAt) return res.status(400).json({ success: false, message: 'Coupon expired' });

    // min booking amount
    if (bookingSubtotal < (coupon.minBookingAmount || 0)) {
      return res.status(400).json({ success: false, message: `Minimum booking amount is ${coupon.minBookingAmount}` });
    }

    // applicableRooms check
    if (coupon.applicableRooms && coupon.applicableRooms.length > 0 && Array.isArray(roomIds) && roomIds.length > 0) {
      const intersects = roomIds.some(r => coupon.applicableRooms.find(x => x.toString() === r.toString()));
      if (!intersects) return res.status(400).json({ success: false, message: 'Coupon not applicable for selected rooms' });
    }

    // global uses check
    if (coupon.maxUses > 0 && (coupon.usesCount || 0) >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
    }

    // per-user uses check (if user provided)
    if (req.user && coupon.maxUsesPerUser > 0) {
      const userUses = await Booking.countDocuments({ userId: req.user.id, 'coupon.code': coupon.code });
      if (userUses >= coupon.maxUsesPerUser) {
        return res.status(400).json({ success: false, message: 'You have already used this coupon the maximum times' });
      }
    }

    // calculate discountAmount
    let discountAmount = 0;
    if (coupon.discountType === 'percent') {
      const pct = Math.min(Math.max(coupon.discountValue, 0), 100);
      discountAmount = +(bookingSubtotal * (pct / 100)).toFixed(2);
    } else {
      discountAmount = Math.min(bookingSubtotal, coupon.discountValue);
    }
    const newTotal = +(bookingSubtotal - discountAmount).toFixed(2);

    return res.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
      discountAmount,
      newTotal,
    });
  } catch (err) {
    console.error('validateCoupon error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ADMIN: create coupon (you should protect this route with admin auth)
exports.createCoupon = async (req, res) => {
  try {
    // enforce admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const data = req.body;
    if (!data.code || !data.discountValue || !data.startsAt || !data.endsAt) {
      return res.status(400).json({ success: false, message: 'Missing required fields: code, discountValue, startsAt, endsAt' });
    }

    data.code = data.code.toUpperCase();
    data.createdBy = req.user.id;
    const coupon = new Coupon({ ...data });
    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    console.error('createCoupon error', err);
    res.status(400).json({ success: false, message: err.message });
  }
};


exports.listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    console.error('listCoupons error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
