import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

const Home           = lazy(() => import('./pages/Home'));
const About          = lazy(() => import('./pages/About'));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'));
const FeaturesPage   = lazy(() => import('./pages/FeaturesPage'));
const Download       = lazy(() => import('./pages/Download'));
const Contact        = lazy(() => import('./pages/Contact'));
const Legal          = lazy(() => import('./pages/Legal'));
const NotFound       = lazy(() => import('./pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="py-32 text-center text-muted">Loading…</div>}>
          <Routes>
            <Route path="/"              element={<Home />} />
            <Route path="/about"         element={<About />} />
            <Route path="/how-it-works"  element={<HowItWorksPage />} />
            <Route path="/features"      element={<FeaturesPage />} />
            <Route path="/download"      element={<Download />} />
            <Route path="/contact"       element={<Contact />} />
            <Route path="/legal"         element={<Legal />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
