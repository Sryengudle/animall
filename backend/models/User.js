const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[6-9]\d{9}$/, // Indian mobile number
  },
  name: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },

  // ── Structured address (additive — `location` above kept as the formatted
  // single-line representation for backward compat and easy display).
  address: {
    line1:    { type: String, default: '' },   // house no / street
    area:     { type: String, default: '' },   // village / locality
    city:     { type: String, default: '' },   // city / block / taluka
    district: { type: String, default: '' },
    state:    { type: String, default: '' },
    pincode:  { type: String, default: '', match: /^\d{6}$|^$/ },
    lat:      { type: Number, default: null },
    lng:      { type: Number, default: null },
  },

  // ── Redesign V2 profile fields (all optional — additive, no migration needed).
  profilePhoto: { type: String, default: '' },                  // /uploads/<file>
  whatsapp:     { type: String, default: '', match: /^[6-9]\d{9}$|^$/ },
  dob:          { type: Date,   default: null },
  occupation:   { type: String, default: '' },                  // HOME | FARMING | DAIRY | TRADING | OTHER
  education:    { type: String, default: '' },                  // NONE | UPTO_5 | UPTO_8 | UPTO_10 | UPTO_12 | GRADUATE | OTHER
  experience:   { type: String, default: '' },                  // 0-1 | 1-3 | 3-5 | 5-10 | 10-20 | 20+
  livestock:    { type: Number, default: 0, min: 0 },           // cattle count

  // ── OTP (in production, use Redis with TTL)
  otp: String,
  otpExpiry: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
