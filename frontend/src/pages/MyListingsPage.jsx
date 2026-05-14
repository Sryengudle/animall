import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '../components/common/Header';
import BottomNav from '../components/common/BottomNav';
import ListingCard from '../components/common/ListingCard';
import { fetchMyListings, deleteAnimal } from '../store/slices/animalsSlice';
import useLanguage from '../hooks/useLanguage';

// "My Cattle" — the third tab in the bottom nav (reference image 16).
// Card-based empty state when the seller has no listings yet. Once they list
// something, each ListingCard shows + a small Delete icon in the top-right.

function EmptyState({ tr, onSell }) {
  return (
    <div className="mx-4 mt-4 rounded-3xl bg-surface-0 shadow-card px-6 py-16 text-center">
      <h2 className="text-2xl font-extrabold text-brand-800">{tr('no_animals_listed')}</h2>
      <p className="mt-3 text-base text-surface-500 max-w-xs mx-auto leading-relaxed">
        {tr('no_animals_listed_sub')}
      </p>
      <button
        type="button"
        onClick={onSell}
        className="mt-6 inline-flex items-center justify-center px-7 py-3 rounded-full bg-brand-700 text-white font-bold text-base shadow-button hover:bg-brand-800 active:scale-95 transition-all"
      >
        {tr('sell_livestock')}
      </button>
    </div>
  );
}

export default function MyListingsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const { myListings = [] } = useSelector((s) => s.animals);
  const { token } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMyListings()); }, [dispatch]);

  function handleDelete(id) {
    if (!window.confirm(tr('confirm_delete'))) return;
    dispatch(deleteAnimal({ id, token }));
    toast.success(tr('listing_deleted'));
  }

  return (
    <div className="min-h-screen bg-surface-50 pb-28">
      <Header />

      {myListings.length === 0 ? (
        <EmptyState tr={tr} onSell={() => navigate('/sell')} />
      ) : (
        <main className="mx-auto max-w-xl px-4 pt-4 space-y-4">
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">
              {tr('nav_my_cattle')}
            </p>
            <p className="text-xs font-bold uppercase tracking-wider text-surface-500">
              {myListings.length} ANIMALS
            </p>
          </div>

          {myListings.map((a) => (
            <div key={a._id} className="relative">
              <ListingCard
                id={a._id}
                title={a.title || a.breed?.toUpperCase() || tr(a.type)}
                type={tr(a.type) || a.type}
                price={a.price}
                isNegotiable={a.isNegotiable}
                location={a.location}
                distanceKm={a.distanceKm}
                lactationLabel={a.lactationLabel}
                milkPerDay={a.milkPerDay}
                images={a.images}
                videoUrl={a.videoUrl}
                posterUrl={a.posterUrl}
                sellerName={a.sellerName}
                sellerPhone={a.sellerPhone}
                createdAt={a.createdAt}
                onShare={() => {}}
              />
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); handleDelete(a._id); }}
                aria-label={tr('delete')}
                className="absolute top-3 left-3 grid place-items-center h-9 w-9 rounded-full bg-black/45 text-white hover:bg-red-600 transition-colors backdrop-blur-sm z-10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </main>
      )}

      <BottomNav />
    </div>
  );
}
