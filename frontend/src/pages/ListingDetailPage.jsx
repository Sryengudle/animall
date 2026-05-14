import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Share2, Flag, MapPin, Phone, ChevronLeft, ChevronRight, Play,
} from 'lucide-react';

import Header from '../components/common/Header';
import useLanguage from '../hooks/useLanguage';
import { Avatar, StatTile } from '../components/ui';
import { DEMO_ANIMALS } from '../constants/demoAnimals';
import { isWishlisted, toggleWishlist, subscribeWishlist } from '../utils/wishlist';

function timeAgo(t, tr) {
  if (!t) return '';
  const diff = Date.now() - new Date(t).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return tr('time_just_now');
  if (m < 60) return `${m} ${tr('time_minutes_ago')}`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ${tr('time_hours_ago')}`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ${tr('time_days_ago')}`;
  return new Date(t).toLocaleDateString();
}

function formatINR(n) {
  if (n == null) return '';
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export default function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tr } = useLanguage();

  const apiAnimal = useSelector((s) => s.animals.list.find((a) => a._id === id));
  const animal = apiAnimal || DEMO_ANIMALS.find((a) => a._id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [liked, setLiked] = useState(() => animal && isWishlisted(animal._id));

  useEffect(() => {
    if (!animal) return;
    return subscribeWishlist((list) => setLiked(list.includes(animal._id)));
  }, [animal]);

  if (!animal) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Header title={tr('detail_not_found')} showBack />
        <div className="px-6 py-24 text-center">
          <p className="text-5xl mb-4">🐾</p>
          <p className="text-base text-surface-700 font-medium">{tr('detail_not_found')}</p>
          <button
            type="button"
            onClick={() => navigate('/buy')}
            className="mt-6 px-6 py-3 rounded-full bg-brand-700 text-white font-bold hover:bg-brand-800"
          >
            {tr('nav_buy')}
          </button>
        </div>
      </div>
    );
  }

  // Combined slides: video (if present) first, then photos.
  const slides = useMemo(() => {
    const out = [];
    if (animal.videoUrl) out.push({ kind: 'video', src: animal.videoUrl, poster: animal.posterUrl || animal.images?.[0] });
    (animal.images || []).forEach((src) => out.push({ kind: 'image', src }));
    return out;
  }, [animal]);

  const hasSlides = slides.length > 0;
  const [playing, setPlaying] = useState(false);
  const touchStartX = useRef(null);

  function goSlide(delta) {
    setPlaying(false);
    setActiveImg((i) => (i + delta + slides.length) % slides.length);
  }
  function jumpSlide(to) {
    if (to === activeImg) return;
    setPlaying(false);
    setActiveImg(to);
  }
  function onTouchStart(e) { touchStartX.current = e.touches[0].clientX; }
  function onTouchEnd(e) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) > 40 && slides.length > 1) goSlide(dx > 0 ? -1 : 1);
  }

  const current = hasSlides ? slides[Math.min(activeImg, slides.length - 1)] : null;
  const titleText = animal.title || animal.breed?.toUpperCase() || tr(animal.type);
  const callHref = animal.sellerPhone ? `tel:${animal.sellerPhone}` : null;
  const waHref = animal.sellerPhone
    ? `https://wa.me/91${String(animal.sellerPhone).replace(/\D/g, '').slice(-10)}`
    : null;

  return (
    <div className="min-h-screen bg-surface-50 pb-40">
      {/* Media carousel — full-bleed at top, swipeable, with floating back/share/flag */}
      <div
        className="relative bg-surface-900"
        onTouchStart={slides.length > 1 ? onTouchStart : undefined}
        onTouchEnd={slides.length > 1 ? onTouchEnd : undefined}
      >
        {hasSlides ? (
          <div className="relative aspect-[4/3]">
            {current.kind === 'video' ? (
              playing ? (
                <video
                  src={current.src}
                  controls
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover bg-black"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play video"
                  className="absolute inset-0 grid place-items-center bg-black/25 hover:bg-black/40 transition-colors"
                >
                  {current.poster && (
                    <img
                      src={current.poster}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover -z-[1]"
                    />
                  )}
                  <span className="relative grid place-items-center h-16 w-16 rounded-full bg-white/90 text-brand-800 shadow-lg">
                    <Play size={30} fill="currentColor" />
                  </span>
                </button>
              )
            ) : (
              <img
                src={current.src}
                alt={titleText}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Prev / Next arrows */}
            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goSlide(-1)}
                  aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => goSlide(1)}
                  aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Dot indicators */}
            {slides.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                {slides.slice(0, 8).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => jumpSlide(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === activeImg ? 'w-6 bg-white' : 'w-2 bg-white/60 hover:bg-white/85'
                    }`}
                  />
                ))}
                {slides.length > 8 && (
                  <span className="text-[10px] font-bold text-white bg-black/45 rounded-full px-1.5 py-0.5 ml-1">
                    +{slides.length - 8}
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] grid place-items-center text-7xl text-surface-400 bg-gradient-to-br from-brand-50 to-accent-50">
            🐾
          </div>
        )}

        {/* Floating top action row */}
        <div className="absolute inset-x-0 top-0 px-3 pt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="grid place-items-center h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(animal._id) && setLiked(!liked)}
              aria-label="Report"
              className="grid place-items-center h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
            >
              <Flag size={16} />
            </button>
            <button
              type="button"
              onClick={() => navigator.share?.({ title: titleText, url: window.location.href })}
              aria-label="Share"
              className="grid place-items-center h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm transition-colors"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Body card */}
      <main className="mx-auto max-w-xl px-4 -mt-6 relative">
        <article className="rounded-3xl bg-surface-0 shadow-card border border-surface-200/60 overflow-hidden">
          <div className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-surface-500">
                  {timeAgo(animal.createdAt, tr)}
                </p>
                <h1 className="mt-1 text-2xl font-extrabold text-surface-900 leading-tight">
                  {titleText}
                  {animal.type && (
                    <span className="text-surface-700 font-bold"> {tr(animal.type)}</span>
                  )}
                </h1>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-extrabold text-brand-800 leading-none">
                  {formatINR(animal.price)}
                </p>
                {animal.isNegotiable && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand-700/70 mt-1">
                    {tr('negotiable_only')}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            {animal.location && (
              <p className="mt-3 flex items-center gap-1.5 text-sm text-surface-700">
                <MapPin size={14} className="text-surface-500 shrink-0" />
                <span className="underline-offset-2 underline decoration-surface-300">
                  {animal.location}
                  {animal.distanceKm != null && (
                    <span className="text-surface-500"> (approx. <b>{animal.distanceKm} km</b>)</span>
                  )}
                </span>
              </p>
            )}

            {/* Stats grid */}
            {(animal.lactationLabel || animal.milkPerDay || animal.breed || animal.age) && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {animal.lactationLabel && (
                  <StatTile
                    label={tr('lactation_label')}
                    value={String(animal.lactationLabel).match(/^\d+/)?.[0] || animal.lactationLabel}
                  />
                )}
                {animal.milkPerDay && (
                  <StatTile label={tr('milk_capacity_label')} value={`${animal.milkPerDay} ${tr('lpd')}`} />
                )}
                {animal.breed && (
                  <StatTile label={tr('breed_label')} value={String(animal.breed).toUpperCase()} />
                )}
                {animal.age && (
                  <StatTile label={tr('age')} value={`${animal.age} ${tr(animal.ageUnit || 'years')}`} />
                )}
              </div>
            )}

            {/* Description */}
            {animal.description && (
              <div className="mt-5 pt-5 border-t border-surface-200">
                <p className="text-xs font-bold uppercase tracking-wider text-surface-500 mb-2">
                  {tr('detail_description')}
                </p>
                <p className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap">
                  {animal.description}
                </p>
              </div>
            )}
          </div>

          {/* Seller row */}
          {animal.sellerName && (
            <div className="border-t border-surface-200 px-5 py-4 flex items-center justify-between gap-3 bg-surface-50/50">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={animal.sellerName} size="md" />
                <div className="min-w-0">
                  <p className="text-base font-bold text-surface-900 truncate">{animal.sellerName}</p>
                  <p className="text-xs font-semibold text-success">
                    {tr('livestock_owner')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Sticky bottom action bar — icon-only Call + WhatsApp matching ListingCard */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface-0/95 backdrop-blur-sm border-t border-surface-200 px-4 py-3 safe-bottom">
        <div className="mx-auto max-w-xl flex items-center gap-3">
          {callHref && (
            <a
              href={callHref}
              className="flex-1 grid place-items-center py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-base shadow-md hover:from-blue-600 hover:to-blue-700 active:scale-95 transition-all"
            >
              <span className="inline-flex items-center gap-2">
                <Phone size={20} fill="currentColor" strokeWidth={0} />
                {tr('call_now')}
              </span>
            </a>
          )}
          {waHref && (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid place-items-center h-[52px] w-[52px] rounded-2xl bg-[#25D366] text-white hover:bg-[#1ebe57] active:scale-95 transition-all shadow-md shrink-0"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.07 1.6 5.85L2 22l4.39-1.7a9.86 9.86 0 0 0 5.65 1.78h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01A9.84 9.84 0 0 0 12.04 2zm5.83 14.07c-.25.7-1.42 1.32-1.98 1.41-.5.07-1.14.1-1.84-.12-.42-.13-.96-.31-1.66-.6-2.91-1.26-4.81-4.19-4.96-4.39-.15-.2-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.25-.29.55-.36.74-.36h.53c.17 0 .39-.06.61.46.25.6.84 2.05.91 2.2.07.15.12.32.02.52-.1.2-.15.32-.29.5-.15.17-.31.39-.44.52-.15.15-.3.31-.13.6.17.3.76 1.25 1.62 2.02 1.11.99 2.04 1.3 2.34 1.45.29.15.46.12.63-.07.17-.2.74-.86.94-1.16.2-.3.39-.25.66-.15.27.1 1.71.81 2 .96.29.15.49.22.56.34.07.12.07.7-.18 1.39z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
