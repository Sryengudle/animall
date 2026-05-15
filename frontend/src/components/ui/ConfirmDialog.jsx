import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';

// Generic confirm dialog — replaces window.confirm() so the prompt matches the
// rest of our UI (rounded card, brand colors, theme-aware). Use for any
// destructive or non-trivial action (delete, logout, etc.).
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onClose,
}) {
  const palette = variant === 'danger'
    ? { btn: 'bg-red-600 hover:bg-red-700 active:bg-red-800', ring: 'bg-red-100 text-red-600' }
    : { btn: 'bg-brand-700 hover:bg-brand-800 active:bg-brand-900', ring: 'bg-brand-100 text-brand-700' };

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="text-center -mt-1">
        <div className={`mx-auto grid place-items-center h-14 w-14 rounded-full ${palette.ring}`}>
          <AlertTriangle size={26} />
        </div>
        {title && (
          <h3 className="mt-4 text-h3 font-extrabold text-surface-900">{title}</h3>
        )}
        {message && (
          <p className="mt-2 text-body-sm text-surface-600 leading-relaxed">{message}</p>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-2xl bg-surface-100 hover:bg-surface-200 active:bg-surface-300 text-surface-800 font-bold text-body-sm transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => { onConfirm?.(); onClose?.(); }}
          className={`flex-1 py-3 rounded-2xl text-white font-bold text-body-sm transition-colors ${palette.btn}`}
          autoFocus
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  variant: PropTypes.oneOf(['danger', 'primary']),
  onConfirm: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};
