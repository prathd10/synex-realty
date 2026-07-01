import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const SocialIcons = [
  { label: 'IG', href: '#' },
  { label: 'FB', href: '#' },
  { label: 'IN', href: '#' },
  { label: 'X', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-[#110D1A]/75 backdrop-blur-xl text-cream/70 border-t border-white/5">
      <div className="container-wide py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-5">
            <img 
              src="/images/synex_logo.png" 
              alt="Synex Logo" 
              className="w-9 h-9 object-contain" 
            />
            <div className="leading-none text-left">
              <div className="font-serif font-bold text-xl tracking-wide text-white">SYNEX</div>
              <div className="text-[9px] font-semibold tracking-[0.25em] uppercase text-white">REALTY</div>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-cream/50 mb-6">
            Mumbai's most trusted property consultants. We connect discerning buyers with premium residential and commercial properties across the city.
          </p>
          <div className="flex gap-3">
            {SocialIcons.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="w-9 h-9 rounded-full border border-white/10 text-white/70 flex items-center justify-center hover:border-accent hover:text-white hover:bg-white/[0.02] transition-all duration-300 text-xs font-bold"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: '/', label: 'Home' },
              { to: '/properties', label: 'All Properties' },
              { to: '/properties?type=Residential', label: 'Residential' },
              { to: '/properties?type=Commercial', label: 'Commercial' },
              { to: '/contact', label: 'Contact Us' },
            ].map(({ to, label }) => (
              <li key={label}>
                <Link
                  to={to}
                  className="text-xs hover:text-white transition-colors duration-300"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Popular Areas</h4>
          <ul className="space-y-3">
            {['Bandra West', 'Worli', 'Lower Parel', 'Juhu', 'Powai', 'Malabar Hill'].map(area => (
              <li key={area}>
                <Link
                  to={`/properties?area=${encodeURIComponent(area)}`}
                  className="text-xs hover:text-white transition-colors duration-300"
                >
                  {area}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-5">Get In Touch</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-xs leading-relaxed">
              <MapPin size={14} className="text-white shrink-0 mt-0.5" />
              <span className="text-cream/60">Office 301, The Hub,<br />BKC, Bandra East,<br />Mumbai – 400051</span>
            </li>
            <li>
              <a href="tel:+919876543210" className="flex gap-3 text-xs hover:text-white transition-colors duration-300">
                <Phone size={14} className="text-white shrink-0" />
                +91 98765 43210
              </a>
            </li>
            <li>
              <a href="mailto:hello@synexrealty.com" className="flex gap-3 text-xs hover:text-white transition-colors duration-300">
                <Mail size={14} className="text-white shrink-0" />
                hello@synexrealty.com
              </a>
            </li>
          </ul>
          <div className="mt-6 p-4 bg-white/[0.02] rounded-lg border border-white/[0.05] text-[10px] text-cream/40 leading-relaxed">
            RERA Registration No.<br />
            <span className="text-white font-mono tracking-wider block mt-0.5">MH/RERA/A51800005XXX</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.05] bg-primary-900/40">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-cream/35">
          <span>© 2026 Synex Realty. All rights reserved.</span>
          <span>Designed with absolute distinction. All data is illustrative.</span>
        </div>
      </div>
    </footer>
  );
}
