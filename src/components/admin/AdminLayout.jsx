import { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  Quote, 
  Inbox, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X
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
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('synex_admin_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('synex_admin_sidebar_collapsed', String(collapsed));
    } catch {
      // Ignore storage errors
    }
  }, [collapsed]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-[#0B0813] text-cream">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 shrink-0 border-r border-white/5 bg-[#0D0A14] flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${collapsed ? 'w-20 p-3.5' : 'w-72 p-5'}`}
      >
        <div>
          {/* Header / Brand Logo & Collapse Toggle */}
          <div className={`flex items-center mb-7 ${collapsed ? 'justify-center flex-col gap-3' : 'justify-between px-1'}`}>
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent to-[#99774d] p-[1px] shadow-luxury shrink-0 flex items-center justify-center">
                <div className="w-full h-full bg-[#0D0A14] rounded-2xl flex items-center justify-center">
                  <span className="font-serif font-bold text-accent text-base tracking-wider">S</span>
                </div>
              </div>
              {!collapsed && (
                <div className="leading-tight min-w-0">
                  <div className="font-serif font-bold text-white text-base tracking-wide flex items-center gap-1.5 truncate">
                    SYNEX <span className="text-[9px] font-sans font-bold bg-accent/20 text-accent px-1.5 py-0.5 rounded tracking-normal">ADMIN</span>
                  </div>
                  <div className="text-[9px] uppercase tracking-[0.22em] text-cream/40 font-bold truncate">
                    Luxury Real Estate
                  </div>
                </div>
              )}
            </div>

            {/* Collapse toggle button on desktop */}
            <button
              onClick={() => setCollapsed(prev => !prev)}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className="hidden lg:flex w-8 h-8 rounded-xl bg-white/[0.03] hover:bg-accent/15 border border-white/10 hover:border-accent/40 text-cream/60 hover:text-white items-center justify-center transition-all duration-200"
            >
              {collapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
            </button>

            {/* Close button on mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-cream/60 flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick Desk Status */}
          {!collapsed ? (
            <div className="mb-6 px-3.5 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs transition-opacity duration-200">
              <span className="flex items-center gap-1.5 text-cream/60">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Mumbai Office
              </span>
              <span className="font-mono text-accent font-bold">₹482.5 Cr Total</span>
            </div>
          ) : (
            <div className="mb-5 flex justify-center">
              <div 
                title="Mumbai Office: ₹482.5 Cr Total"
                className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-xs relative group cursor-pointer"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {/* Tooltip */}
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#151022] border border-white/15 rounded-lg text-[11px] whitespace-nowrap text-cream opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-2xl z-50">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Mumbai Desk Active
                  </div>
                  <div className="text-[10px] text-accent font-mono">₹482.5 Cr Total</div>
                </div>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="space-y-1.5">
            {NAV_ITEMS.map(({ to, label, icon: Icon, badge }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border relative group ${
                    collapsed 
                      ? 'justify-center p-3' 
                      : 'justify-between px-3.5 py-3'
                  } ${
                    isActive
                      ? 'bg-accent/15 text-white border-accent/40 shadow-luxury translate-x-0.5'
                      : 'text-cream/55 hover:text-white hover:bg-white/5 border-transparent'
                  }`
                }
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon size={17} className="shrink-0" />
                  {!collapsed && <span className="truncate">{label}</span>}
                </div>

                {/* Badge for expanded view */}
                {!collapsed && badge && (
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

                {/* Collapsed view: dot indicator for badge */}
                {collapsed && badge && (
                  <span 
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${
                      badge === 'LIVE' ? 'bg-emerald-400' : 'bg-accent'
                    }`}
                  />
                )}

                {/* Floating Tooltip for collapsed mode */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#151022] border border-white/15 rounded-lg text-xs font-semibold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-2xl z-50 whitespace-nowrap flex items-center gap-2">
                    <span>{label}</span>
                    {badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                          badge === 'LIVE'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                            : 'bg-accent/20 text-accent border border-accent/40'
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Profile Card & Logout */}
        <div className="space-y-3 pt-5 border-t border-white/5">
          {!collapsed ? (
            <>
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
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div 
                title="Pratham D. - Managing Director"
                className="w-10 h-10 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-serif font-bold text-accent text-xs relative group cursor-pointer"
              >
                PD
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-[#151022] border border-white/15 rounded-lg text-xs font-semibold text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 shadow-2xl z-50 whitespace-nowrap">
                  <div className="font-bold">Pratham D.</div>
                  <div className="text-[10px] text-cream/50">Managing Director</div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full items-center pt-2">
                <Link
                  to="/"
                  target="_blank"
                  title="View Public Website"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-cream/55 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
                >
                  <ExternalLink size={14} />
                </Link>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-cream/55 hover:text-red-300 hover:bg-red-950/20 border border-white/5 hover:border-red-900/30 transition-all"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0D0A14]/80 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-xs text-cream/40">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-cream/70 flex items-center justify-center hover:text-white"
            >
              <Menu size={16} />
            </button>

            {/* Desktop header toggle button */}
            <button
              onClick={() => setCollapsed(prev => !prev)}
              className="hidden lg:flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-cream/60 hover:text-white transition-all mr-1 text-[11px]"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <PanelLeftOpen size={14} /> : <PanelLeftClose size={14} />}
              <span className="font-semibold">{collapsed ? 'Expand' : 'Collapse'}</span>
            </button>

            <span className="font-bold text-white uppercase tracking-wider text-[11px] hidden sm:inline">Synex Realty Admin</span>
            <span className="hidden sm:inline">/</span>
            <span className="text-accent font-mono text-[11px]">2026</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-xs text-cream/60">
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
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
