import { useEffect, useMemo, useState } from 'react';
import { 
  Trash2, 
  Search, 
  Sparkles, 
  MessageSquare, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Building2, 
  Send
} from 'lucide-react';
import { getLeads, updateLeadStatus, deleteLead } from '../../lib/queries';

const SOURCE_LABEL = {
  contact_page: 'Website Contact',
  property_inquiry: 'Property Inquiry',
  schedule_visit: 'Site Visit Booking',
};

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

const STATUS_STYLE = {
  new: 'bg-blue-950/40 text-blue-300 border-blue-800/40',
  contacted: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
  closed: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
};

const MOCK_VIP_CRM_LEADS = [
  {
    id: 'LEAD-901',
    name: 'Kabir & Radhika Oberoi',
    tier: 'Family Office',
    phone: '+91 98201 44882',
    email: 'k.oberoi@oberoicapital.com',
    source: 'property_inquiry',
    propertyName: 'The Imperial Sky Villa, Worli Sea Face',
    budget: '₹50 - 65 Cr',
    liquidityStatus: 'Payment Ready',
    status: 'new',
    matchScore: 99,
    details: {
      location: 'Worli Sea Face',
      requirement: 'Looking for a 7,000 sq.ft sea-facing penthouse with private pool & 6 car parks',
      timeline: 'Ready to pay 10% token this week'
    },
    created_at: new Date().toISOString()
  },
  {
    id: 'LEAD-902',
    name: 'Sanjay Ruia (Managing Director)',
    tier: 'Verified Buyer',
    phone: '+91 99300 88211',
    email: 'sanjay.ruia@ruiaventures.in',
    source: 'schedule_visit',
    propertyName: 'Sea-Facing Bungalow, Bandra Bandstand',
    budget: '₹75 - 90 Cr',
    liquidityStatus: 'Bank Verified',
    status: 'contacted',
    matchScore: 97,
    details: {
      location: 'Bandra Bandstand',
      requirement: 'Standalone sea-facing villa with private garden and security perimeter',
      timeline: 'Site visit completed with architect'
    },
    created_at: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: 'LEAD-903',
    name: 'Ananya Singhal (Film Producer)',
    tier: 'VIP Client',
    phone: '+91 98112 55900',
    email: 'mgmt@ananyasinghal.com',
    source: 'contact_page',
    propertyName: 'Oceanview Duplex Home, Juhu Tara Road',
    budget: '₹35 - 45 Cr',
    liquidityStatus: '10% Token Paid',
    status: 'closed',
    matchScore: 98,
    details: {
      location: 'Juhu Oceanfront',
      requirement: 'Full Arabian Sea sunset views with large private terrace',
      timeline: 'Agreement signed, finalizing registration'
    },
    created_at: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    id: 'LEAD-904',
    name: 'Vikram Mehta (London Investor)',
    tier: 'NRI Buyer',
    phone: '+44 7911 123456',
    email: 'vmehta@londonbridgecap.com',
    source: 'property_inquiry',
    propertyName: 'Altamount Manor Sky Home',
    budget: '₹60 - 75 Cr',
    liquidityStatus: 'FDI Cleared',
    status: 'new',
    matchScore: 95,
    details: {
      location: 'Altamount Road',
      requirement: 'Full floor luxury apartment with 360-degree city view and concierge service',
      timeline: 'Visiting Mumbai desk next week'
    },
    created_at: new Date(Date.now() - 3600000 * 36).toISOString()
  },
  {
    id: 'LEAD-905',
    name: 'Dr. Siddharth & Tanya Merchant',
    tier: 'Verified Buyer',
    phone: '+91 98200 11994',
    email: 'siddharth@merchantpharma.com',
    source: 'schedule_visit',
    propertyName: 'Signature Penthouse at World Towers',
    budget: '₹40 - 50 Cr',
    liquidityStatus: 'Funds Ready',
    status: 'contacted',
    matchScore: 94,
    details: {
      location: 'Lower Parel',
      requirement: 'Private elevator entrance, double-height ceiling living room',
      timeline: 'Reviewing property paperwork'
    },
    created_at: new Date(Date.now() - 3600000 * 48).toISOString()
  }
];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const load = () => {
    setLoading(true);
    getLeads()
      .then((data) => {
        const combined = [...MOCK_VIP_CRM_LEADS, ...(data || [])];
        setLeads(combined);
      })
      .catch(() => setLeads(MOCK_VIP_CRM_LEADS))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchStatus = statusFilter === 'All' || l.status === statusFilter;
      const matchSource = sourceFilter === 'All' || l.source === sourceFilter;
      const matchSearch =
        !searchTerm ||
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.tier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.propertyName?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchStatus && matchSource && matchSearch;
    });
  }, [leads, statusFilter, sourceFilter, searchTerm]);

  const handleStatusChange = async (id, status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    try {
      await updateLeadStatus(id, status);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete inquiry from "${name}"?`)) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    try {
      await deleteLead(id);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h1 className="font-serif text-3xl text-white">Inquiries & Leads</h1>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-accent/15 text-accent border border-accent/30 px-2.5 py-0.5 rounded-full">
              Buyer CRM
            </span>
          </div>
          <p className="text-cream/50 text-xs font-medium">
            1,842 Total Inquiries · 14 follow-ups for today
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap text-xs">
          <div className="glass px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-cream/40 text-[10px] uppercase tracking-wider font-bold">Total Inquiries Value:</span>
            <span className="font-serif font-bold text-white">₹324.5 Cr</span>
          </div>
          <div className="glass px-3.5 py-2 rounded-xl border border-white/10 flex items-center gap-2">
            <span className="text-cream/40 text-[10px] uppercase tracking-wider font-bold">Avg. Response Time:</span>
            <span className="font-mono font-bold text-emerald-400">&lt; 4 Minutes</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="glass border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-luxury">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" size={15} />
          <input
            type="text"
            placeholder="Search by buyer name, phone, budget..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0A14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-cream/40 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white bg-[#0D0A14] focus:outline-none focus:border-accent"
          >
            <option value="All">All Statuses ({leads.length})</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white bg-[#0D0A14] focus:outline-none focus:border-accent"
          >
            <option value="All">All Sources</option>
            {Object.entries(SOURCE_LABEL).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass border border-white/10 rounded-2xl p-12 text-center text-cream/50 text-sm">
          No inquiries found.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((lead) => (
            <div
              key={lead.id}
              className="glass border border-white/10 hover:border-accent/40 rounded-2xl p-6 shadow-luxury transition-all duration-300 bg-gradient-to-b from-white/[0.03] to-transparent"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap mb-2">
                    <span className="font-serif font-bold text-white text-base">{lead.name}</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-accent bg-accent/15 px-2.5 py-0.5 rounded-full border border-accent/30">
                      {lead.tier || 'Verified Buyer'}
                    </span>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-cream/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                      {SOURCE_LABEL[lead.source] || lead.source}
                    </span>
                    {lead.matchScore && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-800/30">
                        ⚡ {lead.matchScore}% Match
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-cream/60 flex-wrap mb-3">
                    <span className="flex items-center gap-1 text-white font-medium">
                      <Building2 size={13} className="text-accent" /> {lead.propertyName || lead.properties?.title || 'Luxury Property'}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-accent font-bold">
                      Budget: {lead.budget || '₹40 - 60 Cr'}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck size={13} /> {lead.liquidityStatus || 'Funds Ready'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-cream/50 mb-3 flex-wrap">
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} className="text-cream/40" /> {lead.phone || '+91 98200 XXXXX'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Mail size={12} className="text-cream/40" /> {lead.email || 'client@email.com'}
                    </span>
                  </div>

                  {lead.details && (
                    <div className="bg-[#0D0A14]/70 border border-white/5 rounded-xl p-3 text-xs text-cream/70 leading-relaxed italic">
                      "{lead.details.requirement || lead.details.message || Object.values(lead.details).join(' · ')}"
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <select
                      value={lead.status}
                      onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                      className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border bg-[#0D0A14] focus:outline-none cursor-pointer ${STATUS_STYLE[lead.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-[#110D1A] text-white">
                          {s.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleDelete(lead.id, lead.name)}
                      className="w-8 h-8 rounded-xl border border-white/10 hover:border-red-400 flex items-center justify-center text-cream/40 hover:text-red-400 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <span className="text-cream/35 text-[10px] font-mono">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>

                  <div className="flex items-center gap-2 mt-1">
                    {lead.phone && (
                      <a
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-400 border border-emerald-800/40 px-3 py-1.5 rounded-xl transition-all"
                      >
                        <MessageSquare size={13} /> WhatsApp
                      </a>
                    )}
                    <button className="flex items-center gap-1.5 text-xs font-bold bg-accent hover:bg-accent-dark text-white px-3 py-1.5 rounded-xl shadow-luxury transition-all">
                      <Send size={13} /> Send Brochure
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
