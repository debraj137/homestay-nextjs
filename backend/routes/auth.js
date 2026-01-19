const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { register,
    verifyOtp,
    resendOtp,
    login,
    becomeOwner,
    sendEmailOtp,
    verifyEmailOtp,
    saveName,
    savePassword,
    sendMobileOtp,
    verifyMobileOtp,
    resendMobileOtp,
    sendForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPassword } = require('../controllers/authController');

router.post('/register', register);
router.post("/send-email-otp", sendEmailOtp);
router.post('/verify-email-otp', verifyEmailOtp); // ✅ NEW
router.post('/save-name', saveName);
router.post('/save-password', savePassword);
router.post('/send-mobile-otp', sendMobileOtp);
router.post('/verify-mobile-otp', verifyMobileOtp);
router.post('/resend-mobile-otp', resendMobileOtp);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', login);
router.post('/become-owner', becomeOwner);
router.post('/forgot-password/send-otp', sendForgotPasswordOtp);
router.post('/forgot-password/verify-otp', verifyForgotPasswordOtp);
router.post('/forgot-password/reset', resetPassword);
module.exports = router;