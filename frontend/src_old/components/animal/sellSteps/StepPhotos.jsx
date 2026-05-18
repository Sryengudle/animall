import PropTypes from 'prop-types';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, X, Plus } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';
import { compressImage, fileToPreview } from '@/services/imageService';

const MAX_PHOTOS = 5;

export default function StepPhotos({ files, previews, onChange }) {
  const { tr } = useLanguage();
  const inputRef = useRef(null);

  const handlePick = async (e) => {
    const list = Array.from(e.target.files || []).slice(0, MAX_PHOTOS - files.length);
    const newFiles = [...files];
    const newPreviews = [...previews];
    for (const file of list) {
      const compressed = await compressImage(file);
      const preview = await fileToPreview(compressed);
      newFiles.push(compressed);
      newPreviews.push(preview);
    }
    onChange(newFiles, newPreviews);
    e.target.value = '';
  };

  const remove = (idx) => {
    const newFiles = [...files]; newFiles.splice(idx, 1);
    const newPreviews = [...previews]; newPreviews.splice(idx, 1);
    onChange(newFiles, newPreviews);
  };

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-h2 font-bold text-surface-900">{tr('sell_photos')}</h2>
        <p className="text-body-sm text-surface-500 mt-1">{tr('sell_photos_hint')}</p>
      </header>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        capture="environment"
        className="hidden"
        onChange={handlePick}
      />

      {files.length === 0 ? (
        // Empty state — full-width drop zone for first photo.
        <motion.button
          type="button"
          onClick={() => inputRef.current?.click()}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          aria-label={tr('add_photo')}
          className="w-full aspect-[5/3] rounded-3xl border-2 border-dashed border-primary-300 bg-gradient-to-br from-primary-50 to-primary-50 text-primary-700 flex flex-col items-center justify-center gap-2 hover:from-primary-100 hover:to-primary-100 transition-colors"
        >
          <span className="w-14 h-14 rounded-full bg-surface-0 shadow flex items-center justify-center">
            <Camera size={28} />
          </span>
          <span className="text-body font-bold">{tr('add_photo')}</span>
          <span className="text-caption text-primary-600/80">{tr('sell_photos_hint')}</span>
        </motion.button>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-surface-100 border-2 border-surface-200"
            >
              <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={tr('remove_photo')}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}

          {files.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label={tr('add_photo')}
              className="aspect-square rounded-2xl border-2 border-dashed border-primary-300 bg-primary-50/50 text-primary-700 flex flex-col items-center justify-center gap-1 hover:bg-primary-50 transition-colors"
            >
              <Plus size={24} />
              <span className="text-caption font-bold">{tr('add_photo')}</span>
            </button>
          )}
        </div>
      )}

      <p className="text-caption text-surface-400 text-center">{files.length} / {MAX_PHOTOS}</p>
    </section>
  );
}

StepPhotos.propTypes = {
  files: PropTypes.array.isRequired,
  previews: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};
