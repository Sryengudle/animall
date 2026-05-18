import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import IconButton from './IconButton';

export default function BottomSheet({ open, onClose, title, children, footer }) {
  // Close on Escape and lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal="true">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="relative bg-surface-0 rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex flex-col items-center pt-3 pb-2 shrink-0">
              <div className="w-12 h-1.5 bg-surface-300 rounded-full" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-6 pb-3 border-b border-surface-200 shrink-0">
                <h3 className="text-body font-bold text-surface-900">{title}</h3>
                <IconButton icon={X} label="Close" size="sm" variant="ghost" onClick={onClose} />
              </div>
            )}
            <div className="overflow-y-auto px-6 py-5 flex-1">{children}</div>
            {footer && <div className="px-6 pt-3 pb-5 border-t border-surface-200 shrink-0">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

BottomSheet.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
};
