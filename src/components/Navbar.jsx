import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Phone, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  const solid = scrolled || !isHome;
  const logoLeft = isHome && !scrolled;
  const textClass = 'text-white/90';
  const linkHover = 'hover:text-white';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        solid
          ? 'bg-[#110D1A]/55 backdrop-blur-xl py-3.5 border-b border-white/5 shadow-luxury'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container-wide relative flex items-center justify-between">
        {/* Left Column: Desktop navigation / Empty spacer on mobile */}
        <div className="flex-1 flex justify-start">
          <div className="hidden md:flex items-center gap-6">
            {[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'Properties' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `text-xs uppercase tracking-wider font-bold transition-all duration-300 pb-1 ${linkHover} ${
                    isActive
                      ? 'text-white border-b border-accent'
                      : 'text-white/80'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Styled Luxurious Text Logo — sits aligned with the hero content, slides to center once scrolled.
            Always anchored at left-0 and moved purely via transform so the motion is one continuous slide
            instead of animating the "left" property (which caused a visible jump). */}
        <Link
          to="/"
          className={`absolute left-0 top-1/2 -translate-y-1/2 flex flex-col leading-none select-none group z-10 transition-all duration-500 ease-out md:translate-x-[calc(50vw_-_50%)] md:items-center md:text-center ${
            logoLeft
              ? 'translate-x-5 sm:translate-x-8 items-start text-left'
              : 'translate-x-[calc(50vw_-_50%)] items-center text-center'
          }`}
        >
          <span className="font-serif font-bold text-2xl tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-accent">
            SYNEX
          </span>
          <span className="text-[8px] font-bold tracking-[0.38em] text-accent/95 uppercase -mt-0.5">
            REALTY
          </span>
        </Link>

        {/* Right Column: Desktop CTA & Phone / Mobile Hamburger */}
        <div className="flex-1 flex items-center justify-end gap-6">
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+919876543210"
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors ${linkHover} ${textClass}`}
            >
              <Phone size={13} className="text-white" />
              +91 98765 43210
            </a>
            <Link
              to="/contact"
              className="bg-accent hover:bg-accent-dark text-white text-xs uppercase tracking-widest font-bold px-6 py-3 rounded-full transition-all duration-300 shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`md:hidden p-2 rounded transition-colors ${textClass}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 shadow-float backdrop-blur-xl animate-fade-in">
          <div className="container-wide py-5 flex flex-col gap-2 bg-[#110D1A]/95">
            {[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'Properties' },
              { to: '/contact', label: 'Contact' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `py-3 px-2 text-xs uppercase tracking-wider font-semibold border-b border-white/5 transition-colors ${
                    isActive ? 'text-white' : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 py-3 px-2 text-xs uppercase tracking-wider font-semibold text-white/80 border-b border-white/5"
            >
              <Phone size={13} className="text-white" />
              +91 98765 43210
            </a>
            <Link
              to="/contact"
              className="mt-3 bg-accent hover:bg-accent-dark text-white text-xs uppercase tracking-widest font-bold px-5 py-3.5 rounded-full text-center shadow-luxury"
            >
              Enquire Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
