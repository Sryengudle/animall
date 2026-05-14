import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import {
  MapPin, Phone, Flag, Share2, Play, ChevronLeft, ChevronRight,
} from 'lucide-react';
import useLanguage from '../../hooks/useLanguage';
import Avatar from '../ui/Avatar';
import StatTile from '../ui/StatTile';

// Rich animal-listing card matching the Pashu Mandi reference (image 8).
// Media block prefers video; falls back to first photo from `images`; falls back
// to nothing. Seller actions (Call + WhatsApp) are icon-only round buttons.
function timeAgo(t, tr) {
  if (!t) return '';
  const diffMs = Date.now() - new Date(t).getTime();
  const m = Math.floor(diffMs / 60000);
  if (m < 1) return tr('time_just_now');
  if (m < 60) return `${m} ${tr('time_minutes_ago')}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ${tr('time_hours_ago')}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ${tr('time_days_ago')}`;
  return new Date(t).toLocaleDateString();
}

function formatPriceINR(n) {
  if (n == null) return '';
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

// Swipeable media carousel — combines optional video + photo array into one
// slide track. Touch swipe, clickable dots, and prev/next arrows for users who
// don't realize they can swipe. All button clicks call stopPropagation so the
// surrounding card-level <Link> still works when you tap the body.
function MediaSlider({ videoUrl, images, title, posterUrl }) {
  const slides = useMemo(() => {
    const out = [];
    if (videoUrl) out.push({ kind: 'video', src: videoUrl, poster: posterUrl || images?.[0] });
    (images || []).forEach((src) => out.push({ kind: 'image', src }));
    return out;
  }, [videoUrl, images, posterUrl]);

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [broken, setBroken] = useState(false);
  const touchStartX = useRef(null);

  if (slides.length === 0) return null;

  const last = slides.length - 1;
  const current = slides[Math.min(idx, last)];

  function go(delta) {
    setBroken(false);
    setPlaying(false);
    setIdx((i) => (i + delta + slides.length) % slides.length);
  }

  function jump(to) {
    if (to === idx) return;
    setBroken(false);
    setPlaying(false);
    setIdx(to);
  }

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40 && slides.length > 1) go(dx > 0 ? -1 : 1);
  }

  return (
    <div
      className="absolute inset-0 bg-surface-100 select-none"
      onTouchStart={slides.length > 1 ? onTouchStart : undefined}
      onTouchEnd={slides.length > 1 ? onTouchEnd : undefined}
    >
      {current.kind === 'video' ? (
        playing ? (
          <video
            src={current.src}
            controls
            autoPlay
            playsInline
            className="absolute inset-0 w-full h-full object-cover bg-black"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPlaying(true); }}
            aria-label="Play video"
            className="absolute inset-0 grid place-items-center bg-black/20 hover:bg-black/35 transition-colors"
          >
            {current.poster && (
              <img
                src={current.poster}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover -z-[1]"
              />
            )}
            <span className="relative grid place-items-center h-14 w-14 rounded-full bg-white/90 text-brand-800 shadow-lg">
              <Play size={26} fill="currentColor" />
            </span>
          </button>
        )
      ) : broken ? (
        <span className="absolute inset-0 grid place-items-center text-5xl text-surface-400">
          🐾
        </span>
      ) : (
        <img
          src={current.src}
          alt={title || ''}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      )}

      {/* Prev / Next arrows — semi-transparent so they don't dominate, big enough to tap */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(-1); }}
            aria-label="Previous"
            className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); go(1); }}
            aria-label="Next"
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-sm transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dot indicators — clickable. Show up to 6 dots, then "+N" pill for the rest. */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {slides.slice(0, 6).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); jump(i); }}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
          {slides.length > 6 && (
            <span className="text-[10px] font-bold text-white bg-black/45 rounded-full px-1.5 py-0.5">
              +{slides.length - 6}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

MediaSlider.propTypes = {
  videoUrl: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string,
  posterUrl: PropTypes.string,
};

export default function ListingCard({
  id,
  title,
  type,
  price,
  isNegotiable,
  location,
  distanceKm,
  lactationLabel,
  milkPerDay,
  videoUrl,
  posterUrl,
  images,
  sellerName,
  sellerInitial,
  sellerPhone,
  whatsappPhone,
  createdAt,
  onFlag,
  onShare,
}) {
  const { tr } = useLanguage();
  const detailHref = id ? `/buy/${id}` : null;

  const callHref = sellerPhone ? `tel:${sellerPhone}` : null;
  const waHref = whatsappPhone || sellerPhone
    ? `https://wa.me/91${(whatsappPhone || sellerPhone).replace(/\D/g, '').slice(-10)}`
    : null;

  const hasImages = Array.isArray(images) && images.length > 0;
  const hasMedia = !!videoUrl || hasImages;
  const Wrapper = detailHref ? Link : 'div';
  const wrapperProps = detailHref ? { to: detailHref } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className="block rounded-3xl bg-surface-0 shadow-card overflow-hidden border border-surface-200/60 hover:shadow-lg transition-shadow"
    >
      {/* Media block: unified carousel (video + photos), swipeable, clickable dots, prev/next */}
      {hasMedia && (
        <div className="relative aspect-video bg-surface-100 overflow-hidden">
          <MediaSlider
            videoUrl={videoUrl}
            images={images}
            title={title}
            posterUrl={posterUrl}
          />

          {/* Top-right action icons */}
          {(onFlag || onShare) && (
            <div className="absolute top-3 right-3 flex gap-2">
              {onFlag && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); onFlag?.(id); }}
                  aria-label="Report listing"
                  className="grid place-items-center h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <Flag size={14} />
                </button>
              )}
              {onShare && (
                <button
                  type="button"
                  onClick={(e) => { e.preventDefault(); onShare?.(id); }}
                  aria-label="Share listing"
                  className="grid place-items-center h-9 w-9 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors backdrop-blur-sm"
                >
                  <Share2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Body */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold uppercase tracking-wider text-surface-500">
              {timeAgo(createdAt, tr)}
            </p>
            <h3 className="mt-1 text-lg font-extrabold text-surface-900 leading-tight">
              {title}
              {type && <span className="text-surface-700 font-bold"> {type}</span>}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xl font-extrabold text-brand-800 leading-none">
              {formatPriceINR(price)}
            </p>
            {isNegotiable && (
              <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700/70 mt-1">
                {tr('negotiable_only')}
              </p>
            )}
          </div>
        </div>

        {/* Location */}
        {location && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-surface-700">
            <MapPin size={14} className="text-surface-500 shrink-0" />
            <span className="underline-offset-2 underline decoration-surface-300">
              {location}
              {distanceKm != null && (
                <span className="text-surface-500"> (approx. <b>{distanceKm} km</b>)</span>
              )}
            </span>
          </p>
        )}

        {/* Stats grid */}
        {(lactationLabel || milkPerDay) && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {lactationLabel && (
              <StatTile label={tr('lactation_label')} value={lactationLabel} />
            )}
            {milkPerDay && (
              <StatTile label={tr('milk_capacity_label')} value={`${milkPerDay} ${tr('lpd')}`} />
            )}
          </div>
        )}

        {/* Seller row — icon-only Call + WhatsApp on the right */}
        {sellerName && (
          <>
            <div className="mt-4 border-t border-surface-200" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar name={sellerInitial || sellerName} size="sm" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-surface-900 truncate leading-tight">{sellerName}</p>
                  <p className="text-[11px] font-semibold text-success leading-tight">
                    {tr('livestock_owner')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {callHref && (
                  <a
                    href={callHref}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={tr('call_now')}
                    className="grid place-items-center h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all shadow-sm"
                  >
                    <Phone size={16} fill="currentColor" strokeWidth={0} />
                  </a>
                )}
                {waHref && (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="WhatsApp"
                    className="grid place-items-center h-9 w-9 rounded-full bg-[#25D366] text-white hover:bg-[#1ebe57] active:scale-95 transition-all shadow-sm"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.07 1.6 5.85L2 22l4.39-1.7a9.86 9.86 0 0 0 5.65 1.78h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01A9.84 9.84 0 0 0 12.04 2zm5.83 14.07c-.25.7-1.42 1.32-1.98 1.41-.5.07-1.14.1-1.84-.12-.42-.13-.96-.31-1.66-.6-2.91-1.26-4.81-4.19-4.96-4.39-.15-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.25-.29.55-.36.74-.36h.53c.17 0 .39-.06.61.46.25.6.84 2.05.91 2.2.07.15.12.32.02.52-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.62 2.02 1.11.99 2.04 1.3 2.34 1.45.29.15.46.12.63-.07.17-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.12.07.7-.18 1.39z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
}

ListingCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
  type: PropTypes.string,
  price: PropTypes.number.isRequired,
  isNegotiable: PropTypes.bool,
  location: PropTypes.string,
  distanceKm: PropTypes.number,
  lactationLabel: PropTypes.string,
  milkPerDay: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  videoUrl: PropTypes.string,
  posterUrl: PropTypes.string,
  images: PropTypes.arrayOf(PropTypes.string),
  sellerName: PropTypes.string,
  sellerInitial: PropTypes.string,
  sellerPhone: PropTypes.string,
  whatsappPhone: PropTypes.string,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  onFlag: PropTypes.func,
  onShare: PropTypes.func,
};
