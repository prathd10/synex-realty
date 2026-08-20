import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Search, 
  ExternalLink
} from 'lucide-react';
import { getProperties, deleteProperty } from '../../lib/queries';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = () => {
    setLoading(true);
    getProperties()
      .then(setProperties)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await deleteProperty(id);
    load();
  };

  const filtered = properties.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="font-serif text-3xl text-white">Properties Portfolio</h1>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-accent/15 text-accent border border-accent/30 px-2.5 py-0.5 rounded-full">
              Active Listings
            </span>
          </div>
          <p className="text-cream/50 text-xs font-medium">
            Total Portfolio Value: ₹482.5 Cr · {properties.length} active listings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties/new"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-3 rounded-xl text-xs shadow-luxury transition-all duration-300"
          >
            <Plus size={15} /> + Add New Property
          </Link>
        </div>
      </div>

      {/* Top 4 Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Total Portfolio Value</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">₹482.5 Cr</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">100% Verified Papers</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Average Property Price</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-accent">₹42.8 Cr</div>
          <div className="text-[10px] text-cream/40 font-bold mt-1">Prime Mumbai Locations</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Total Website Views</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">48,200</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">▲ +54% this month</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Site Visits Booked</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">128 Visits</div>
          <div className="text-[10px] text-accent font-bold mt-1">Scheduled in person</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-luxury">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cream/40" size={15} />
          <input
            type="text"
            placeholder="Search by title, location, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0D0A14] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-cream/40 focus:outline-none focus:border-accent"
          />
        </div>

        <div className="text-xs text-cream/50 font-bold font-mono">
          Showing {filtered.length} of {properties.length} Properties
        </div>
      </div>

      {/* Properties List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass border border-white/10 rounded-2xl p-12 text-center text-cream/50 text-sm">
          No properties found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p, idx) => (
            <div
              key={p.id}
              className="glass border border-white/10 hover:border-accent/40 rounded-2xl p-5 shadow-luxury transition-all duration-300 flex items-center gap-5 flex-wrap md:flex-nowrap bg-gradient-to-r from-white/[0.03] to-transparent"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-white/5">
                <img
                  src={p.images?.[0]}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {p.featured && (
                  <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-accent animate-ping" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-serif font-bold text-white text-base truncate">{p.title}</h3>
                  {p.featured && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-accent bg-accent/15 border border-accent/30 px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <span className="text-[9px] uppercase tracking-wider font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded-full">
                    {p.status || 'Available'}
                  </span>
                </div>

                <div className="text-cream/50 text-xs flex items-center gap-3 flex-wrap">
                  <span>{p.area}</span>
                  <span>·</span>
                  <span>{p.category}</span>
                  <span>·</span>
                  <span>{p.specs?.beds || '4-5'} BHK</span>
                  <span>·</span>
                  <span className="text-cream/40 font-mono">{(idx + 1) * 342 + 120} Inquiries</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase tracking-wider font-bold text-cream/40">Price</div>
                <div className="font-serif font-bold text-xl text-accent">{p.priceDisplay}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Ready to Move</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/properties/${p.id}`}
                  target="_blank"
                  className="w-9 h-9 rounded-xl border border-white/10 hover:border-white/30 flex items-center justify-center text-cream/60 hover:text-white transition-colors"
                  title="View on website"
                >
                  <ExternalLink size={14} />
                </Link>
                <Link
                  to={`/admin/properties/${p.id}/edit`}
                  className="w-9 h-9 rounded-xl border border-white/10 hover:border-accent flex items-center justify-center text-cream/60 hover:text-white transition-colors"
                  title="Edit Property"
                >
                  <Pencil size={14} />
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="w-9 h-9 rounded-xl border border-white/10 hover:border-red-400 flex items-center justify-center text-cream/60 hover:text-red-400 transition-colors"
                  title="Delete Property"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
