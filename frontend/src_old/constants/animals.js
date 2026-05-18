// Animal taxonomy + UI metadata. Labels live in i18n; this file only stores
// keys, visual hints, and structural relationships.

export const ANIMAL_TYPES = [
  { key: 'cow',     emoji: '🐄' },
  { key: 'buffalo', emoji: '🐃' },
  { key: 'goat',    emoji: '🐐' },
  { key: 'chicken', emoji: '🐓' },
  { key: 'sheep',   emoji: '🐑' },
  { key: 'pig',     emoji: '🐷' },
  { key: 'other',   emoji: '🐾' },
];

// Breed keys per animal — paired with i18n keys like `breed_cow_jersey_cross`.
export const BREEDS = {
  cow:     ['jersey_cross', 'hf', 'gir', 'sahiwal', 'khillar', 'other'],
  buffalo: ['murrah', 'jaffarabadi', 'haryana', 'surti', 'mehsana', 'other'],
  goat:    ['osmanabadi', 'sangamneri', 'berari', 'other'],
  chicken: ['desi', 'other'],
  sheep:   ['deccani', 'other'],
  pig:     ['other'],
  other:   ['other'],
};

export const CALVING_OPTIONS = ['none', 'first', 'second', 'third', 'other'];

export const AGE_UNITS = ['months', 'years'];

// Visual metadata for fallbacks when images are missing.
// Backgrounds use surface tokens so they auto-adapt in dark mode; the emoji
// carries the type differentiation.
export const ANIMAL_META = {
  cow:     { emoji: '🐄', bg: 'bg-accent-50',  border: 'border-accent-200' },
  buffalo: { emoji: '🐃', bg: 'bg-surface-100', border: 'border-surface-200' },
  goat:    { emoji: '🐐', bg: 'bg-accent-100', border: 'border-accent-200' },
  chicken: { emoji: '🐓', bg: 'bg-accent-50',  border: 'border-accent-200' },
  sheep:   { emoji: '🐑', bg: 'bg-surface-100', border: 'border-surface-200' },
  pig:     { emoji: '🐷', bg: 'bg-surface-100', border: 'border-surface-200' },
  other:   { emoji: '🐾', bg: 'bg-primary-50', border: 'border-primary-200' },
};

// i18n key helpers — keep grammar of label lookup in one place.
export const breedI18nKey = (type, breed) => `breed_${type}_${breed}`;
export const calvingI18nKey = (calving) => `calving_${calving}`;
