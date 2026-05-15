const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

// Accept images (jpg/png/webp) AND videos (mp4/mov/webm). Sell flow has a
// milking-video tile that goes through the same `images[]` field for V1.
const IMAGE_EXTS = /jpeg|jpg|png|webp/;
const VIDEO_EXTS = /mp4|mov|webm|quicktime|m4v/;

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const isImage = IMAGE_EXTS.test(ext) && IMAGE_EXTS.test(file.mimetype);
  const isVideo = VIDEO_EXTS.test(ext) && /^video\//.test(file.mimetype);
  if (isImage || isVideo) cb(null, true);
  else cb(new Error('Only images (jpg/png/webp) or videos (mp4/mov/webm) accepted'));
};

const upload = multer({
  storage,
  fileFilter,
  // 20 MB to accommodate short milking videos. Profile-photo upload uses the
  // same multer; tighten there if we ever care about a smaller cap for avatars.
  limits: { fileSize: 20 * 1024 * 1024 },
});

module.exports = upload;
