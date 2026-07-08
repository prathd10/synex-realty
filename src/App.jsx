import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProperties from './pages/admin/Properties';
import PropertyForm from './pages/admin/PropertyForm';
import AdminTestimonials from './pages/admin/Testimonials';
import AdminLeads from './pages/admin/Leads';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import { logPageView } from './lib/queries';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function RouteTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith('/admin')) logPageView(pathname);
  }, [pathname]);
  return null;
}

function PublicSite() {
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

export default function App() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <RouteTracker />
      {isAdmin ? (
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="properties" element={<AdminProperties />} />
              <Route path="properties/new" element={<PropertyForm />} />
              <Route path="properties/:id/edit" element={<PropertyForm />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="leads" element={<AdminLeads />} />
            </Route>
          </Route>
        </Routes>
      ) : (
        <PublicSite />
      )}
    </>
  );
}
