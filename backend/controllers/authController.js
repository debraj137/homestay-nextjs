const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
// Twilio setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer setup (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// REGISTER + SEND OTPs
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailOtp = generateOtp();
    const mobileOtp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const role = req.body.role || 'user';
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      role,
      emailOtp,
      emailOtpExpiry: expiry,
      mobileOtp,
      mobileOtpExpiry: expiry,
    });
    await user.save();

    // Send Email OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Email OTP',
      text: `Your OTP is ${emailOtp}. Valid for 10 minutes.`,
    });

    // Send SMS OTP
    await twilioClient.messages.create({
      body: `Your OTP is ${mobileOtp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${mobileNumber}`,
    });

    res.json({ message: 'User registered. OTPs sent to email and mobile.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
};

// VERIFY OTP
// exports.verifyOtp = async (req, res) => {
//   console.log("Verifying OTP with data:", req.body);
//   try {
//     const { email, emailOtp, mobileOtp } = req.body;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'User not found' });

//     const now = new Date();

//     if (user.emailOtp === emailOtp && user.emailOtpExpiry > now) {
//       user.emailVerified = true;
//       user.emailOtp = null;
//       user.emailOtpExpiry = null;
//     } else {
//       return res.status(400).json({ message: 'Invalid or expired email OTP' });
//     }

//     if (user.mobileOtp === mobileOtp && user.mobileOtpExpiry > now) {
//       user.mobileVerified = true;
//       user.mobileOtp = null;
//       user.mobileOtpExpiry = null;
//     } else {
//       return res.status(400).json({ message: 'Invalid or expired mobile OTP' });
//     }

//     await user.save();
//     res.json({ message: 'Email & Mobile verified successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Error verifying OTP' });
//   }
// };

exports.verifyOtp = async (req, res) => {
  try {
    const { email, emailOtp, mobileOtp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    if (!user.emailOtp || user.emailOtp !== emailOtp || user.emailOtpExpiry < now) {
      return res.status(400).json({ message: 'Invalid or expired email OTP' });
    }
    if (!user.mobileOtp || user.mobileOtp !== mobileOtp || user.mobileOtpExpiry < now) {
      return res.status(400).json({ message: 'Invalid or expired mobile OTP' });
    }

    user.emailVerified = true;
    user.mobileVerified = true;
    user.emailOtp = null;
    user.mobileOtp = null;
    user.emailOtpExpiry = null;
    user.mobileOtpExpiry = null;
    await user.save();

    // 🔹 generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const emailOtp = generateOtp();
    const mobileOtp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOtp = emailOtp;
    user.emailOtpExpiry = expiry;
    user.mobileOtp = mobileOtp;
    user.mobileOtpExpiry = expiry;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your New Email OTP',
      text: `Your new OTP is ${emailOtp}. Valid for 10 minutes.`,
    });

    await twilioClient.messages.create({
      body: `Your new OTP is ${mobileOtp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE,
      to: `+91${user.mobileNumber}`,
    });

    res.json({ message: 'New OTP sent to email and mobile.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error resending OTP' });
  }
};// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if verified
    if (!user.emailVerified || !user.mobileVerified) {
      return res.status(403).json({ message: 'Please verify email and mobile before login' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, mobileNumber: user.mobileNumber, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
};


// Upgrade user role to "owner"
exports.becomeOwner = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.role === 'owner') {
      return res.json({ message: 'You are already an owner' });
    }

    user.role = 'owner';
    await user.save();

    res.json({ message: 'You are now registered as an owner', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating role' });
  }
};