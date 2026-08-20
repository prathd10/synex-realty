import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Quote, 
  Inbox, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Bell
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/deals', label: 'Active Deals', icon: ShieldCheck, badge: 'LIVE' },
  { to: '/admin/properties', label: 'Properties', icon: Building2 },
  { to: '/admin/leads', label: 'Inquiries & Leads', icon: Inbox, badge: '14 New' },
  { to: '/admin/testimonials', label: 'Client Reviews', icon: Quote },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#0B0813] text-cream">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-white/5 bg-[#0D0A14] flex flex-col p-5 select-none justify-between">
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3.5 mb-8 px-1">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-accent to-[#99774d] p-[1px] shadow-luxury">
              <div className="w-full h-full bg-[#0D0A14] rounded-2xl flex items-center justify-center">
                <span className="font-serif font-bold text-accent text-base tracking-wider">S</span>
              </div>
            </div>
            <div className="leading-tight">
              <div className="font-serif font-bold text-white text-base tracking-wide flex items-center gap-1.5">
                SYNEX <span className="text-[10px] font-sans font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded">ADMIN</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-cream/40 font-bold">
                Luxury Real Estate
              </div>
            </div>
          </div>

          {/* Quick Desk Status */}
          <div className="mb-6 px-3.5 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-cream/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Mumbai Office
            </span>
            <span className="font-mono text-accent font-bold">₹482.5 Cr Total</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                    isActive
                      ? 'bg-accent/15 text-white border-accent/40 shadow-luxury translate-x-1'
                      : 'text-cream/55 hover:text-white hover:bg-white/5 border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} />
                  <span>{label}</span>
                </div>
                {badge && (
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      badge === 'LIVE'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : 'bg-accent/20 text-accent border border-accent/30'
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile Card & Logout */}
        <div className="space-y-3 pt-6 border-t border-white/5">
          <div className="p-3 bg-white/[0.02] rounded-xl border border-white/5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-serif font-bold text-accent text-xs shrink-0">
              PD
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-serif font-bold text-white text-xs truncate">Pratham D.</div>
              <div className="text-[10px] text-cream/40 truncate">
                Managing Director
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-cream/55 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
            >
              <ExternalLink size={12} />
              Website
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider text-cream/55 hover:text-red-300 hover:bg-red-950/20 border border-white/5 hover:border-red-900/30 transition-all"
            >
              <LogOut size={12} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0D0A14]/80 backdrop-blur-md px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs text-cream/40">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">Synex Realty Admin</span>
            <span>/</span>
            <span className="text-accent font-mono text-[11px]">2026</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-cream/60">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span>Earnings This Year: <strong className="text-white">₹4.86 Cr</strong></span>
            </div>

            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-cream/60 hover:text-white cursor-pointer relative">
              <Bell size={14} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
