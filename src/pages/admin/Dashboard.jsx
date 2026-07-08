import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Quote, ImagePlus, Inbox } from 'lucide-react';
import { getDashboardStats } from '../../lib/queries';
import StatCard from '../../components/admin/StatCard';

const SOURCE_LABEL = {
  contact_page: 'Contact Page',
  property_inquiry: 'Property Inquiry',
  schedule_visit: 'Site Visit',
};

const STATUS_STYLE = {
  new: 'bg-blue-950/40 text-blue-300 border-blue-900/30',
  contacted: 'bg-amber-950/40 text-amber-300 border-amber-900/30',
  closed: 'bg-green-950/40 text-green-300 border-green-900/30',
};

function leadSummary(lead) {
  const d = lead.details || {};
  return d.message || d.notes || Object.values(d).filter(Boolean).join(' · ') || '—';
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl text-white mb-1">Dashboard</h1>
      <p className="text-cream/50 text-[10px] uppercase tracking-widest font-bold mb-8">
        Overview of your website content and enquiries
      </p>

      {loading ? (
        <div className="text-cream/40 text-sm">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
            <StatCard label="Total Leads" value={stats.totalLeads} />
            <StatCard label="New Enquiries" value={stats.newEnquiries} />
            <StatCard label="Testimonials" value={stats.testimonialsCount} />
            <StatCard label="Properties" value={stats.propertiesCount} />
            <StatCard label="Total Views" value={stats.totalViews} />
            <StatCard label="Unique Visitors" value={stats.uniqueVisitors} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass border border-white/10 rounded-2xl p-6 shadow-luxury">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-bold text-white text-lg flex items-center gap-2">
                  <Clock size={16} className="text-accent" /> Recent Enquiries
                </h2>
                <Link to="/admin/leads" className="text-[10px] uppercase tracking-widest font-bold text-accent hover:text-white transition-colors">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentLeads.length === 0 && <p className="text-cream/40 text-xs">No enquiries yet.</p>}
                {stats.recentLeads.map((lead) => (
                  <div key={lead.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-serif font-bold text-white text-sm">{lead.name}</span>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-cream/45 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {SOURCE_LABEL[lead.source] || lead.source}
                        </span>
                      </div>
                      <div className="text-cream/50 text-xs mb-1">{lead.phone || lead.email}</div>
                      <div className="text-cream/40 text-xs italic truncate">"{leadSummary(lead)}"</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${STATUS_STYLE[lead.status]}`}>
                        {lead.status}
                      </span>
                      <div className="text-cream/35 text-[10px] mt-1.5">
                        {new Date(lead.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#0D0A14] border border-white/10 rounded-2xl p-6 shadow-luxury">
              <h2 className="font-serif font-bold text-white text-lg mb-1.5">Quick Actions</h2>
              <p className="text-cream/45 text-xs leading-relaxed mb-5">
                Update and manage your website gallery, client testimonials, and response status pipelines.
              </p>
              <div className="space-y-2.5">
                <Link
                  to="/admin/testimonials"
                  className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                    <Quote size={15} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-white text-sm">Add Testimonial</div>
                    <div className="text-cream/40 text-[10px]">Create customer reviews</div>
                  </div>
                </Link>
                <Link
                  to="/admin/properties/new"
                  className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                    <ImagePlus size={15} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-white text-sm">Add Property</div>
                    <div className="text-cream/40 text-[10px]">Upload gallery items</div>
                  </div>
                </Link>
                <Link
                  to="/admin/leads"
                  className="flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-xl p-3.5 transition-all duration-300"
                >
                  <div className="w-9 h-9 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
                    <Inbox size={15} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-white text-sm">Manage Leads</div>
                    <div className="text-cream/40 text-[10px]">{stats.newEnquiries} pending responses</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
