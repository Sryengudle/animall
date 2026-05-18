import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import OfflineBanner from './components/common/OfflineBanner';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

const LoginPage       = lazy(() => import('./pages/LoginPage'));
const OTPPage         = lazy(() => import('./pages/OTPPage'));
const HomePage        = lazy(() => import('./pages/HomePage'));
const BuyPage         = lazy(() => import('./pages/BuyPage'));
const SellPage        = lazy(() => import('./pages/SellPage'));
const ListingDetail   = lazy(() => import('./pages/ListingDetailPage'));
const MyListingsPage  = lazy(() => import('./pages/MyListingsPage'));
const ProfilePage     = lazy(() => import('./pages/ProfilePage'));
const EditProfilePage = lazy(() => import('./pages/EditProfilePage'));
const PreviewPage     = lazy(() => import('./pages/PreviewPage')); // /preview — redesign V2 primitives showcase

function ProtectedRoute({ children }) {
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

// Strip trailing slash so React Router's `basename` is happy.
// In dev BASE_URL is "/", in prod it's "/Animall/".
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename={routerBase}>
        <OfflineBanner />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: '16px',
              fontFamily: 'Noto Sans Devanagari, Noto Sans, sans-serif',
              fontWeight: '600',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            },
            // Toast icons use CSS-var-driven hex constants so they swap with theme.
            success: { iconTheme: { primary: 'var(--hex-primary)', secondary: '#fff' } },
            error:   { iconTheme: { primary: 'var(--hex-danger)',  secondary: '#fff' } },
          }}
        />

        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-accent-50">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp"   element={<OTPPage />} />

            <Route path="/"             element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/buy"          element={<ProtectedRoute><BuyPage /></ProtectedRoute>} />
            <Route path="/buy/:id"      element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
            {/* Legacy alias for push-notification URLs sent as /animal/:id by the
                backend. New code should emit /buy/:id; this keeps existing
                notifications resolving instead of bouncing to the catch-all. */}
            <Route path="/animal/:id"   element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
            <Route path="/sell"         element={<ProtectedRoute><SellPage /></ProtectedRoute>} />
            <Route path="/my-listings"  element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
            <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />

            {/* Redesign V2 primitives showcase — public so we can review without auth */}
            <Route path="/preview"      element={<PreviewPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
