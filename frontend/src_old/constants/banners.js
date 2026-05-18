// Home page hero banners — content is i18n-keyed, images and routing here.

export const HOME_BANNERS = [
  {
    key: 'buy',
    titleKey: 'home_banner_buy_title',
    subtitleKey: 'home_banner_buy_subtitle',
    ctaKey: 'home_banner_buy_cta',
    to: '/buy',
    variant: 'primary',
    images: [
      { src: '/images/banners/cattleGrp.png', altKey: 'home_banner_buy_alt' },
    ],
  },
  {
    key: 'sell',
    titleKey: 'home_banner_sell_title',
    subtitleKey: 'home_banner_sell_subtitle',
    ctaKey: 'home_banner_sell_cta',
    to: '/sell',
    variant: 'secondary',
    images: [
      { src: '/images/banners/person1.png',      altKey: 'home_banner_sell_alt' },
      { src: '/images/banners/person2.png',      altKey: 'home_banner_sell_alt' },
      { src: '/images/banners/person3.png',      altKey: 'home_banner_sell_alt' },
      { src: '/images/banners/singleCattle.png', altKey: 'home_banner_sell_alt' },
    ],
  },
];