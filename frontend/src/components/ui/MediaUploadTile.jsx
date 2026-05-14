import PropTypes from 'prop-types';
import { useRef } from 'react';
import { Camera, Video } from 'lucide-react';

// Dashed-border media upload tile used in the Sell form for video / udder photo / milking video.
// Three together fit on one mobile screen as a 2-up + 1-full layout (set `fullWidth` for the third).
const MAX_MB = { photo: 5, video: 20 };

export default function MediaUploadTile({
  kind = 'photo',
  label,
  hint,
  icon,
  fullWidth = false,
  file,
  onFile,
  onError,
  className = '',
}) {
  const ref = useRef(null);
  const accept = kind === 'video' ? 'video/*' : 'image/*';
  const Icon = icon || (kind === 'video' ? Video : Camera);
  const ctaLabel = file
    ? 'Replace'
    : kind === 'video'
      ? 'Select video'
      : 'Select photo';

  function pick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const maxBytes = MAX_MB[kind] * 1024 * 1024;
    if (f.size > maxBytes) {
      onError?.(`File too large. Max ${MAX_MB[kind]} MB.`);
      e.target.value = '';
      return;
    }
    onFile?.(f);
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
        <p className="text-sm font-semibold text-surface-700">{label}</p>
        <div
          className="grid h-14 w-14 place-items-center rounded-2xl bg-surface-100 text-surface-600"
          aria-hidden="true"
        >
          <Icon size={28} />
        </div>
        {file ? (
          <p className="text-xs text-brand-700 truncate max-w-[180px]">{file.name}</p>
        ) : hint ? (
          <p className="text-xs text-surface-500">{hint}</p>
        ) : null}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="
            mt-1 px-4 py-2 rounded-2xl bg-brand-50 text-brand-700 text-sm font-bold
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
  onFile: PropTypes.func,
  onError: PropTypes.func,
  className: PropTypes.string,
};
