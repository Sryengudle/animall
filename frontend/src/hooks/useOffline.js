import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setOnline } from '@/store/slices/uiSlice';

/**
 * Hook: tracks online/offline status and syncs to Redux.
 */
export default function useOffline() {
  const dispatch = useDispatch();
  const isOnline = useSelector((s) => s.ui.isOnline);

  useEffect(() => {
    const handleOnline  = () => dispatch(setOnline(true));
    const handleOffline = () => dispatch(setOnline(false));
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [dispatch]);

  return isOnline;
}
