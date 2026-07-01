import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, TrendingUp, Shield, Clock, Star,
  ArrowRight, ChevronRight, Building2, Users, Award, CheckCircle,
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { properties, areas, testimonials } from '../data/properties';

const STATS = [
  { value: '500+', label: 'Properties Listed', icon: Building2 },
  { value: '₹1,200 Cr+', label: 'Deals Closed', icon: TrendingUp },
  { value: '1,800+', label: 'Happy Clients', icon: Users },
  { value: '12 Years', label: 'Market Experience', icon: Award },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Verified Listings',
    desc: 'Every property is personally verified by our team. Zero fake listings, guaranteed.',
  },
  {
    icon: Clock,
    title: '24-Hour Response',
    desc: 'Submit an inquiry and receive a callback from our expert within 24 hours.',
  },
  {
    icon: Shield,
    title: 'Broker Confidentiality',
    desc: 'Your contact details are shared only when you choose to connect. Full privacy, always.',
  },
  {
    icon: Star,
    title: 'Expert Guidance',
    desc: 'Our advisors have 12+ years of Mumbai market knowledge to guide every step.',
  },
];

const STEPS = [
  { num: '01', title: 'Browse & Shortlist', desc: 'Explore hundreds of curated properties. Filter by area, budget, and type to find your perfect match.' },
  { num: '02', title: 'Request Details', desc: 'Fill a simple inquiry form. Your identity is protected until you are ready to connect.' },
  { num: '03', title: 'Visit & Close', desc: 'Schedule a site visit at your convenience. Our team handles paperwork and negotiation.' },
];

const PASTEL_BGS = [
  'bg-white/[0.04] backdrop-blur-md border-white/5 shadow-sm',
  'bg-white/[0.03] backdrop-blur-md border-white/5 shadow-sm',
  'bg-white/[0.05] backdrop-blur-md border-white/5 shadow-sm',
  'bg-white/[0.02] backdrop-blur-md border-white/5 shadow-sm'
];

