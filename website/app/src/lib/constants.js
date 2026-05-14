// Single source of truth. Swap real values here when available.

export const SITE = {
  domain: 'pashubazaar.netlify.app',
  url: 'https://pashubazaar.netlify.app',
  name: 'Pashubazaar',
  tagline_mr: 'गावाचा विश्वासू पशुबाजार',
  tagline_hi: 'गाँव का भरोसेमंद पशु बाज़ार',
  tagline_en: "India's trusted village livestock marketplace",
  themeColor: '#047857',
};

export const APP = {
  // Replace with real Play Store URL when app is published.
  playStoreUrl: 'https://play.google.com/store/apps/details?id=com.pashubazaar.app',
  appStoreUrl: null,
  status: 'coming-soon',
};

export const SOCIAL = {
  whatsapp: '#',
  facebook: '#',
  youtube: '#',
  instagram: '#',
};

export const CONTACT = {
  supportEmail: 'hello@pashubazaar.com',
  partnerEmail: 'partners@pashubazaar.com',
};

export const FOUNDERS = [
  {
    key: 'hitendra',
    name: {
      en: 'Hitendra Patil',
      mr: 'हितेंद्र पाटील',
      hi: 'हितेंद्र पाटिल',
    },
    role: {
      en: 'Founder, CEO',
      mr: 'संस्थापक, सीईओ',
      hi: 'संस्थापक, सीईओ',
    },
    bio: {
      en: 'Founder and CEO at Pashubazaar. Building a trustworthy village livestock marketplace for rural India.',
      mr: 'Pashubazaar चे संस्थापक आणि CEO. ग्रामीण भारतासाठी विश्वासू गाव-पशुबाजार तयार करत आहेत.',
      hi: 'Pashubazaar के संस्थापक और CEO. ग्रामीण भारत के लिए भरोसेमंद गाँव का पशु बाज़ार बना रहे हैं।',
    },
  },
  {
    key: 'suryakant',
    name: {
      en: 'Suryakant Yengudle',
      mr: 'सूर्यकांत येंगुडले',
      hi: 'सूर्यकांत येंगुडले',
    },
    role: {
      en: 'Co-founder, CTO',
      mr: 'सह-संस्थापक, सीटीओ',
      hi: 'सह-संस्थापक, सीटीओ',
    },
    bio: {
      en: 'Co-founder and CTO at Pashubazaar. Leads engineering, product, and the mobile-first PWA experience.',
      mr: 'Pashubazaar चे सह-संस्थापक आणि CTO. अभियांत्रिकी, उत्पादन आणि मोबाईल-प्रथम PWA चे नेतृत्व करतात.',
      hi: 'Pashubazaar के सह-संस्थापक और CTO. इंजीनियरिंग, उत्पाद और मोबाइल-पहले PWA का नेतृत्व करते हैं।',
    },
  },
];

export const ANIMAL_TYPES = [
  { key: 'cow',      emoji: '🐄', en: 'Cow',     mr: 'गाय',     hi: 'गाय' },
  { key: 'buffalo',  emoji: '🐃', en: 'Buffalo', mr: 'म्हैस',    hi: 'भैंस' },
  { key: 'goat',     emoji: '🐐', en: 'Goat',    mr: 'शेळी',    hi: 'बकरी' },
  { key: 'sheep',    emoji: '🐑', en: 'Sheep',   mr: 'मेंढी',    hi: 'भेड़' },
  { key: 'chicken',  emoji: '🐔', en: 'Chicken', mr: 'कोंबडी',  hi: 'मुर्गी' },
  { key: 'pig',      emoji: '🐖', en: 'Pig',     mr: 'डुक्कर',  hi: 'सूअर' },
];

export const SUPPORTED_LANGS = ['mr', 'hi', 'en'];

export function pickLang(value, lng) {
  if (!value || typeof value !== 'object') return value;
  return value[lng] || value.en || value[Object.keys(value)[0]];
}
