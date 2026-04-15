const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

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

// REGISTER + SEND EMAIL OTP
exports.register = async (req, res) => {
  try {
    const { name, email, password, mobileNumber } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const emailOtp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const role = req.body.role || 'user';
    const user = new User({
      name,
      email,
      password: hashedPassword,
      mobileNumber,
      role,
      emailVerified: false,
      mobileVerified: true,
      emailOtp,
      emailOtpExpiry: expiry,
    });
    await user.save();

    // Send Email OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Email OTP',
      text: `Your OTP is ${emailOtp}. Valid for 10 minutes.`,
    });

    res.json({ message: 'User registered. OTP sent to email.' });
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
    const { email, emailOtp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    if (!user.emailOtp || user.emailOtp !== emailOtp || user.emailOtpExpiry < now) {
      return res.status(400).json({ message: 'Invalid or expired email OTP' });
    }

    user.emailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;
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
        mobileNumber: user.mobileNumber,
        role: user.role,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
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
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOtp = emailOtp;
    user.emailOtpExpiry = expiry;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your New Email OTP',
      text: `Your new OTP is ${emailOtp}. Valid for 10 minutes.`,
    });

    res.json({ message: 'New OTP sent to email.' });
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
    console.log("Login attempt for user:", user);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Allow login without mobile verification, but keep email verification mandatory.
    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before login' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log(password, user.password);
    console.log("Password match:", isMatch);
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
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
        emailVerified: user.emailVerified,
        mobileVerified: user.mobileVerified,
      },
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

// VERIFY EMAIL OTP ONLY
exports.verifyEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const now = new Date();
    if (!user.emailOtp || user.emailOtp !== otp || user.emailOtpExpiry < now) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.emailVerified = true;
    user.emailOtp = null;
    user.emailOtpExpiry = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error verifying email OTP' });
  }
};



// SEND EMAIL OTP (without requiring full signup yet)
exports.sendEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // generate OTP
    const emailOtp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    // store partial user (only email + OTP)
    const user = new User({
      email,
      password: "temp", // dummy, will be replaced later
      name: "temp",     // dummy, will be replaced later
      emailOtp,
      emailOtpExpiry: expiry,
      emailVerified: false,
    });

    await user.save();

    // send email OTP
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Email OTP",
      text: `Your OTP is ${emailOtp}. Valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent to email successfully" });
  } catch (err) {
    console.error("Error sending email OTP:", err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

// SAVE NAME after email OTP verified
exports.saveName = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ message: "Email not verified yet" });
    }

    user.name = name; // ✅ update name
    await user.save();

    res.json({ message: "Name saved successfully", user });
  } catch (err) {
    console.error("Error saving name:", err);
    res.status(500).json({ message: "Server error while saving name" });
  }
};


// SAVE PASSWORD
exports.savePassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password saved successfully" });
  } catch (err) {
    console.error("Error saving password:", err);
    res.status(500).json({ message: "Error saving password" });
  }
};

// SAVE MOBILE NUMBER
exports.sendMobileOtp = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.mobileNumber = mobileNumber;
    user.mobileVerified = true;
    user.mobileOtp = null;
    user.mobileOtpExpiry = null;
    await user.save();

    res.json({ message: "Mobile number saved successfully" });
  } catch (err) {
    console.error("Error sending mobile OTP:", err);
    res.status(500).json({ message: "Error saving mobile number" });
  }
};


// VERIFY MOBILE OTP
exports.verifyMobileOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.mobileVerified = true;
    user.mobileOtp = null;
    user.mobileOtpExpiry = null;
    await user.save();

    // 🔑 Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Mobile number saved successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      }
    });
  } catch (err) {
    console.error("Error verifying mobile OTP:", err);
    res.status(500).json({ message: "Error verifying mobile OTP" });
  }
};

// RESEND MOBILE OTP
exports.resendMobileOtp = async (req, res) => {
  try {
    const { email, mobileNumber } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (mobileNumber) {
      user.mobileNumber = mobileNumber;
    }
    user.mobileVerified = true;
    user.mobileOtp = null;
    user.mobileOtpExpiry = null;
    await user.save();

    res.json({ message: "Mobile number saved successfully" });
  } catch (err) {
    console.error("Error resending OTP:", err);
    res.status(500).json({ message: "Error saving mobile number" });
  }
};

// SEND FORGOT PASSWORD OTP
exports.sendForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailOtp = generateOtp();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.emailOtp = emailOtp;
    user.emailOtpExpiry = expiry;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      text: `Your password reset OTP is ${emailOtp}. Valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent to email for password reset" });
  } catch (err) {
    console.error("Forgot password OTP error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY FORGOT PASSWORD OTP
exports.verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();
    if (!user.emailOtp || user.emailOtp !== otp || user.emailOtpExpiry < now) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP verified – just clear OTP
    user.emailOtp = null;
    user.emailOtpExpiry = null;
    await user.save();

    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
