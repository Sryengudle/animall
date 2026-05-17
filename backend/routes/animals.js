const express = require('express');
const router = express.Router();
const webpush = require('web-push');
const Animal = require('../models/Animal');
const Report = require('../models/Report');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getSubscriptions, removeSubscription } = require('../services/pushSubscriptions');


// `isNegotiable` arrives from FormData as a string ("true"/"false") — coerce.
const parseBool = (v, fallback) => {
  if (v === undefined || v === null || v === '') return fallback;
  if (typeof v === 'boolean') return v;
  return v === 'true' || v === '1' || v === 'on';
};

// Files arrive via Multer in a single `images` field, but the form may include
// a video (the "milking video" tile). Split them by mimetype so videos land in
// `videoUrl` and images stay in `images[]`. The latest video wins.
function splitMedia(files = []) {
  const newImages = [];
  let newVideoUrl = null;
  for (const f of files) {
    const url = `/uploads/${f.filename}`;
    if (/^video\//i.test(f.mimetype)) newVideoUrl = url;
    else newImages.push(url);
  }
  return { newImages, newVideoUrl };
}

// Parse `removeImages` (comma-separated URLs) + `removeVideo` (truthy) from
// the body — used to delete existing media during an edit.
function parseRemovals(body) {
  const removeImages = String(body.removeImages || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  const removeVideo = parseBool(body.removeVideo, false);
  return { removeImages, removeVideo };
}

// PremiumFiltersSheet uses '1' / '2' / '3' / '4+' lactation codes; the schema
// stores the seller-picked word ('first' | 'second' | 'third' | 'fourth' | 'none').
const LACTATION_TO_CALVING = {
  '1': 'first',
  '2': 'second',
  '3': 'third',
  '4+': 'fourth',
  none: 'none',
};

const SORT_MAP = {
  newest:    { createdAt: -1 },
  oldest:    { createdAt: 1 },
  priceAsc:  { price: 1, createdAt: -1 },
  priceDesc: { price: -1, createdAt: -1 },
};

/**
 * GET /api/animals
 * Query: type (single value or comma-list), minPrice, maxPrice, lactation,
 *        within (hours), negotiable, sort (newest|oldest|priceAsc|priceDesc),
 *        page, limit
 * Public — anyone can browse listings.
 */
router.get('/', async (req, res) => {
  try {
    const {
      type, minPrice, maxPrice, lactation, within, sort, negotiable,
      page = 1, limit = 20,
    } = req.query;

    const filter = { isActive: true };

    if (type && type !== 'all') {
      const list = String(type).split(',').map((s) => s.trim()).filter(Boolean);
      if (list.length === 1) filter.type = list[0];
      else if (list.length > 1) filter.type = { $in: list };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (lactation && lactation !== 'all') {
      filter.calving = LACTATION_TO_CALVING[lactation] || lactation;
    }

    if (within) {
      const hours = Number(within);
      if (Number.isFinite(hours) && hours > 0) {
        filter.createdAt = { $gte: new Date(Date.now() - hours * 60 * 60 * 1000) };
      }
    }

    if (negotiable === 'true' || negotiable === true) filter.isNegotiable = true;

    const sortOption = SORT_MAP[sort] || SORT_MAP.newest;
    const skip = (Number(page) - 1) * Number(limit);
    const [animals, total] = await Promise.all([
      Animal.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Animal.countDocuments(filter),
    ]);

    res.json({ animals, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/animals/my/listings
 * IMPORTANT: must be before /:id so Express doesn't treat "my" as an id
 * Auth required — returns the logged-in user's listings
 */
router.get('/my/listings', protect, async (req, res) => {
  try {
    // Skip soft-deleted listings (isActive: false). Without this filter, a
    // seller would still see their own deleted animals in My Cattle after a
    // page refresh.
    const animals = await Animal.find({
      sellerId: req.user._id,
      isActive: { $ne: false },
    }).sort({ createdAt: -1 });
    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET /api/animals/:id
 * Public — get single listing
 */
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Not found' });
    res.json(animal);
  } catch (err) {
    res.status(404).json({ message: 'Not found' });
  }
});

/**
 * POST /api/animals
 * Auth required — create a new listing
 * Multipart: images[] (mixed photos + videos) + form fields
 */
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const {
      type, price, age, ageUnit, location, description,
      breed, calving, milkPerDay, isNegotiable,
    } = req.body;

    const { newImages, newVideoUrl } = splitMedia(req.files);

    const animal = await Animal.create({
      type,
      images: newImages,
      videoUrl: newVideoUrl || '',
      price: Number(price),
      age: Number(age) || 2,
      ageUnit: ageUnit || 'years',
      location,
      description,
      breed: breed || '',
      calving: calving || '',
      milkPerDay: milkPerDay || '',
      isNegotiable: parseBool(isNegotiable, true),
      sellerId: req.user._id,
      sellerPhone: req.user.phone,
      sellerName: req.user.name || '',
    });

    // push notifications are sent asynchronously, so we can respond to the client immediately without waiting for them to complete
    // res.status(201).json(animal);

    // Broadcast a push notification to all active browsers about the new animal listing
    // TODO:: move this broadcast logic to a background job/worker if it grows more complex or we want to guarantee delivery (currently if the server process crashes during the broadcast, some notifications may be lost)
    // use socket.io or a message queue if you want real-time delivery and/or to scale beyond a single server instance
    // create msg something like: `${animal.type} for sale at ${animal.price} added in ${animal.location}` and include a URL to the listing or homepage
    const animalName = animal.breed ? `${animal.breed} ${animal.type}` : animal.type;
    const addedBy = animal.sellerName || 'A seller';


  // 2. Format the push broadcast payload
  const notificationPayload = JSON.stringify({
    title: '🐾 New Animal Alert!',
    body: `${addedBy} just added a new animal named ${animalName}!`,
    url: '/buy' // Page URL where users can see the animal
  });

  // 3. Broadcast to all active browsers currently saved in memory
  const activeSubscriptions = getSubscriptions();
  const pushPromises = activeSubscriptions.map(sub => {
    return webpush.sendNotification(sub, notificationPayload)
      .catch(err => {
        // If browser endpoint expired or user revoked access (410/404), remove them
        if (err.statusCode === 410 || err.statusCode === 404) {
          removeSubscription(sub.endpoint);
        }
        console.error('Failed to send notification:', err.message || err);
      });
  });

  Promise.all(pushPromises).catch(err => {
    console.error('Broadcast error encountered', err);
  });

    res.status(201).json(animal);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * PUT /api/animals/:id
 * Auth required — owner-only listing edit. Body is multipart so the form can
 * include new image/video files. Pass `?mode=replace` to swap all images for
 * the newly-uploaded ones; omit (or `mode=append`) to add to existing.
 */
const EDITABLE_FIELDS = [
  'type', 'price', 'age', 'ageUnit', 'location', 'description',
  'breed', 'calving', 'milkPerDay', 'isNegotiable',
];

router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Not found' });
    if (animal.sellerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    for (const k of EDITABLE_FIELDS) {
      if (!(k in req.body)) continue;
      if (k === 'price' || k === 'age') {
        animal[k] = Number(req.body[k]);
      } else if (k === 'isNegotiable') {
        animal[k] = parseBool(req.body[k], animal[k]);
      } else {
        animal[k] = req.body[k];
      }
    }

    // Apply any removals first, then merge in new uploads. `removeImages` is a
    // comma-separated list of URLs (matches what we stored); `removeVideo=true`
    // wipes the videoUrl field.
    const { removeImages, removeVideo } = parseRemovals(req.body);
    if (removeImages.length > 0) {
      animal.images = (animal.images || []).filter((url) => !removeImages.includes(url));
    }
    if (removeVideo) animal.videoUrl = '';

    if (req.files?.length) {
      const { newImages, newVideoUrl } = splitMedia(req.files);
      if (req.query.mode === 'replace') {
        animal.images = newImages;
        if (newVideoUrl !== null) animal.videoUrl = newVideoUrl;
      } else {
        animal.images = [...(animal.images || []), ...newImages];
        // A new milking video always replaces the previous one (a listing
        // only has one videoUrl slot).
        if (newVideoUrl) animal.videoUrl = newVideoUrl;
      }
    }

    await animal.save();
    res.json(animal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * DELETE /api/animals/:id
 * Auth required — soft delete (only seller can delete their own)
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Not found' });
    if (animal.sellerId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    animal.isActive = false;
    await animal.save();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * POST /api/animals/:id/report
 * Auth required. Body: { reason, details? }
 * Buyer flags a listing for moderator review. Unique-index on
 * (animalId, reporterId) prevents the same user from spamming reports.
 */
const REPORT_REASONS = ['fake_photo', 'spam_or_duplicate', 'scam_price', 'animal_cruelty', 'other'];

router.post('/:id/report', protect, async (req, res) => {
  try {
    const { reason, details } = req.body;
    if (!REPORT_REASONS.includes(reason)) {
      return res.status(400).json({ message: 'Invalid reason' });
    }
    const animal = await Animal.findById(req.params.id);
    if (!animal) return res.status(404).json({ message: 'Listing not found' });

    // Sellers can't report their own listings.
    if (animal.sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot report your own listing' });
    }

    await Report.create({
      animalId: animal._id,
      reporterId: req.user._id,
      reason,
      details: (details || '').slice(0, 1000),
    });
    res.status(201).json({ message: 'Report received' });
  } catch (err) {
    // Duplicate report by same user → soft 200 so we don't trip the UI.
    if (err.code === 11000) {
      return res.status(200).json({ message: 'Already reported' });
    }
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
