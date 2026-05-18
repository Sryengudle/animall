import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import useOffline from '@/hooks/useOffline';
import useLanguage from '@/hooks/useLanguage';

export default function OfflineBanner() {
  const isOnline = useOffline();
  const { tr } = useLanguage();

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -40, opacity: 0 }}
          role="status"
          aria-live="polite"
          className="fixed top-0 left-0 right-0 z-[60] bg-red-500 text-white text-center py-2 text-body-sm font-semibold flex items-center justify-center gap-2 shadow-md"
        >
          <WifiOff size={16} />
          {tr('no_internet')}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
