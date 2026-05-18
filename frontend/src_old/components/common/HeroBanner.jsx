import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Reusable hero banner — content is passed in fully translated.
export default function HeroBanner({
  title, subtitle, ctaText, onClick,
  images = [], variant = 'primary',
}) {
  // Hero banners use brand-* (non-inverting) so the emerald identity persists
  // in both light and dark modes — they're meant to be a visual anchor.
  const gradient =
    variant === 'primary'
      ? 'from-brand-700 via-brand-600 to-brand-500'
      : 'from-accent-600 via-accent-500 to-accent-400';

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-label={title}
      className={`
        w-full bg-gradient-to-br ${gradient} rounded-2xl p-5 flex items-center gap-3
        text-left shadow-xl shadow-black/10 relative overflow-hidden
        focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30
      `}
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-12 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 w-36 h-36 bg-white/10 rounded-full blur-2xl" />

      <div className="flex-1 relative z-10">
        <h2 className="text-h3 font-extrabold text-white inline-flex items-center gap-1">
          {title}
          <ChevronRight size={18} className="opacity-90" />
        </h2>
        <p className="text-body-sm text-white/90 mt-1 leading-snug max-w-[20ch]">{subtitle}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          <span className="text-[11px] font-semibold text-white/90">{ctaText}</span>
        </div>
      </div>

      {/* Image stack — simple, scales across variants */}
      <div className="relative h-28 w-32 flex-shrink-0 z-10">
        {variant === 'primary' ? (
          images[0]?.src && (
            <motion.img
              src={images[0].src}
              alt={images[0]?.alt || ''}
              className="absolute bottom-0 right-0 w-32 h-28 object-contain drop-shadow-lg"
              loading="lazy"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.45 }}
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
          )
        ) : (
          images.slice(0, 4).map((img, i) => {
            const pos = [
              'top-0 right-3 w-12 h-12',
              'top-7 left-0 w-12 h-12',
              'bottom-2 right-0 w-12 h-12',
              'bottom-0 left-6 w-16 h-16',
            ][i];
            return (
              <motion.img
                key={i}
                src={img.src}
                alt={img.alt || ''}
                className={`absolute ${pos} rounded-full object-cover border-2 border-white/80 shadow-md`}
                loading="lazy"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            );
          })
        )}
      </div>
    </motion.button>
  );
}

HeroBanner.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  ctaText: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  })),
  variant: PropTypes.oneOf(['primary', 'secondary']),
};
