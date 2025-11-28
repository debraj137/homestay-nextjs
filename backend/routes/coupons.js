// backend/routes/coupons.js
const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const auth = require('../middleware/authMiddleware'); // optional: use to get req.user

// Validate a coupon (frontend calls before confirm booking)
router.post('/validate', auth /* optional: allows non-auth but we use auth to check per-user limit */, couponController.validateCoupon);

// Admin routes (protect with admin middleware if available)
router.post('/', auth, couponController.createCoupon); // ideally require admin role
router.get('/', auth, couponController.listCoupons);   // ideally require admin role

module.exports = router;
