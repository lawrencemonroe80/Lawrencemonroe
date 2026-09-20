import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navigation } from './components/common/Navigation';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { RequestAccessModal } from './components/common/RequestAccessModal';
import { SizeGuideModal } from './components/common/SizeGuideModal';
import { PageTransition } from './components/common/PageTransition';
import { MagazineFolio } from './components/common/MagazineFolio';
import { CustomCursor } from './components/common/CustomCursor';
import { HomePage } from './pages/HomePage';
import { DropPage } from './pages/DropPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FeedPage } from './pages/FeedPage';
import { ContactPage } from './pages/ContactPage';
import { CheckoutPage } from './pages/CheckoutPage';

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
      <div className="relative min-h-screen bg-black text-white flex flex-col justify-between selection:bg-gold selection:text-black">
        <CustomCursor />
        <Navigation />
        <MagazineFolio />

        <main className="flex-grow">
          <PageTransition>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/drop" element={<DropPage />} />
              <Route path="/drop/:slug" element={<ProductDetailPage />} />
              <Route path="/feed" element={<FeedPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </PageTransition>
        </main>

        <Footer />

        {/* Global modals & drawers */}
        <CartDrawer />
        <RequestAccessModal />
        <SizeGuideModal />
      </div>
    </Router>
  );
};

export default App;
