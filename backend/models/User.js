const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'owner', 'admin'], 
    default: 'user' 
  },
  mobileNumber: { 
    type: String 
  },
  emailVerified: { 
    type: Boolean, 
    default: false 
  },
  mobileVerified: { 
    type: Boolean, 
    default: false 
  },

  // OTPs for verification
  emailOtp: { type: String },
  emailOtpExpiry: { type: Date },
  mobileOtp: { type: String },
  mobileOtpExpiry: { type: Date },

  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);
