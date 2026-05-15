const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['cow', 'buffalo', 'goat', 'chicken', 'sheep', 'pig', 'other'],
    required: true,
  },
  images: [{ type: String }], // URLs (local path or Cloudinary)

  price: {
    type: Number,
    required: true,
    min: 0,
  },
  age: {
    type: Number,
    required: true,
    min: 0,
  },
  ageUnit: {
    type: String,
    enum: ['months', 'years'],
    default: 'years',
  },
  location: {
    type: String,
    required: true,
  },
  breed: { type: String, default: '' },
  calving: { type: String, default: '' },
  milkPerDay: { type: String, default: '' },
  description: {
    type: String,
    default: '',
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerPhone: {
    type: String,
    required: true,
  },
  sellerName: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },

  // ── Redesign V2 additions (additive — old records read with defaults)
  isNegotiable: { type: Boolean, default: true },  // sell-time toggle, default ON
  videoUrl:     { type: String,  default: '' },    // optional single video URL
}, { timestamps: true });

// Index for fast queries
animalSchema.index({ type: 1, price: 1, createdAt: -1 });

module.exports = mongoose.model('Animal', animalSchema);
