import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { getProperties, deleteProperty } from '../../lib/queries';

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Properties</h1>
          <p className="text-cream/50 text-[10px] uppercase tracking-widest font-bold">
            {properties.length} listings in gallery
          </p>
        </div>
        <Link
          to="/admin/properties/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-5 py-3 rounded-xl text-xs shadow-luxury transition-all duration-300"
        >
          <Plus size={14} /> Add Property
        </Link>
      </div>

      {loading ? (
        <div className="text-cream/40 text-sm">Loading…</div>
      ) : properties.length === 0 ? (
        <div className="glass border border-white/10 rounded-2xl p-10 text-center text-cream/50 text-sm">
          No properties yet. Add your first one.
        </div>
      ) : (
        <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-luxury">
          {properties.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
            >
              <img
                src={p.images?.[0]}
                alt=""
                className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0 bg-white/5"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-serif font-bold text-white text-sm truncate">{p.title}</span>
                  {p.featured && (
                    <span className="text-[9px] uppercase tracking-wider font-bold text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <div className="text-cream/45 text-xs mt-0.5">
                  {p.area} · {p.category} · {p.priceDisplay}
                </div>
              </div>
              <span className="text-[9px] uppercase tracking-wider font-bold text-cream/50 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full shrink-0">
                {p.status}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <Link
                  to={`/admin/properties/${p.id}/edit`}
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-accent flex items-center justify-center text-cream/60 hover:text-white transition-colors"
                >
                  <Pencil size={13} />
                </Link>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="w-8 h-8 rounded-lg border border-white/10 hover:border-red-400 flex items-center justify-center text-cream/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
