// backend/routes/coupons.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const auth = require('../middleware/authMiddleware'); // optional: use to get req.user
const { requireRole } = auth;

// Validate a coupon (frontend calls before confirm booking)
router.post('/validate', auth /* optional: allows non-auth but we use auth to check per-user limit */, couponController.validateCoupon);

// Admin routes (protect with admin middleware if available)
router.post('/', auth, requireRole('admin'), couponController.createCoupon);
router.get('/', auth, requireRole('admin'), couponController.listCoupons);

module.exports = router;
