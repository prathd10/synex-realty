import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Quote, 
  ImagePlus, 
  Inbox, 
  Briefcase, 
  Flame, 
  Download, 
  Activity,
  Layers,
  ChevronRight,
  Phone,
  MessageSquare
} from 'lucide-react';
import { getDashboardStats } from '../../lib/queries';
import StatCard from '../../components/admin/StatCard';

const SOURCE_LABEL = {
  contact_page: 'Website Contact',
  property_inquiry: 'Property Inquiry',
  schedule_visit: 'Site Visit Booking',
};

const STATUS_STYLE = {
  new: 'bg-blue-950/50 text-blue-300 border-blue-800/40',
  contacted: 'bg-amber-950/50 text-amber-300 border-amber-800/40',
  closed: 'bg-emerald-950/50 text-emerald-300 border-emerald-800/40',
};

const VIP_MOCK_LEADS = [
  {
    id: 'VIP-101',
    name: 'Kabir & Radhika Oberoi',
    tier: 'Family Office',
    phone: '+91 98201 44882',
    email: 'k.oberoi@oberoicapital.com',
    source: 'property_inquiry',
    property: 'Worli Sea Face Penthouse (₹54.5 Cr)',
    budget: '₹50 - 65 Cr',
    intent: 'Ready to buy',
    status: 'new',
    matchScore: 99,
    notes: 'Looking for a 7,000 sq.ft sea-facing penthouse with a private pool. Payment ready via bank transfer.',
    created_at: new Date().toISOString()
  },
  {
    id: 'VIP-102',
    name: 'Sanjay Ruia (Managing Director)',
    tier: 'Verified Buyer',
    phone: '+91 99300 88211',
    email: 'sanjay.ruia@ruiaventures.in',
    source: 'schedule_visit',
    property: 'Bandra Bandstand Villa (₹82.0 Cr)',
    budget: '₹75 - 90 Cr',
    intent: 'Visit done',
    status: 'contacted',
    matchScore: 96,
    notes: 'Site visit completed with family. Currently reviewing legal papers and title deed.',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'VIP-103',
    name: 'Ananya Singhal (Film Producer)',
    tier: 'VIP Client',
    phone: '+91 98112 55900',
    email: 'mgmt@ananyasinghal.com',
    source: 'contact_page',
    property: 'Juhu Oceanfront Duplex (₹38.0 Cr)',
    budget: '₹35 - 45 Cr',
    intent: 'Token paid',
    status: 'closed',
    matchScore: 98,
    notes: 'Offer of ₹38 Cr accepted. 10% token advance received in bank account.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  }
];

const TOP_LOCATIONS = [
  { name: 'Worli Sea Face', volume: '₹184.0 Cr', share: 38, demand: 'Very High', change: '+34%' },
  { name: 'Bandra Bandstand', volume: '₹126.5 Cr', share: 26, demand: 'High', change: '+28%' },
  { name: 'Juhu Oceanfront', volume: '₹98.0 Cr', share: 20, demand: 'High', change: '+19%' },
  { name: 'Altamount Road', volume: '₹48.0 Cr', share: 10, demand: 'Exclusive', change: '+12%' },
  { name: 'BKC Area', volume: '₹26.0 Cr', share: 6, demand: 'Steady', change: '+8%' }
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('This Month');
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              DESK ONLINE
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cream/40">
              Synex Realty Mumbai
            </span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl text-white font-bold tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-cream/50 text-xs font-medium mt-0.5">
            Track total sales, active property deals, and customer inquiries
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Time range selector */}
          <div className="flex bg-[#0D0A14] p-1 rounded-xl border border-white/10 text-xs font-bold">
            {['7 Days', '30 Days', 'This Month', 'This Year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === range
                    ? 'bg-accent text-white shadow-luxury'
                    : 'text-cream/40 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Currency Toggle */}
          <div className="flex bg-[#0D0A14] p-1 rounded-xl border border-white/10 text-xs font-bold">
            <button
              onClick={() => setCurrency('INR')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                currency === 'INR' ? 'bg-white/15 text-white' : 'text-cream/40'
              }`}
            >
              ₹ INR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                currency === 'USD' ? 'bg-white/15 text-white' : 'text-cream/40'
              }`}
            >
              $ USD
            </button>
          </div>

          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/10 transition-all">
            <Download size={13} /> Download Report
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* 6 Top Stats with Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
              label="Total Portfolio Value"
              value={currency === 'INR' ? '₹482.5 Cr' : '$57.8M'}
              secondary="All active properties"
              change="+24.8%"
              isPositive={true}
              icon={Building2}
              sparklineData={[320, 345, 390, 410, 440, 482.5]}
              accentColor="#C5A880"
            />
            <StatCard
              label="Total Sales Closed"
              value={currency === 'INR' ? '₹94.6 Cr' : '$11.3M'}
              secondary="8 deals completed"
              change="+38.2%"
              isPositive={true}
              icon={Briefcase}
              sparklineData={[42, 58, 65, 78, 86, 94.6]}
              accentColor="#10B981"
            />
            <StatCard
              label="Deals in Progress"
              value={currency === 'INR' ? '₹243.0 Cr' : '$29.0M'}
              secondary="4 deals being closed"
              change="+14.2%"
              isPositive={true}
              icon={ShieldCheck}
              sparklineData={[140, 165, 180, 210, 225, 243]}
              accentColor="#F59E0B"
            />
            <StatCard
              label="Total Inquiries"
              value="1,842"
              secondary="94% verified buyers"
              change="+42.1%"
              isPositive={true}
              icon={Users}
              sparklineData={[980, 1150, 1340, 1560, 1720, 1842]}
              accentColor="#8B5CF6"
            />
            <StatCard
              label="Avg. Deal Time"
              value="18 Days"
              secondary="Fast closing rate"
              change="3.5x Faster"
              isPositive={true}
              icon={TrendingUp}
              sparklineData={[45, 38, 30, 25, 21, 18.4]}
              accentColor="#EC4899"
            />
            <StatCard
              label="Buyer Match Rate"
              value="99%"
              secondary="High purchase intent"
              change="Top Rated"
              isPositive={true}
              icon={Sparkles}
              sparklineData={[88, 92, 94, 96, 98, 99.2]}
              accentColor="#3B82F6"
            />
          </div>

          {/* Sales Chart & Top Locations */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Sales Chart */}
            <div className="lg:col-span-8 glass border border-white/10 rounded-2xl p-6 shadow-luxury">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-accent" />
                    <h2 className="font-serif font-bold text-white text-lg">
                      Monthly Sales & Upcoming Deals
                    </h2>
                  </div>
                  <p className="text-cream/45 text-xs">
                    Growth of completed property sales and upcoming deal pipeline
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-cream/70">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent" /> Closed Sales
                  </span>
                  <span className="flex items-center gap-1.5 text-cream/70">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Deals in Progress
                  </span>
                </div>
              </div>

              {/* Chart SVG */}
              <div className="relative h-64 w-full bg-[#0D0A14]/70 rounded-xl p-4 border border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent pointer-events-none" />
                
                {/* Horizontal Grid lines */}
                <div className="absolute inset-x-4 top-1/4 border-b border-white/[0.04]" />
                <div className="absolute inset-x-4 top-2/4 border-b border-white/[0.04]" />
                <div className="absolute inset-x-4 top-3/4 border-b border-white/[0.04]" />

                <svg viewBox="0 0 700 200" className="w-full h-44 overflow-visible" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradientGold" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C5A880" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#C5A880" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="chartGradientGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Green fill */}
                  <path
                    d="M 0 170 Q 140 130, 280 110 T 560 50 L 700 30 L 700 200 L 0 200 Z"
                    fill="url(#chartGradientGreen)"
                  />
                  <path
                    d="M 0 170 Q 140 130, 280 110 T 560 50 L 700 30"
                    fill="none"
                    stroke="#10B981"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />

                  {/* Gold fill */}
                  <path
                    d="M 0 180 Q 140 150, 280 130 T 560 80 L 700 45 L 700 200 L 0 200 Z"
                    fill="url(#chartGradientGold)"
                  />
                  <path
                    d="M 0 180 Q 140 150, 280 130 T 560 80 L 700 45"
                    fill="none"
                    stroke="#C5A880"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />

                  {/* Points */}
                  {[
                    { x: 0, y: 180 },
                    { x: 140, y: 155 },
                    { x: 280, y: 130 },
                    { x: 420, y: 105 },
                    { x: 560, y: 80 },
                    { x: 700, y: 45 }
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#C5A880" stroke="#110D1A" strokeWidth="2" />
                      <circle cx={pt.x} cy={pt.y} r="9" fill="none" stroke="#C5A880" strokeOpacity="0.4" />
                    </g>
                  ))}
                </svg>

                <div className="flex justify-between text-[10px] font-mono text-cream/40 pt-2 px-1">
                  <span>MAR</span>
                  <span>APR</span>
                  <span>MAY</span>
                  <span>JUN</span>
                  <span>JUL</span>
                  <span className="text-accent font-bold">AUG (HIGHEST)</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between text-xs flex-wrap gap-2">
                <span className="flex items-center gap-2 text-cream/60">
                  <Flame size={14} className="text-amber-400" />
                  <span className="font-bold text-white">Highlight:</span> Worli and Bandra properties saw the highest buyer interest this month.
                </span>
                <Link to="/admin/deals" className="text-accent hover:text-white text-xs font-bold transition-colors">
                  View Active Deals →
                </Link>
              </div>
            </div>

            {/* Top Locations */}
            <div className="lg:col-span-4 glass border border-white/10 rounded-2xl p-6 shadow-luxury flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-serif font-bold text-white text-base flex items-center gap-2">
                    <Layers size={16} className="text-accent" /> Top Locations
                  </h3>
                  <span className="text-xs font-mono text-accent font-bold">₹482.5 Cr Total</span>
                </div>
                <p className="text-cream/45 text-xs mb-5">Where our properties and buyers are located</p>

                <div className="space-y-4">
                  {TOP_LOCATIONS.map((loc, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-white">{loc.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-cream/50 text-[11px] font-mono">{loc.volume}</span>
                          <span className="text-emerald-400 text-[10px] font-bold">{loc.change}</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-accent to-emerald-400 rounded-full"
                          style={{ width: `${loc.share * 2.2}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-cream/35">
                        <span>Demand: {loc.demand}</span>
                        <span>{loc.share}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-cream/40 font-bold">Upcoming Listings</span>
                <span className="text-xs font-bold text-accent">₹65.0 Cr Coming Soon</span>
              </div>
            </div>
          </div>

          {/* Recent Inquiries & Quick Actions */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Inquiries */}
            <div className="lg:col-span-8 glass border border-white/10 rounded-2xl p-6 shadow-luxury">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <div>
                  <h2 className="font-serif font-bold text-white text-lg flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" /> Recent Buyer Inquiries
                  </h2>
                  <p className="text-cream/45 text-xs">Direct requests from verified buyers looking for properties</p>
                </div>
                <Link to="/admin/leads" className="text-xs font-bold text-accent hover:text-white transition-colors">
                  View All ({stats.totalLeads + 14}) →
                </Link>
              </div>

              <div className="space-y-3">
                {VIP_MOCK_LEADS.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-accent/30 rounded-xl p-4 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-serif font-bold text-white text-sm">{lead.name}</span>
                          <span className="text-[9px] uppercase tracking-wider font-bold text-accent bg-accent/15 px-2 py-0.5 rounded-full border border-accent/25">
                            {lead.tier}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/30">
                            {lead.matchScore}% Match
                          </span>
                        </div>

                        <div className="text-cream/60 text-xs mb-1.5">
                          {lead.property} · <span className="text-accent font-bold">Budget: {lead.budget}</span>
                        </div>

                        <p className="text-cream/45 text-xs italic line-clamp-1">"{lead.notes}"</p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_STYLE[lead.status]}`}>
                          {lead.intent}
                        </span>
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            className="w-7 h-7 rounded-lg bg-emerald-950/40 border border-emerald-800/40 hover:bg-emerald-900/60 flex items-center justify-center text-emerald-400 transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare size={13} />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 hover:border-accent flex items-center justify-center text-cream/70 hover:text-white transition-colors"
                            title="Call client"
                          >
                            <Phone size={13} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-4 bg-[#0D0A14] border border-white/10 rounded-2xl p-6 shadow-luxury flex flex-col justify-between">
              <div>
                <h2 className="font-serif font-bold text-white text-lg mb-1.5">Quick Actions</h2>
                <p className="text-cream/45 text-xs leading-relaxed mb-5">
                  Manage your listings, client reviews, and active deals in one place.
                </p>

                <div className="space-y-2.5">
                  <Link
                    to="/admin/deals"
                    className="flex items-center gap-3 bg-gradient-to-r from-accent/20 to-white/[0.02] hover:from-accent/30 border border-accent/40 rounded-xl p-3.5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center shrink-0">
                      <ShieldCheck size={18} className="text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-white text-sm flex items-center justify-between">
                        Active Deals <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-accent text-[10px] font-bold">₹243.0 Cr in progress</div>
                    </div>
                  </Link>

                  <Link
                    to="/admin/properties/new"
                    className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <ImagePlus size={18} className="text-cream/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-white text-sm flex items-center justify-between">
                        Add New Property <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-cream/40 text-[10px]">Upload pictures and price details</div>
                    </div>
                  </Link>

                  <Link
                    to="/admin/leads"
                    className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Inbox size={18} className="text-cream/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-white text-sm flex items-center justify-between">
                        Customer Inquiries <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-cream/40 text-[10px]">14 new inquiries to contact</div>
                    </div>
                  </Link>

                  <Link
                    to="/admin/testimonials"
                    className="flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                      <Quote size={18} className="text-cream/70" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-serif font-bold text-white text-sm flex items-center justify-between">
                        Client Reviews <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                      <div className="text-cream/40 text-[10px]">Manage customer testimonials</div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 text-center">
                <div className="text-[10px] text-cream/30 font-bold">
                  Synex Realty Admin Panel · Secured
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
