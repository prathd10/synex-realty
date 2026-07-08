import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Building2, Quote, Inbox, ExternalLink, LogOut } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { to: '/admin/leads', label: 'Leads', icon: Inbox },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#110D1A] text-cream">
      <aside className="w-64 shrink-0 border-r border-white/5 bg-[#0D0A14] flex flex-col p-5">
        <div className="flex items-center gap-3 mb-8 px-1">
          <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="font-serif font-bold text-accent text-sm">S</span>
          </div>
          <div className="leading-tight">
            <div className="font-serif font-bold text-white text-sm tracking-wide">Synex Admin</div>
            <div className="text-[9px] uppercase tracking-widest text-cream/40 font-bold">Synex Realty</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                  isActive
                    ? 'bg-accent/15 text-white border-accent/30'
                    : 'text-cream/55 hover:text-white hover:bg-white/5 border-transparent'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1.5 pt-4 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cream/55 hover:text-white hover:bg-white/5 transition-all duration-300"
          >
            <ExternalLink size={15} />
            View Website
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-cream/55 hover:text-red-300 hover:bg-red-950/20 transition-all duration-300"
          >
            <LogOut size={15} />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
