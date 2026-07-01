import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex flex-col min-h-screen relative text-cream">
      {/* Fixed Premium Background Image (Mumbai Marine Drive Sunset) */}
      <div className="fixed inset-0 -z-50 overflow-hidden bg-[#110D1A]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat select-none pointer-events-none"
          style={{ 
            backgroundImage: `url('/images/sunset_bg.png')`,
            opacity: 0.65,
            filter: 'brightness(1.15) contrast(1.08) saturate(1.12)'
          }}
        />
        {/* Dark overlay to guarantee text legibility & elegant contrast */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-[#110D1A]/25 via-[#110D1A]/65 to-[#110D1A]"
        />
      </div>

      <ScrollToTop />
      <Navbar />
      <main className="flex-1 bg-transparent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <ChatWidget />
    </div>
  );
}
