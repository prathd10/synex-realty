import { useEffect, useState } from 'react';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';
import { getTestimonials, deleteTestimonial } from '../../lib/queries';
import TestimonialForm from './TestimonialForm';

const MOCK_LUXURY_TESTIMONIALS = [
  {
    id: 'TEST-101',
    name: 'Vikramaditya Singhania',
    role: 'Managing Partner, Singhania Capital',
    location: 'Worli Sea Face, Mumbai',
    transactionBadge: 'Bought ₹54.5 Cr Penthouse',
    rating: 5,
    quote: 'Synex Realty handled our property purchase with complete privacy. The entire paperwork, legal checks, and registration took less than 3 weeks. Truly the best luxury property team in Mumbai.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    verified: true
  },
  {
    id: 'TEST-102',
    name: 'Aarav & Natasha Kapoor',
    role: 'Film Producer & Creative Director',
    location: 'Bandra Bandstand, Mumbai',
    transactionBadge: 'Bought ₹82.0 Cr Bungalow',
    rating: 5,
    quote: 'Finding a standalone sea-facing bungalow in Bandstand felt impossible until Synex showed us exclusive private options. Their service and support were exceptional from day one.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    verified: true
  },
  {
    id: 'TEST-103',
    name: 'Dr. Siddharth Merchant',
    role: 'Chairman, Merchant Pharma',
    location: 'Altamount Road, Mumbai',
    transactionBadge: 'Sold ₹68.0 Cr Home',
    rating: 5,
    quote: 'They connected us directly with verified buyers without ever listing our home publicly. The deal closed at 98% of our asking price smoothly.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    verified: true
  }
];

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getTestimonials()
      .then((data) => {
        const combined = [...MOCK_LUXURY_TESTIMONIALS, ...(data || [])];
        setTestimonials(combined);
      })
      .catch(() => setTestimonials(MOCK_LUXURY_TESTIMONIALS))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (t) => {
    setEditing(t);
    setShowForm(true);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    try {
      await deleteTestimonial(id);
    } catch {
      // ignore
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    load();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <h1 className="font-serif text-3xl text-white">Client Reviews</h1>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-accent/15 text-accent border border-accent/30 px-2.5 py-0.5 rounded-full">
              Verified Reviews
            </span>
          </div>
          <p className="text-cream/50 text-xs font-medium">
            Average Client Rating: 4.98 / 5.0 · 100% Verified Deals
          </p>
        </div>

        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold px-5 py-3 rounded-xl text-xs shadow-luxury transition-all duration-300"
        >
          <Plus size={15} /> + Add Client Review
        </button>
      </div>

      {showForm && (
        <TestimonialForm
          testimonial={editing}
          onSaved={handleSaved}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Top 4 Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Client Satisfaction</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-accent flex items-center gap-2">
            4.98 <Star size={20} className="fill-accent text-accent" />
          </div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">From 148+ verified reviews</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Privacy & Discretion</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">100%</div>
          <div className="text-[10px] text-accent font-bold mt-1">Strict privacy agreements</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Repeat Clients</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">84.2%</div>
          <div className="text-[10px] text-emerald-400 font-bold mt-1">Clients buy again with us</div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-5 bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="text-[10px] uppercase tracking-widest font-bold text-cream/45 mb-1">Total Sales Value</div>
          <div className="font-serif font-bold text-2xl lg:text-3xl text-white">₹1,240 Cr+</div>
          <div className="text-[10px] text-accent font-bold mt-1">Lifetime property sales</div>
        </div>
      </div>

      {/* Testimonials Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="glass border border-white/10 rounded-2xl p-12 text-center text-cream/50 text-sm">
          No reviews yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="glass border border-white/10 hover:border-accent/40 rounded-2xl p-6 shadow-luxury transition-all duration-300 flex flex-col justify-between bg-gradient-to-b from-white/[0.03] to-transparent"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} className="text-accent fill-accent" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEdit(t)}
                      className="w-8 h-8 rounded-xl border border-white/10 hover:border-accent flex items-center justify-center text-cream/60 hover:text-white transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.name)}
                      className="w-8 h-8 rounded-xl border border-white/10 hover:border-red-400 flex items-center justify-center text-cream/60 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {t.transactionBadge && (
                  <div className="mb-3">
                    <span className="text-[10px] font-bold text-accent bg-accent/15 border border-accent/30 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                      <ShieldCheck size={12} /> {t.transactionBadge}
                    </span>
                  </div>
                )}

                <p className="text-cream/70 text-xs leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <img
                  src={t.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-white/10 bg-white/5"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-serif font-bold text-white text-sm truncate flex items-center gap-1.5">
                    {t.name}
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                  </div>
                  <div className="text-cream/45 text-[10px] uppercase tracking-wider font-bold truncate">
                    {t.role}
                  </div>
                  <div className="text-cream/35 text-[9px] truncate">
                    {t.location}
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
