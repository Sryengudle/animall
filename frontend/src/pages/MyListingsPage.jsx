import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Trash2, Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import Header from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';
import ListingCard from '@/components/common/ListingCard';
import { ConfirmDialog } from '@/components/ui';
import { fetchMyListings, deleteAnimal } from '@/store/slices/animalsSlice';
import useLanguage from '@/hooks/useLanguage';

// "My Cattle" — the third tab in the bottom nav (reference image 16).
// Card-based empty state when the seller has no listings yet. Once they list
// something, each ListingCard shows + a small Delete icon in the top-right.

function EmptyState({ tr, onSell }) {
  return (
    <div className="mx-4 mt-4 rounded-3xl bg-surface-0 shadow-card px-6 py-16 text-center">
      <h2 className="text-h1 font-extrabold text-brand-800">{tr('no_animals_listed')}</h2>
      <p className="mt-3 text-body text-surface-500 max-w-xs mx-auto leading-relaxed">
        {tr('no_animals_listed_sub')}
      </p>
      <button
        type="button"
        onClick={onSell}
        className="mt-6 inline-flex items-center justify-center px-7 py-3 rounded-full bg-brand-700 text-white font-bold text-body shadow-button hover:bg-brand-800 active:scale-95 transition-all"
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

  // Custom in-app confirm (replaces window.confirm). pendingDelete holds the
  // listing id while the dialog is open.
  const [pendingDelete, setPendingDelete] = useState(null);

  function askDelete(id) {
    setPendingDelete(id);
  }
  function confirmDelete() {
    if (!pendingDelete) return;
    dispatch(deleteAnimal({ id: pendingDelete, token }));
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
            <p className="text-caption font-bold uppercase tracking-wider text-surface-500">
              {tr('nav_my_cattle')}
            </p>
            <p className="text-caption font-bold uppercase tracking-wider text-surface-500">
              {myListings.length} ANIMALS
            </p>
          </div>

          {myListings.map((a) => {
            const breedKey = a.breed ? `breed_${a.type}_${a.breed}` : null;
            const breedLabel = breedKey ? tr(breedKey) : '';
            const calvingLabel = a.lactationLabel
              || (a.calving ? tr(`calving_${a.calving}`) || a.calving : '');
            return (
            <div key={a._id} className="relative">
              <ListingCard
                id={a._id}
                title={a.title || breedLabel || tr(a.type)}
                type={tr(a.type) || a.type}
                typeKey={a.type}
                breedLabel={breedLabel}
                age={a.age}
                ageUnit={a.ageUnit}
                description={a.description}
                price={a.price}
                isNegotiable={a.isNegotiable}
                location={a.location}
                distanceKm={a.distanceKm}
                lactationLabel={calvingLabel}
                milkPerDay={a.milkPerDay}
                images={a.images}
                videoUrl={a.videoUrl}
                posterUrl={a.posterUrl}
                sellerName={a.sellerName}
                sellerPhone={a.sellerPhone}
                createdAt={a.createdAt}
              />
              {/* Edit + Delete pill — fixed top-left of the card, stops
                  propagation so it doesn't trigger the card-level Link. */}
              <div className="absolute top-3 left-3 flex items-center gap-2 z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/sell?edit=${a._id}`);
                  }}
                  aria-label={tr('edit')}
                  className="grid place-items-center h-9 w-9 rounded-full bg-black/45 text-white hover:bg-brand-700 transition-colors backdrop-blur-sm"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    askDelete(a._id);
                  }}
                  aria-label={tr('delete')}
                  className="grid place-items-center h-9 w-9 rounded-full bg-black/45 text-white hover:bg-red-600 transition-colors backdrop-blur-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            );
          })}
        </main>
      )}

      <BottomNav />

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title={tr('confirm_delete')}
        message={tr('confirm_delete_sub')}
        confirmLabel={tr('delete')}
        cancelLabel={tr('cancel')}
        variant="danger"
        onConfirm={confirmDelete}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
