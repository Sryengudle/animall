const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Helper: generate 6-digit OTP
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: sign JWT
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Default address shape — keeps clients from having to null-check every key.
const emptyAddress = () => ({
  line1: '', area: '', city: '', district: '', state: '', pincode: '',
  lat: null, lng: null,
});

// Helper: full user payload (without OTP fields) — used after login + after profile updates
const publicUser = (u) => ({
  _id:          u._id,
  phone:        u.phone,
  name:         u.name || '',
  location:     u.location || '',
  address:      { ...emptyAddress(), ...(u.address?.toObject?.() ?? u.address ?? {}) },
  profilePhoto: u.profilePhoto || '',
  whatsapp:     u.whatsapp || '',
  dob:          u.dob || null,
  occupation:   u.occupation || '',
  education:    u.education || '',
  experience:   u.experience || '',
  livestock:    u.livestock || 0,
  createdAt:    u.createdAt,
  updatedAt:    u.updatedAt,
});

// Build the formatted single-line address from the structured fields.
function formatAddress(a) {
  if (!a) return '';
  return [a.line1, a.area, a.city, a.district, a.state, a.pincode]
    .map((s) => (s || '').trim())
    .filter(Boolean)
    .join(', ');
}

// Whitelist for address subdoc to avoid mass-assignment quirks.
const ADDRESS_KEYS = ['line1', 'area', 'city', 'district', 'state', 'pincode', 'lat', 'lng'];
function sanitizeAddress(input) {
  if (!input || typeof input !== 'object') return null;
  const out = {};
  for (const k of ADDRESS_KEYS) {
    if (k in input) out[k] = input[k];
  }
  if ('pincode' in out) out.pincode = String(out.pincode || '').trim();
  if ('lat' in out) out.lat = out.lat === '' || out.lat == null ? null : Number(out.lat);
  if ('lng' in out) out.lng = out.lng === '' || out.lng == null ? null : Number(out.lng);
  return out;
}

/**
 * POST /api/auth/send-otp
 * Body: { phone }
 * Demo mode: returns demo_otp in response. Swap to real SMS gateway later.
 */
router.post('/send-otp', async (req, res) => {
  const { phone } = req.body;
  if (!phone || !/^[6-9]\d{9}$/.test(phone))
    return res.status(400).json({ message: 'Invalid phone number' });

  try {
    const otp = genOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    await User.findOneAndUpdate(
      { phone },
      { otp, otpExpiry },
      { upsert: true, new: true }
    );

    console.log(`OTP for ${phone}: ${otp}`);
    res.json({ message: 'OTP sent', demo_otp: otp });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/auth/verify-otp
 * Body: { phone, otp }
 */
router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp)
    return res.status(400).json({ message: 'Phone and OTP required' });

  try {
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || user.otpExpiry < new Date())
      return res.status(400).json({ message: 'Invalid or expired OTP' });

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/auth/profile
 * Update any subset of the profile fields. Whitelist guards against
 * mass-assignment (e.g. nobody can promote themselves to admin via this body).
 */
const ALLOWED_PROFILE_FIELDS = [
  'name', 'location', 'profilePhoto', 'whatsapp',
  'dob', 'occupation', 'education', 'experience', 'livestock',
];

router.put('/profile', protect, async (req, res) => {
  try {
    const update = {};
    for (const k of ALLOWED_PROFILE_FIELDS) {
      if (k in req.body) update[k] = req.body[k];
    }
    // `livestock` is a number — coerce to int (browser sends string from a number input)
    if ('livestock' in update) update.livestock = Number(update.livestock) || 0;
    // `dob` empty string → null
    if ('dob' in update && !update.dob) update.dob = null;

    // Structured address — merge with existing so partial updates (e.g. just
    // line1) don't blow away the rest of the address.
    if ('address' in req.body) {
      const incoming = sanitizeAddress(req.body.address);
      if (incoming) {
        const existing = await User.findById(req.user._id).select('address');
        const merged = { ...(existing?.address?.toObject?.() ?? {}), ...incoming };
        update.address = merged;
        // Keep the single-line `location` in sync unless the client passed it explicitly.
        if (!('location' in update)) update.location = formatAddress(merged);
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(publicUser(user));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * POST /api/auth/profile-photo
 * Multipart: single file under field name `photo`. Saves to /uploads/<file>
 * and updates the user record. Returns the new url + updated user.
 */
router.post('/profile-photo', protect, upload.single('photo'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  try {
    const url = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: url },
      { new: true },
    );
    res.json({ url, user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
