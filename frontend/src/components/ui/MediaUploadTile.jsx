import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Camera, Video, X } from 'lucide-react';
import useLanguage from '@/hooks/useLanguage';

// Dashed-border media upload tile used in the Sell form for video / udder photo / milking video.
// Three together fit on one mobile screen as a 2-up + 1-full layout (set `fullWidth` for the third).
// When the user picks a file we render a thumbnail preview (image or video) instead of just the
// filename, so they can confirm the right asset is attached before posting.
const MAX_MB = { photo: 5, video: 20 };

export default function MediaUploadTile({
  kind = 'photo',
  label,
  hint,
  icon,
  fullWidth = false,
  file,
  existingUrl,       // URL of media already attached to the listing (edit mode)
  onFile,
  onRemoveExisting,  // called when the seller deletes existing media
  onError,
  className = '',
}) {
  const { tr } = useLanguage();
  const ref = useRef(null);
  const accept = kind === 'video' ? 'video/*' : 'image/*';
  const Icon = icon || (kind === 'video' ? Video : Camera);

  // What to render: a freshly-picked file beats existing media; existing
  // media beats the empty state.
  const hasFile = Boolean(file);
  const hasExisting = !hasFile && Boolean(existingUrl);

  // Three CTA states — all routed through i18n so the Marathi/Hindi sellers
  // don't see English buttons on an otherwise-translated page. The post-pick
  // "Replace" copy reuses the freshly-added mu_replace key; the empty-state
  // pick uses the existing select_photo / select_video keys (already in all
  // three locales).
  const ctaLabel = hasFile || hasExisting
    ? tr('mu_replace')
    : kind === 'video'
      ? tr('select_video')
      : tr('select_photo');

  // Create an object-URL preview for the selected file. We revoke it whenever
  // `file` changes (or the tile unmounts) to avoid leaking blob URLs.
  const [previewUrl, setPreviewUrl] = useState(null);
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return undefined; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Resolve which URL to show in the thumbnail.
  const thumbUrl = hasFile ? previewUrl : (hasExisting ? existingUrl : null);
  const thumbLabel = hasFile
    ? file.name
    : (hasExisting ? tr(kind === 'video' ? 'mu_current_video' : 'mu_current_photo') : '');

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const maxBytes = MAX_MB[kind] * 1024 * 1024;
    if (f.size > maxBytes) {
      // tr('mu_file_too_large', { mb }) → "File too large. Max {mb} MB."
      onError?.(tr('mu_file_too_large', { mb: MAX_MB[kind] }));
      e.target.value = '';
      return;
    }
    onFile?.(f);
  }

  function clearFile(e) {
    e.preventDefault();
    e.stopPropagation();
    if (hasFile) {
      onFile?.(null);
      if (ref.current) ref.current.value = '';
    } else if (hasExisting) {
      onRemoveExisting?.();
    }
  }

  return (
    <div
      className={`
        relative rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50/50
        px-4 py-5 ${fullWidth ? 'col-span-2' : ''} ${className}
      `}
    >
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={pick}
        aria-label={label}
      />

      <div className="flex flex-col items-center text-center gap-3">
        <p className="text-body-sm font-semibold text-surface-700">{label}</p>

        {thumbUrl ? (
          // Preview state — thumbnail of selected file OR existing media,
          // with a small clear button to remove it.
          <div className="relative w-full max-w-[180px]">
            {kind === 'video' ? (
              <video
                src={thumbUrl}
                className="w-full aspect-square object-cover rounded-2xl bg-black"
                muted
                playsInline
                preload="metadata"
              />
            ) : (
              <img
                src={thumbUrl}
                alt={thumbLabel}
                className="w-full aspect-square object-cover rounded-2xl bg-surface-100"
              />
            )}
            <button
              type="button"
              onClick={clearFile}
              aria-label={tr('mu_remove')}
              className="absolute -top-2 -right-2 grid place-items-center h-7 w-7 rounded-full bg-surface-900 text-white shadow-md hover:bg-surface-700 active:scale-95 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-100 text-surface-600"
            aria-hidden="true"
          >
            <Icon size={28} />
          </div>
        )}

        {hasFile ? (
          <p className="text-caption text-brand-700 truncate max-w-[180px]" title={file.name}>
            {file.name}
          </p>
        ) : hasExisting ? (
          <p className="text-caption text-brand-700">{thumbLabel}</p>
        ) : hint ? (
          <p className="text-caption text-surface-500">{hint}</p>
        ) : null}

        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="
            mt-1 px-4 py-2 rounded-2xl bg-brand-50 text-brand-700 text-body-sm font-bold
            border border-brand-300 hover:bg-brand-100 active:scale-95
            transition-colors min-h-touch focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-200
          "
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}

MediaUploadTile.propTypes = {
  kind: PropTypes.oneOf(['photo', 'video']),
  label: PropTypes.string.isRequired,
  hint: PropTypes.string,
  icon: PropTypes.elementType,
  fullWidth: PropTypes.bool,
  file: PropTypes.object,
  existingUrl: PropTypes.string,
  onFile: PropTypes.func,
  onRemoveExisting: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
};
