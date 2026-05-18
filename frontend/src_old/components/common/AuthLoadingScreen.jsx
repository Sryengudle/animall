import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import useLanguage from '@/hooks/useLanguage';

// Fullscreen verifying screen with a friendly cow + dotted progress.
export default function AuthLoadingScreen({ message }) {
  const { tr } = useLanguage();
  const text = message || tr('verifying_otp_msg');

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-primary-100 via-accent-50 to-accent-100">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 18, stiffness: 220 }}
        className="relative mb-8"
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 border-r-primary-300"
        />
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-2xl shadow-primary-500/30">
          <span className="text-display-xl">🐄</span>
        </div>
      </motion.div>

      <p className="text-body font-semibold text-surface-700 mb-3 text-center px-6 max-w-xs">{text}</p>

      <div className="flex gap-2">
        {[0, 0.15, 0.3].map((delay, i) => (
          <motion.span
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.9, delay }}
            className="w-2.5 h-2.5 bg-primary-600 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}

AuthLoadingScreen.propTypes = {
  message: PropTypes.string,
};
