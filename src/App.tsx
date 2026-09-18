import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/common/Navigation';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { RequestAccessModal } from './components/common/RequestAccessModal';
import { LightboxModal } from './components/common/LightboxModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { PageTransition } from './components/common/PageTransition';
import { VaultPage } from './pages/VaultPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { CustomCursor } from './components/common/CustomCursor';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';

// Scroll to top helper on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <div className="relative min-h-screen bg-black text-bone flex flex-col justify-between selection:bg-gold selection:text-black">
        {/* Custom High-Fashion Cursor (Desktop only, reduced-motion aware) */}
        <CustomCursor />

        {/* Global Navigation */}
        <Navigation />

        {/* Main Routed Page Content — curtain page transitions */}
        <main className="flex-grow">
          <PageTransition>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:slug" element={<ProductDetailPage />} />
            <Route path="/vault" element={<VaultPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
          </PageTransition>
        </main>

        {/* Global Footer */}
        <Footer />

        {/* Global Modals & Drawers */}
        <CartDrawer />
        <RequestAccessModal />
        <LightboxModal />
        <SizeGuideModal />
      </div>
    </Router>
  );
};

export default App;