export default function Home() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Buy');
  const [location, setLocation] = useState('');

  const featured = properties.filter(p => p.featured).slice(0, 6);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set('area', location);
    if (tab === 'Commercial') {
      params.set('type', 'Commercial');
    } else {
      params.set('type', 'Residential');
      params.set('purpose', tab);
    }
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="page-enter bg-transparent">
      {/* ── HERO — fully transparent so the sunset background shows ─ */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden" style={{ zIndex: 1 }}>
        {/* Bottom fade to blend into content sections below */}
        <div className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #110D1A)' }} />

        <div className="w-full max-w-7xl px-8 md:px-16 lg:px-24 pt-20 relative z-10 text-left text-white select-none">
          <div className="max-w-xl lg:max-w-2xl flex flex-col gap-6">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight">
              Find Your Perfect<br />
              <span className="font-light italic text-accent/90">Mumbai Address</span>
            </h1>
            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-lg mb-2">
              From sea facing penthouses in Worli to thriving commercial spaces in BKC. Discover Mumbai's finest properties, curated exclusively for you.
            </p>

            {/* Search system */}
            <div className="w-full">
              <div className="flex gap-2 mb-3 bg-black/35 p-1 rounded-full max-w-xs border border-white/5">
                {['Buy', 'Rent', 'Commercial'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all duration-300 ${
                      tab === t ? 'bg-accent text-white shadow-luxury' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <form
                onSubmit={handleSearch}
                className="bg-white/[0.05] backdrop-blur-md rounded-2xl p-1.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 border border-white/10"
              >
                <div className="flex-1 flex items-center px-4 py-2.5">
                  <MapPin size={16} className="text-accent mr-3 shrink-0" />
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Search by area, locality or project…"
                    className="w-full text-sm text-white font-medium placeholder:text-white/30 outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-7 py-3 rounded-xl text-[11px] flex items-center justify-center gap-2 transition-all duration-300 shrink-0"
                >
                  <Search size={13} />
                  Search
                </button>
              </form>
              <div className="flex flex-wrap gap-2 mt-4 justify-start">
                {['Bandra West', 'Worli', 'Lower Parel', 'Powai', 'Juhu'].map(a => (
                  <button
                    key={a}
                    onClick={() => setLocation(a)}
                    className="text-white/50 hover:text-white text-[10px] uppercase tracking-wider font-bold border border-white/10 hover:border-white/30 rounded-full px-3 py-1.5 transition-all duration-300"
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTENT ─────────────────────────────────────── */}
      <div>

      {/* ── STATS ───────────────────────────────────────── */}
      <section className="bg-[#110D1A]/55 backdrop-blur-md py-12 border-y border-white/5">
        <div className="container-wide grid grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }, idx) => (
            <div key={label} className={`text-center flex flex-col items-center justify-center ${idx < 3 ? 'lg:border-r lg:border-white/5' : ''}`}>
              <Icon size={20} className="text-white mb-3 animate-pulse" />
              <div className="font-serif font-bold text-3xl text-white mb-1">{value}</div>
              <div className="text-cream/40 text-[10px] uppercase tracking-widest font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ─────────────────────────── */}
      <section className="section-padding bg-transparent">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Handpicked For You</p>
              <h2 className="font-serif text-3xl md:text-5xl text-white accent-line">
                Featured Properties
              </h2>
            </div>
            <Link
              to="/properties"
              className="hidden sm:flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white hover:text-white transition-colors duration-300 border-b border-white/10 pb-0.5"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div className="text-center mt-12 sm:hidden">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-full text-xs shadow-luxury transition-all duration-300"
            >
              View All Properties <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── AREA EXPLORER ───────────────────────────────── */}
      <section className="section-padding bg-transparent">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Mumbai's Best</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white accent-line-center">
              Explore by Neighbourhood
            </h2>
            <p className="text-cream/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              From the glamour of Bandra West to the serene heights of Malabar Hill, every Mumbai neighbourhood tells a unique story.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {areas.map(a => (
              <Link
                key={a.name}
                to={`/properties?area=${encodeURIComponent(a.name)}`}
                className="group relative rounded-3xl overflow-hidden aspect-[4/3] cursor-pointer shadow-luxury border border-white/10"
              >
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110D1A]/95 via-[#110D1A]/20 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="text-white font-serif font-bold text-xl">{a.name}</div>
                  <div className="text-cream/50 text-xs mt-1">{a.count} Properties</div>
                  <div className="text-white text-xs font-bold mt-0.5">{a.priceRange}</div>
                </div>
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md group-hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-sm">
                  <ChevronRight size={15} className="text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY SYNEX REALTY ────────────────────────────── */}
      <section className="section-padding bg-transparent">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Our Promise</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white accent-line-center">
              Why Choose Synex Realty
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map(({ icon: Icon, title, desc }, idx) => (
              <div
                key={title}
                className={`${PASTEL_BGS[idx % PASTEL_BGS.length]} rounded-3xl p-8 border hover:shadow-luxury-hover transition-all duration-500 hover:-translate-y-1 flex flex-col justify-between group`}
              >
                <div>
                  <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-accent transition-colors duration-300">
                    <Icon size={18} className="text-white group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-serif font-bold text-white text-lg mb-3">{title}</h3>
                  <p className="text-cream/65 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section className="section-padding bg-transparent relative overflow-hidden">
        {/* decorative dots */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, #D48C70 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}
        />
        <div className="container-wide relative">
          <div className="text-center mb-16">
            <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative mb-12">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[16.6%] right-[16.6%] h-px bg-white/10" />
            {STEPS.map(({ num, title, desc }) => (
              <div key={num} className="text-center relative group">
                <div className="w-16 h-16 bg-white/[0.04] border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-luxury transition-all duration-300 group-hover:border-accent">
                  <span className="font-serif font-bold text-xl text-white">{num}</span>
                </div>
                <h3 className="font-serif font-semibold text-white text-lg mb-3">{title}</h3>
                <p className="text-cream/50 text-xs leading-relaxed max-w-xs mx-auto">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-full text-xs transition-colors duration-300 shadow-luxury"
            >
              Start Browsing <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section className="section-padding bg-transparent">
        <div className="container-wide">
          <div className="text-center mb-16">
            <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Client Stories</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white accent-line-center">
              What Our Clients Say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map(t => (
              <div key={t.id} className="glass rounded-3xl p-8 shadow-luxury border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="text-white fill-accent" />
                    ))}
                  </div>
                  <p className="text-cream/60 text-xs leading-relaxed mb-6 italic">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 border-t border-white/5 pt-5 mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-white/10"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-serif font-bold text-white text-sm">{t.name}</div>
                    <div className="text-cream/45 text-[10px] tracking-wider uppercase font-bold">{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────── */}
      <section
        className="relative py-24 overflow-hidden border-t border-white/5"
        style={{ background: 'linear-gradient(135deg, rgba(17,13,26,0.97) 0%, rgba(21,16,29,0.99) 100%)' }}
      >
        <div className="container-wide text-center text-white relative">
          <CheckCircle size={36} className="text-white mx-auto mb-5 animate-pulse" />
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-white mb-5">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-cream/50 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Talk to one of our expert consultants today. No pressure, no spam, just genuine help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/properties"
              className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-full text-xs shadow-luxury transition-all duration-300"
            >
              Browse Properties <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-wider px-8 py-3.5 rounded-full text-xs border border-white/15 transition-all duration-300"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
}
