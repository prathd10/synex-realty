import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { getProperty, createProperty, updateProperty } from '../../lib/queries';
import ImageUploader from '../../components/admin/ImageUploader';

const EMPTY = {
  title: '', address: '', area: '', price: '', priceDisplay: '', pricePerSqft: '',
  type: 'Residential', category: 'Apartment', purpose: 'Buy', status: 'Available',
  bhk: '', bathrooms: '', sqft: '', sqftDisplay: '', floor: '', totalFloors: '',
  parking: '', facing: '', possession: 'Ready to Move', ageYears: '',
  featured: false, isNew: false, isPriceDrop: false, reraApproved: false,
  videoUrl: '', images: [], amenities: [], highlights: [], description: '',
};

function Field({ label, children }) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] transition-all duration-300';

export default function PropertyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    getProperty(id).then((p) => {
      if (p) {
        setForm({
          ...p,
          amenities: p.amenities || [],
          highlights: p.highlights || [],
          images: p.images || [],
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const setList = (key, text) => set(key, text.split(',').map((s) => s.trim()).filter(Boolean));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price) || 0,
        bhk: form.bhk ? Number(form.bhk) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        sqft: form.sqft ? Number(form.sqft) : null,
        floor: form.floor ? Number(form.floor) : null,
        totalFloors: form.totalFloors ? Number(form.totalFloors) : null,
        parking: form.parking ? Number(form.parking) : null,
        ageYears: form.ageYears ? Number(form.ageYears) : null,
      };
      if (isEdit) {
        await updateProperty(id, payload);
      } else {
        await createProperty(payload);
      }
      navigate('/admin/properties');
    } catch (err) {
      setError(err.message || 'Could not save property.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-cream/40 text-sm">Loading…</div>;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/properties" className="inline-flex items-center gap-1.5 text-cream/50 hover:text-white text-xs font-bold uppercase tracking-wider mb-6 transition-colors">
        <ChevronLeft size={14} /> Back to Properties
      </Link>
      <h1 className="font-serif text-3xl text-white mb-8">{isEdit ? 'Edit Property' : 'Add Property'}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-white text-lg mb-2">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Title *">
              <input required value={form.title} onChange={(e) => set('title', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Area *">
              <input required value={form.area} onChange={(e) => set('area', e.target.value)} className={inputClass} />
            </Field>
          </div>
          <Field label="Address *">
            <input required value={form.address} onChange={(e) => set('address', e.target.value)} className={inputClass} />
          </Field>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Type">
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className={inputClass}>
                <option className="bg-[#110D1A]">Residential</option>
                <option className="bg-[#110D1A]">Commercial</option>
              </select>
            </Field>
            <Field label="Category">
              <input value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass} placeholder="Apartment, Penthouse, Shop…" />
            </Field>
            <Field label="Purpose">
              <select value={form.purpose} onChange={(e) => set('purpose', e.target.value)} className={inputClass}>
                <option className="bg-[#110D1A]">Buy</option>
                <option className="bg-[#110D1A]">Rent</option>
              </select>
            </Field>
          </div>
          <Field label="Status">
            <select value={form.status} onChange={(e) => set('status', e.target.value)} className={inputClass}>
              <option className="bg-[#110D1A]">Available</option>
              <option className="bg-[#110D1A]">Under Construction</option>
              <option className="bg-[#110D1A]">Sold</option>
            </select>
          </Field>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-white text-lg mb-2">Pricing</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Price (raw number) *">
              <input required type="number" value={form.price} onChange={(e) => set('price', e.target.value)} className={inputClass} />
            </Field>
            <Field label="Price Display *">
              <input required value={form.priceDisplay} onChange={(e) => set('priceDisplay', e.target.value)} className={inputClass} placeholder="₹8.5 Cr" />
            </Field>
            <Field label="Price / sq.ft">
              <input value={form.pricePerSqft} onChange={(e) => set('pricePerSqft', e.target.value)} className={inputClass} placeholder="₹52,000" />
            </Field>
          </div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-white text-lg mb-2">Specifications</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            <Field label="BHK"><input type="number" value={form.bhk} onChange={(e) => set('bhk', e.target.value)} className={inputClass} /></Field>
            <Field label="Bathrooms"><input type="number" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)} className={inputClass} /></Field>
            <Field label="Parking"><input type="number" value={form.parking} onChange={(e) => set('parking', e.target.value)} className={inputClass} /></Field>
            <Field label="Age (years)"><input type="number" value={form.ageYears} onChange={(e) => set('ageYears', e.target.value)} className={inputClass} /></Field>
          </div>
          <div className="grid sm:grid-cols-4 gap-4">
            <Field label="Sqft"><input type="number" value={form.sqft} onChange={(e) => set('sqft', e.target.value)} className={inputClass} /></Field>
            <Field label="Sqft Display"><input value={form.sqftDisplay} onChange={(e) => set('sqftDisplay', e.target.value)} className={inputClass} placeholder="1,635 sq.ft" /></Field>
            <Field label="Floor"><input type="number" value={form.floor} onChange={(e) => set('floor', e.target.value)} className={inputClass} /></Field>
            <Field label="Total Floors"><input type="number" value={form.totalFloors} onChange={(e) => set('totalFloors', e.target.value)} className={inputClass} /></Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Facing"><input value={form.facing} onChange={(e) => set('facing', e.target.value)} className={inputClass} placeholder="Sea Facing" /></Field>
            <Field label="Possession"><input value={form.possession} onChange={(e) => set('possession', e.target.value)} className={inputClass} /></Field>
          </div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-white text-lg mb-2">Flags</h2>
          <div className="flex flex-wrap gap-5">
            {[
              ['featured', 'Featured'],
              ['isNew', 'New Launch'],
              ['isPriceDrop', 'Price Drop'],
              ['reraApproved', 'RERA Approved'],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={(e) => set(key, e.target.checked)} className="accent-accent w-4 h-4" />
                <span className="text-xs text-cream/70 font-semibold">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-white text-lg mb-2">Media</h2>
          <ImageUploader images={form.images} onChange={(imgs) => set('images', imgs)} folder="/synex-realty/properties" label="Property Images" />
          <Field label="Video URL (optional)">
            <input value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} className={inputClass} placeholder="https://…" />
          </Field>
        </div>

        <div className="glass border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="font-serif font-bold text-white text-lg mb-2">Details</h2>
          <Field label="Amenities (comma-separated)">
            <input
              defaultValue={(form.amenities || []).join(', ')}
              onBlur={(e) => setList('amenities', e.target.value)}
              className={inputClass}
              placeholder="Swimming Pool, Gymnasium, 24/7 Security"
            />
          </Field>
          <Field label="Highlights (comma-separated)">
            <input
              defaultValue={(form.highlights || []).join(', ')}
              onBlur={(e) => setList('highlights', e.target.value)}
              className={inputClass}
              placeholder="Sea View, Corner Flat"
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className={`${inputClass} resize-none`}
            />
          </Field>
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all duration-300 text-xs shadow-luxury disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Property'}
        </button>
      </form>
    </div>
  );
}
