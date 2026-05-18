// 6 sample listings shown on the Buy page when the API returns no results.
// Keeps the Buy page visually demonstrable during dev. Real API data takes
// precedence whenever it's available.
//
// Photos are pulled from a small set of verified Unsplash URLs (cow / buffalo /
// goat). Any unknown photo ID risks serving the wrong animal — we had a GIR
// listing accidentally showing a tiger because the URL wasn't verified.
const COW_PHOTOS = [
  'https://images.unsplash.com/photo-1546445317-29f4545e9d53?w=900&q=70&auto=format',
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=70&auto=format',
  'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?w=900&q=70&auto=format',
];
const BUFFALO_PHOTOS = [
  'https://images.unsplash.com/photo-1605132949454-9f9b3ee7f3d3?w=900&q=70&auto=format',
];
const GOAT_PHOTOS = [
  'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=900&q=70&auto=format',
];

const now = Date.now();
const minutes = (n) => new Date(now - n * 60 * 1000).toISOString();
const hours = (n) => new Date(now - n * 60 * 60 * 1000).toISOString();

export const DEMO_ANIMALS = [
  {
    _id: 'demo-1',
    type: 'cow',
    breed: 'hf',
    title: 'HOLSTEIN FRIESIAN',
    price: 35000,
    isNegotiable: true,
    location: 'Idrishpur',
    distanceKm: 110,
    lactationLabel: '1 Lactation',
    milkPerDay: 10,
    images: COW_PHOTOS,
    sellerName: 'Deepak',
    sellerPhone: '9876543210',
    createdAt: minutes(15),
  },
  {
    _id: 'demo-2',
    type: 'buffalo',
    breed: 'murrah',
    title: 'MURRAH',
    price: 85000,
    isNegotiable: true,
    location: 'Rithal Phogat',
    distanceKm: 87,
    lactationLabel: '2 Lactation',
    milkPerDay: 13,
    images: BUFFALO_PHOTOS,
    sellerName: 'Mohit Phal',
    sellerPhone: '9123456780',
    createdAt: minutes(17),
  },
  {
    _id: 'demo-3',
    type: 'cow',
    breed: 'sahiwal',
    title: 'SAHIWAL',
    price: 62000,
    isNegotiable: false,
    location: 'Nashik',
    distanceKm: 42,
    lactationLabel: '3 Lactation',
    milkPerDay: 14,
    images: [COW_PHOTOS[1]],
    sellerName: 'Ramesh',
    sellerPhone: '9988776655',
    createdAt: hours(2),
  },
  {
    _id: 'demo-4',
    type: 'buffalo',
    breed: 'jaffarabadi',
    title: 'JAFFARABADI',
    price: 1_20_000,
    isNegotiable: true,
    location: 'Kolhapur',
    distanceKm: 220,
    lactationLabel: '1 Lactation',
    milkPerDay: 16,
    images: BUFFALO_PHOTOS,
    sellerName: 'Sunil',
    sellerPhone: '9090909090',
    createdAt: hours(5),
  },
  {
    _id: 'demo-5',
    type: 'cow',
    breed: 'gir',
    title: 'GIR',
    price: 75000,
    isNegotiable: true,
    location: 'Pune',
    distanceKm: 18,
    lactationLabel: '2 Lactation',
    milkPerDay: 12,
    images: [COW_PHOTOS[2], COW_PHOTOS[0]],
    sellerName: 'Anil',
    sellerPhone: '9876512340',
    createdAt: hours(8),
  },
  {
    _id: 'demo-6',
    type: 'goat',
    breed: 'osmanabadi',
    title: 'OSMANABADI',
    price: 18000,
    isNegotiable: false,
    location: 'Solapur',
    distanceKm: 95,
    images: GOAT_PHOTOS,
    sellerName: 'Vikas',
    sellerPhone: '9123456000',
    createdAt: hours(20),
  },
];
