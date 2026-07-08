import { useEffect, useMemo, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { getLeads, updateLeadStatus, deleteLead } from '../../lib/queries';

const SOURCE_LABEL = {
  contact_page: 'Contact Page',
  property_inquiry: 'Property Inquiry',
  schedule_visit: 'Site Visit',
};

const STATUS_OPTIONS = ['new', 'contacted', 'closed'];

const STATUS_STYLE = {
  new: 'bg-blue-950/40 text-blue-300 border-blue-900/30',
  contacted: 'bg-amber-950/40 text-amber-300 border-amber-900/30',
  closed: 'bg-green-950/40 text-green-300 border-green-900/30',
};

function leadDetailsText(lead) {
  const d = lead.details || {};
  return Object.entries(d)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' · ');
}

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  const load = () => {
    setLoading(true);
    getLeads()
      .then(setLeads)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    return leads.filter(
      (l) => (statusFilter === 'All' || l.status === statusFilter) && (sourceFilter === 'All' || l.source === sourceFilter)
    );
  }, [leads, statusFilter, sourceFilter]);

  const handleStatusChange = async (id, status) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    await updateLeadStatus(id, status);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete enquiry from "${name}"?`)) return;
    await deleteLead(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Leads</h1>
          <p className="text-cream/50 text-[10px] uppercase tracking-widest font-bold">{filtered.length} enquiries</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white bg-[#110D1A] focus:outline-none focus:border-accent"
          >
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white bg-[#110D1A] focus:outline-none focus:border-accent"
          >
            <option value="All">All Sources</option>
            {Object.entries(SOURCE_LABEL).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-cream/40 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="glass border border-white/10 rounded-2xl p-10 text-center text-cream/50 text-sm">No enquiries match these filters.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <div key={lead.id} className="glass border border-white/10 rounded-2xl p-5 shadow-luxury">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-serif font-bold text-white text-sm">{lead.name}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-cream/45 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                      {SOURCE_LABEL[lead.source] || lead.source}
                    </span>
                    {lead.properties?.title && (
                      <span className="text-[9px] uppercase tracking-wider font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                        {lead.properties.title}
                      </span>
                    )}
                  </div>
                  <div className="text-cream/50 text-xs mb-1">{[lead.phone, lead.email].filter(Boolean).join(' · ')}</div>
                  {leadDetailsText(lead) && <div className="text-cream/40 text-xs italic">{leadDetailsText(lead)}</div>}
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <select
                    value={lead.status}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-full border bg-transparent focus:outline-none cursor-pointer ${STATUS_STYLE[lead.status]}`}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#110D1A] text-white">{s}</option>
                    ))}
                  </select>
                  <span className="text-cream/35 text-[10px]">
                    {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </span>
                  <button
                    onClick={() => handleDelete(lead.id, lead.name)}
                    className="w-7 h-7 rounded-lg border border-white/10 hover:border-red-400 flex items-center justify-center text-cream/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
