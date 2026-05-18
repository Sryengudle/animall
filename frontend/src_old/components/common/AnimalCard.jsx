import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Share2, Phone, MapPin, Clock } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';
import { ANIMAL_META, breedI18nKey, calvingI18nKey } from '@/constants/animals';
import { formatPrice, timeAgo } from '@/utils/formatters';
import { callPhone, openWhatsApp } from '@/utils/contact';
import { shareOrCopy } from '@/utils/share';
import { isWishlisted, toggleWishlist, subscribeWishlist } from '@/utils/wishlist';
import { Card, ImageWithFallback, IconButton, Badge } from '@/components/ui';

const stop = (fn) => (e) => { e.stopPropagation(); e.preventDefault(); fn?.(e); };

export default function AnimalCard({ animal }) {
  const navigate = useNavigate();
  const { tr, lang } = useLanguage();
  const meta = ANIMAL_META[animal.type] || ANIMAL_META.other;

  const [liked, setLiked] = useState(() => isWishlisted(animal._id));
  useEffect(() => subscribeWishlist((list) => setLiked(list.includes(animal._id))), [animal._id]);

  // Build a compact, fully-localized title.
  const titleParts = [
    animal.breed && tr(breedI18nKey(animal.type, animal.breed)),
    animal.calving && animal.calving !== 'none' && `${tr(calvingI18nKey(animal.calving))} ${tr('calving')}`,
    animal.milkPerDay && `${animal.milkPerDay} ${tr('litre')}/${tr('day') || ''}`,
  ].filter(Boolean);
  const titleText =
    titleParts.length > 0
      ? titleParts.join(' · ')
      : `${meta.emoji} ${tr(animal.type)}`;

  const goDetail = () => navigate(`/buy/${animal._id}`);

  const handleCall = stop(() => callPhone(animal.sellerPhone, { tr }));
  const handleWhatsApp = stop(() => {
    const msg = tr('whatsapp_prefill', {
      type: tr(animal.type),
      price: formatPrice(animal.price),
    }) || `Hello! I'm interested in your ${tr(animal.type)} (${formatPrice(animal.price)}). — via ${tr('app_name')}`;
    openWhatsApp(animal.sellerPhone, msg);
  });
  const handleShare = stop(() => shareOrCopy({
    title: titleText,
    text: `${tr(animal.type)} — ${formatPrice(animal.price)}`,
    url: `${window.location.origin}/buy/${animal._id}`,
    tr,
  }));
  const handleHeart = stop(() => {
    const nowLiked = toggleWishlist(animal._id);
    setLiked(nowLiked);
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
    >
      <Card
        as="article"
        className="overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
        onClick={goDetail}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && goDetail()}
      >
        {/* Image with overlay actions */}
        <div className="relative">
          <ImageWithFallback
            src={animal.images?.[0]}
            alt={`${tr(animal.type)} — ${animal.breed || ''}`}
            fallback={animal.emoji || meta.emoji}
            className="w-full h-56 sm:h-60"
            imgClassName="object-cover"
          />
          {/* Gradient overlay for readability */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Top-right action chips */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <IconButton
              icon={Share2}
              label={tr('share')}
              size="sm"
              variant="default"
              onClick={handleShare}
            />
            <IconButton
              icon={Heart}
              label={tr('detail_wishlist')}
              size="sm"
              variant="default"
              onClick={handleHeart}
              className={liked ? '!bg-red-50 text-red-500 border-red-200' : ''}
            />
          </div>

          {/* Bottom-left price badge */}
          <div className="absolute bottom-3 left-3">
            <Badge tone="green" className="!px-3 !py-1.5 !text-body-sm shadow-lg backdrop-blur-sm bg-white/90">
              {formatPrice(animal.price)}
            </Badge>
          </div>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-2">
          <p className="text-body-sm font-bold text-surface-900 leading-snug line-clamp-2">
            {titleText}
          </p>

          <div className="flex items-center gap-3 text-caption text-surface-500">
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {timeAgo(animal.createdAt, tr)}
            </span>
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin size={12} /> <span className="truncate">{animal.location}</span>
            </span>
          </div>

          {/* Seller + actions */}
          <div className="flex items-center justify-between pt-2 border-t border-surface-200">
            <div className="text-caption text-surface-600 truncate min-w-0">
              <span className="font-bold text-primary-700">{animal.sellerName || tr('seller')}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCall}
                aria-label={tr('call')}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600
                           text-white px-3 py-2 rounded-full text-caption font-bold shadow-md
                           hover:shadow-lg active:scale-95 transition-all"
              >
                <Phone size={14} /> {tr('call')}
              </button>
              <button
                onClick={handleWhatsApp}
                aria-label={tr('whatsapp')}
                className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-[#25D366]
                           shadow-md hover:shadow-lg active:scale-95 transition-all"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

AnimalCard.propTypes = {
  animal: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    breed: PropTypes.string,
    calving: PropTypes.string,
    milkPerDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    location: PropTypes.string,
    sellerName: PropTypes.string,
    sellerPhone: PropTypes.string.isRequired,
    images: PropTypes.array,
    emoji: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
};
