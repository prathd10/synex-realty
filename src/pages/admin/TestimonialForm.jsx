import { useState } from 'react';
import { X, Star, Loader2, Upload } from 'lucide-react';
import { createTestimonial, updateTestimonial } from '../../lib/queries';
import { uploadFile } from '../../lib/imagekit';

const inputClass =
  'w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] transition-all duration-300';

export default function TestimonialForm({ testimonial, onSaved, onCancel }) {
  const isEdit = Boolean(testimonial?.id);
  const [form, setForm] = useState({
    name: testimonial?.name || '',
    role: testimonial?.role || '',
    location: testimonial?.location || '',
    quote: testimonial?.quote || '',
    rating: testimonial?.rating || 5,
    avatar: testimonial?.avatar || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, { folder: '/synex-realty/testimonials' });
      set('avatar', url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        await updateTestimonial(testimonial.id, form);
      } else {
        await createTestimonial(form);
      }
      onSaved();
    } catch (err) {
      setError(err.message || 'Could not save testimonial.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-[#110D1A] rounded-3xl p-6 w-full max-w-md shadow-float border border-white/10 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
          <h3 className="font-serif font-bold text-white text-lg">{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
          <button onClick={onCancel} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5">
            <X size={15} className="text-cream" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full overflow-hidden border border-white/10 bg-white/5 shrink-0 flex items-center justify-center">
              {form.avatar ? (
                <img src={form.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <Upload size={16} className="text-cream/40" />
              )}
            </div>
            <label className="text-[10px] uppercase tracking-wider font-bold text-cream/60 border border-white/10 hover:border-accent rounded-lg px-3 py-2 cursor-pointer transition-colors">
              {uploading ? <Loader2 size={12} className="animate-spin inline" /> : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Name" value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClass} />
            <input placeholder="Role" value={form.role} onChange={(e) => set('role', e.target.value)} className={inputClass} />
          </div>
          <input placeholder="Location (e.g. Bought in Bandra West)" value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} />
          <textarea required rows={3} placeholder="Quote" value={form.quote} onChange={(e) => set('quote', e.target.value)} className={`${inputClass} resize-none`} />

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => set('rating', n)}>
                <Star size={18} className={n <= form.rating ? 'text-accent fill-accent' : 'text-cream/20'} />
              </button>
            ))}
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 text-xs shadow-luxury disabled:opacity-60"
          >
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Testimonial'}
          </button>
        </form>
      </div>
    </div>
  );
}
