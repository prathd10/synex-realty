import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, BedDouble, Bath, Maximize2, Car, Building2,
  Sun, Calendar, BadgeCheck, Heart, Share2, ChevronLeft,
  ChevronRight, X, CheckCircle, Calculator, ArrowRight,
  Eye, Video, Phone,
} from 'lucide-react';
import { properties } from '../data/properties';
import PropertyCard from '../components/PropertyCard';

function EMICalculator({ price }) {
  const [loan, setLoan] = useState(Math.round(price * 0.8 / 100000) * 100000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const emi = useMemo(() => {
    const p = loan;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    if (!p || !r || !n) return 0;
    return Math.round((p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }, [loan, rate, tenure]);

  const fmt = (n) => new Intl.NumberFormat('en-IN').format(n);

  return (
    <div className="glass rounded-3xl p-6 border border-white/10 shadow-luxury">
      <div className="flex items-center gap-2.5 mb-5 border-b border-white/5 pb-3">
        <Calculator size={16} className="text-white" />
        <h4 className="font-serif font-bold text-white text-sm tracking-wide">EMI Estimator</h4>
      </div>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-xs text-cream/50 font-semibold mb-2">
            <span>Loan Amount</span>
            <span className="font-serif font-bold text-white">₹{fmt(loan)}</span>
          </div>
          <input type="range" min={500000} max={price} step={500000}
            value={loan} onChange={e => setLoan(+e.target.value)} className="w-full cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-cream/50 font-semibold mb-2">
            <span>Interest Rate</span>
            <span className="font-serif font-bold text-white">{rate}% p.a.</span>
          </div>
          <input type="range" min={6} max={15} step={0.1}
            value={rate} onChange={e => setRate(+e.target.value)} className="w-full cursor-pointer" />
        </div>
        <div>
          <div className="flex justify-between text-xs text-cream/50 font-semibold mb-2">
            <span>Tenure</span>
            <span className="font-serif font-bold text-white">{tenure} Years</span>
          </div>
          <input type="range" min={5} max={30} step={1}
            value={tenure} onChange={e => setTenure(+e.target.value)} className="w-full cursor-pointer" />
        </div>
        <div className="bg-[#110D1A]/60 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/5 shadow-sm">
          <div className="text-[10px] text-cream/40 font-semibold uppercase tracking-wider mb-1">Estimated Monthly EMI</div>
          <div className="font-serif font-bold text-2xl text-white">₹{fmt(emi)}</div>
          <div className="text-[9px] text-cream/35 mt-1.5">*Indicative rates. Contact our team to request exact terms.</div>
        </div>
      </div>
    </div>
  );
}

function InquiryForm({ propertyTitle }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center py-8 bg-white/[0.04] rounded-2xl border border-white/5">
        <CheckCircle size={36} className="text-white mx-auto mb-3" />
        <h4 className="font-serif font-bold text-white text-base mb-1.5">Inquiry Received!</h4>
        <p className="text-cream/50 text-xs leading-relaxed max-w-xs mx-auto px-4">
          Our senior consultant will contact you within <strong>24 hours</strong>. Your search details remain confidential.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-white hover:text-white text-xs font-bold uppercase tracking-wider hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3.5">
        <div>
          <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Full Name *</label>
          <input
            required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Rahul Sharma"
            className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Phone *</label>
          <input
            required value={form.phone} onChange={e => set('phone', e.target.value)}
            placeholder="+91 98765"
            className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Email</label>
        <input
          value={form.email} onChange={e => set('email', e.target.value)}
          placeholder="rahul@email.com" type="email"
          className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300"
        />
      </div>
      <div>
        <label className="text-[10px] uppercase tracking-wider font-bold text-cream/50 block mb-1.5">Message</label>
        <textarea
          value={form.message} onChange={e => set('message', e.target.value)}
          placeholder="I'm interested in this property…"
          rows={3}
          className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-medium focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20 transition-all duration-300 resize-none"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 text-xs shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5"
      >
        Request Details
      </button>
      <p className="text-[9px] text-cream/35 text-center leading-relaxed">
        Your contact details are shared only with our consultant. We fully respect your confidentiality.
      </p>
    </form>
  );
}

export default function PropertyDetail() {
  const { id } = useParams();
  const property = properties.find(p => p.id === parseInt(id));

  const [activeImg, setActiveImg] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [liked, setLiked] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const similar = useMemo(() =>
    properties.filter(p => p.id !== property?.id && (p.area === property?.area || p.bhk === property?.bhk)).slice(0, 3),
    [property]
  );

  if (!property) {
    return (
      <div className="pt-32 text-center bg-transparent min-h-screen">
        <h2 className="font-serif text-2xl text-white mb-4">Property not found</h2>
        <Link to="/properties" className="text-white hover:underline">← Back to Properties</Link>
      </div>
    );
  }

  const prevImg = () => setActiveImg(i => (i - 1 + property.images.length) % property.images.length);
  const nextImg = () => setActiveImg(i => (i + 1) % property.images.length);

  const specs = [
    { icon: BedDouble, label: 'Bedrooms', value: property.bhk ? `${property.bhk} BHK` : 'Open Plan' },
    { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
    { icon: Maximize2, label: 'Built-up Area', value: property.sqftDisplay },
    { icon: Building2, label: 'Floor', value: `${property.floor} / ${property.totalFloors}` },
    { icon: Car, label: 'Parking', value: property.parking ? `${property.parking} Covered` : 'None' },
    { icon: Sun, label: 'Facing', value: property.facing },
    { icon: Calendar, label: 'Possession', value: property.possession },
    { icon: Building2, label: 'Age', value: property.ageYears === 0 ? 'New' : `${property.ageYears} Year${property.ageYears > 1 ? 's' : ''}` },
  ];

  return (
    <div className="pt-20 page-enter bg-transparent min-h-screen">
      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(false)}>
          <button className="absolute left-6 text-white/70 hover:text-white p-3 hover:scale-105 transition-transform" onClick={e => { e.stopPropagation(); prevImg(); }}>
            <ChevronLeft size={40} />
          </button>
          <img
            src={property.images[activeImg]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl shadow-float border border-white/10"
            onClick={e => e.stopPropagation()}
          />
          <button onClick={e => { e.stopPropagation(); nextImg(); }} className="absolute right-6 text-white/70 hover:text-white p-3 hover:scale-105 transition-transform">
            <ChevronRight size={40} />
          </button>
          <button onClick={() => setLightbox(false)} className="absolute top-6 right-6 text-white/70 hover:text-white p-3 hover:scale-105 transition-transform">
            <X size={32} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-xs font-bold uppercase tracking-wider">
            {activeImg + 1} / {property.images.length}
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-white/[0.03] border-b border-white/5 py-4 px-4 backdrop-blur-md">
        <div className="container-wide flex items-center gap-2.5 text-xs text-cream/50 font-bold uppercase tracking-wider">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-cream/20">/</span>
          <Link to="/properties" className="hover:text-white transition-colors">Properties</Link>
          <span className="text-cream/20">/</span>
          <span className="text-white truncate max-w-xs normal-case font-bold">{property.title}</span>
        </div>
      </div>

      <div className="container-wide py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Gallery */}
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-4 cursor-pointer group shadow-luxury border border-white/10" onClick={() => setLightbox(true)}>
              <img
                src={property.images[activeImg]}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent transition-all" />
              <button onClick={e => { e.stopPropagation(); prevImg(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center shadow-luxury transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 border border-white/15">
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button onClick={e => { e.stopPropagation(); nextImg(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-accent rounded-full flex items-center justify-center shadow-luxury transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-105 border border-white/15">
                <ChevronRight size={20} className="text-white" />
              </button>
              <div className="absolute bottom-4 right-4 bg-[#110D1A]/80 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-sm border border-white/10">
                <Eye size={12} className="text-white" /> {property.images.length} Photos
              </div>
              {/* Virtual tour button */}
              <div className="absolute bottom-4 left-4">
                <button className="bg-[#110D1A]/85 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-accent transition-all shadow-sm border border-white/5 hover:scale-[1.02]">
                  <Video size={13} className="text-white" /> 360° Virtual Tour
                </button>
              </div>
            </div>
            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto hide-scrollbar pb-1.5">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-22 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                      activeImg === i ? 'border-accent shadow-luxury' : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title + badges */}
            <div className="mt-8">
              <div className="flex flex-wrap gap-2.5 mb-4">
                {property.reraApproved && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-green-300 border border-white/5 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
                    <BadgeCheck size={12} className="text-green-400" /> RERA Approved
                  </span>
                )}
                {property.isNew && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-accent/20 text-white border border-accent/20 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">New Launch</span>
                )}
                {property.featured && (
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/50 text-cream border border-white/5 px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">Featured</span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm border backdrop-blur-md ${
                  property.status === 'Available' ? 'bg-green-950/40 text-green-300 border-green-900/30' : 'bg-amber-950/40 text-amber-300 border-amber-900/30'
                }`}>
                  {property.status}
                </span>
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-white font-bold mb-3 leading-tight">{property.title}</h1>
              <div className="flex items-center gap-1.5 text-cream/50 text-sm mb-2.5">
                <MapPin size={14} className="text-white shrink-0" />
                {property.address}
              </div>
              <div className="flex items-center gap-3 text-xs text-cream/40 font-bold">
                <span>Floor {property.floor} of {property.totalFloors}</span>
                <span className="text-white/10">·</span>
                <span>{property.facing}</span>
                <span className="text-white/10">·</span>
                <span>{property.category}</span>
              </div>
            </div>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="glass border border-white/10 shadow-luxury rounded-2xl p-4 text-center">
                  <Icon size={18} className="text-white mx-auto mb-2" />
                  <div className="font-serif font-bold text-white text-sm">{value}</div>
                  <div className="text-cream/50 text-[10px] tracking-wider uppercase font-bold mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Highlights */}
            {property.highlights?.length > 0 && (
              <div className="mb-8 border-b border-white/5 pb-6">
                <h3 className="font-serif font-bold text-white text-xl mb-4">Key Highlights</h3>
                <div className="flex flex-wrap gap-2.5">
                  {property.highlights.map(h => (
                    <span key={h} className="flex items-center gap-1.5 text-xs bg-white/[0.04] text-cream border border-white/5 px-4 py-2 rounded-full font-bold shadow-sm">
                      <CheckCircle size={13} className="text-white" /> {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8 border-b border-white/5 pb-6">
              <h3 className="font-serif font-bold text-white text-xl mb-4">About This Property</h3>
              <p className="text-cream/65 leading-relaxed text-sm">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="mb-8 border-b border-white/5 pb-6">
              <h3 className="font-serif font-bold text-white text-xl mb-5">Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map(a => (
                  <div key={a} className="glass border border-white/10 rounded-2xl px-4 py-3 shadow-luxury flex items-center gap-3">
                    <CheckCircle size={14} className="text-white shrink-0" />
                    <span className="text-xs text-white font-bold">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* EMI Calculator */}
            <div className="mb-8 border-b border-white/5 pb-6">
              <h3 className="font-serif font-bold text-white text-xl mb-5">Mortgage Calculator</h3>
              <EMICalculator price={property.price} />
            </div>

            {/* Location placeholder */}
            <div className="mb-8">
              <h3 className="font-serif font-bold text-white text-xl mb-5">Location</h3>
              <div className="glass rounded-3xl h-56 flex items-center justify-center border border-white/10 shadow-luxury p-6">
                <div className="text-center text-cream/50">
                  <MapPin size={32} className="mx-auto mb-3 text-white" />
                  <p className="text-sm font-bold text-white mb-1">{property.address}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-cream/40">Map Integration Available</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN (sticky) ──────────────────── */}
          <aside className="lg:w-80 shrink-0">
            <div className="sticky top-28 space-y-5">
              {/* Price card */}
              <div className="glass rounded-3xl p-6 shadow-luxury border border-white/10">
                <div className="flex items-start justify-between mb-5 border-b border-white/5 pb-4">
                  <div>
                    <div className="font-serif font-bold text-3xl text-white">{property.priceDisplay}</div>
                    <div className="text-cream/45 text-[10px] uppercase tracking-wider font-bold mt-1">
                      {property.purpose === 'Rent' ? 'Rental Property' : `${property.pricePerSqft} / sq.ft`} · {property.sqftDisplay}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setLiked(l => !l)}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 ${
                        liked ? 'bg-red-500 border-transparent text-white shadow-md' : 'border-white/10 text-cream/70 hover:text-red-400 bg-white/[0.04]'
                      }`}
                    >
                      <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setScheduleOpen(true)}
                    className="w-full border border-accent hover:bg-accent text-white hover:text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all duration-300 flex items-center justify-center gap-1.5 shadow-luxury"
                  >
                    <Calendar size={13} className="text-white group-hover:text-white" /> Schedule Site Visit
                  </button>
                  <a
                    href="tel:+919876543210"
                    className="flex items-center justify-center gap-2 w-full bg-[#110D1A]/80 hover:bg-[#110D1A] border border-white/10 text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all duration-300 shadow-luxury"
                  >
                    <Phone size={13} className="text-white" /> Call Advisor
                  </a>
                </div>
              </div>

              {/* Inquiry form */}
              <div className="glass rounded-3xl p-6 shadow-luxury border border-white/10">
                <h3 className="font-serif font-bold text-white text-lg mb-1">Request Private Details</h3>
                <p className="text-cream/50 text-[10px] uppercase tracking-wider font-bold mb-4">Our advisor will reach you within 24 hours.</p>
                <InquiryForm propertyTitle={property.title} />
              </div>

              {/* Schedule visit modal-like */}
              {scheduleOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setScheduleOpen(false)}>
                  <div className="bg-[#110D1A]/95 rounded-3xl p-6 w-full max-w-sm shadow-float border border-white/10 animate-scale-in" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-5 border-b border-white/5 pb-3">
                      <h3 className="font-serif font-bold text-white text-lg">Schedule Site Visit</h3>
                      <button onClick={() => setScheduleOpen(false)} className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5"><X size={15} className="text-cream" /></button>
                    </div>
                    <div className="space-y-3.5">
                      <input type="text" placeholder="Your Name" className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20" />
                      <input type="tel" placeholder="Phone Number" className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-accent bg-white/[0.03] placeholder:text-cream/20" />
                      <input type="date" className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs text-cream focus:outline-none focus:border-accent bg-white/[0.03]" />
                      <select className="w-full border border-white/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-accent text-white bg-[#110D1A] font-bold cursor-pointer">
                        <option className="bg-[#110D1A]">Morning (10 AM – 1 PM)</option>
                        <option className="bg-[#110D1A]">Afternoon (1 PM – 4 PM)</option>
                        <option className="bg-[#110D1A]">Evening (4 PM – 7 PM)</option>
                      </select>
                      <button
                        onClick={() => setScheduleOpen(false)}
                        className="w-full bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider py-3.5 rounded-xl text-xs transition-all duration-300 shadow-luxury"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-20 border-t border-white/5 pt-14">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Selected For You</p>
                <h2 className="font-serif text-2xl md:text-4xl text-white font-bold">Similar Properties</h2>
              </div>
              <Link to="/properties" className="text-cream text-xs font-bold uppercase tracking-wider hover:text-white transition-colors duration-300 border-b border-white/10 pb-0.5">
                View All Listings
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(p => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
