const mongoose = require('mongoose');

// Listing reports — buyers tap "Report this listing" with a reason. Stored for
// the moderator to triage. No admin panel yet; query manually for now:
//   db.reports.find({ status: 'open' }).sort({ createdAt: -1 })
const reportSchema = new mongoose.Schema({
  animalId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Animal', required: true, index: true },
  reporterId:{ type: mongoose.Schema.Types.ObjectId, ref: 'User',   required: true },
  reason:    {
    type: String,
    enum: ['fake_photo', 'spam_or_duplicate', 'scam_price', 'animal_cruelty', 'other'],
    required: true,
  },
  details:   { type: String, default: '', maxlength: 1000 },
  status:    { type: String, enum: ['open', 'reviewed', 'dismissed', 'actioned'], default: 'open', index: true },
}, { timestamps: true });

// A given reporter may only report a listing once — prevents spam.
reportSchema.index({ animalId: 1, reporterId: 1 }, { unique: true });

module.exports = mongoose.model('Report', reportSchema);
