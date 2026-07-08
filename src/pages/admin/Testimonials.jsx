import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { getTestimonials, deleteTestimonial } from '../../lib/queries';
import TestimonialForm from './TestimonialForm';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [showForm, setShowForm] = useState(false);

  const load = () => {
    setLoading(true);
    getTestimonials()
      .then(setTestimonials)
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
    if (!confirm(`Delete testimonial from "${name}"?`)) return;
    await deleteTestimonial(id);
    load();
  };

  const handleSaved = () => {
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-white mb-1">Testimonials</h1>
          <p className="text-cream/50 text-[10px] uppercase tracking-widest font-bold">{testimonials.length} client reviews</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-5 py-3 rounded-xl text-xs shadow-luxury transition-all duration-300"
        >
          <Plus size={14} /> Add Testimonial
        </button>
      </div>

      {showForm && (
        <TestimonialForm testimonial={editing} onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <div className="text-cream/40 text-sm">Loading…</div>
      ) : testimonials.length === 0 ? (
        <div className="glass border border-white/10 rounded-2xl p-10 text-center text-cream/50 text-sm">No testimonials yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.id} className="glass border border-white/10 rounded-2xl p-5 shadow-luxury">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={12} className="text-white fill-accent" />
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => openEdit(t)} className="w-7 h-7 rounded-lg border border-white/10 hover:border-accent flex items-center justify-center text-cream/60 hover:text-white transition-colors">
                    <Pencil size={12} />
                  </button>
                  <button onClick={() => handleDelete(t.id, t.name)} className="w-7 h-7 rounded-lg border border-white/10 hover:border-red-400 flex items-center justify-center text-cream/60 hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              <p className="text-cream/60 text-xs leading-relaxed italic mb-4 line-clamp-3">"{t.quote}"</p>
              <div className="flex items-center gap-2.5 border-t border-white/5 pt-3">
                <img src={t.avatar} alt="" className="w-8 h-8 rounded-full object-cover border border-white/10" />
                <div>
                  <div className="font-serif font-bold text-white text-xs">{t.name}</div>
                  <div className="text-cream/40 text-[9px] uppercase tracking-wider font-bold">{t.role} · {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
