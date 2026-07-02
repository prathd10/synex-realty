import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, MapPin, TrendingUp, Shield, Clock, Star,
  ArrowRight, ChevronRight, Building2, Users, Award, CheckCircle,
  Play, Pause, Volume2, VolumeX, X, Phone
} from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import VideoTourModal from '../components/VideoTourModal';
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
  const [activeVideo, setActiveVideo] = useState(null);
  const [inlinePlayingId, setInlinePlayingId] = useState(null);

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

        <div className="w-full max-w-7xl px-5 sm:px-8 md:px-16 lg:px-24 pt-24 sm:pt-28 relative z-10 text-left text-white select-none">
          <div className="max-w-xl lg:max-w-2xl flex flex-col gap-3 sm:gap-6">
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-tight">
              Find Your Perfect<br />
              <span className="font-light italic text-accent/90">Mumbai Address</span>
            </h1>
            <p className="text-white/85 text-xs sm:text-lg leading-relaxed w-1/2 sm:max-w-lg mb-1 sm:mb-2">
              From sea facing penthouses in Worli to thriving commercial spaces in BKC. Discover Mumbai's finest properties, curated exclusively for you.
            </p>

            {/* Search system */}
            <div className="w-full">
              <div className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3 bg-black/35 p-1 rounded-full max-w-[15rem] sm:max-w-xs border border-white/5">
                {['Buy', 'Rent', 'Commercial'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`flex-1 py-1.5 sm:py-2 rounded-full text-[8px] sm:text-[10px] uppercase tracking-wider font-bold transition-all duration-300 ${
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
                <div className="flex-1 flex items-center px-3 sm:px-4 py-2 sm:py-2.5">
                  <MapPin size={14} className="text-accent mr-2.5 sm:mr-3 shrink-0" />
                  <input
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Search by area, locality or project…"
                    className="w-full text-xs sm:text-sm text-white font-medium placeholder:text-white/30 outline-none bg-transparent"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent-dark text-white font-bold uppercase tracking-wider px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-[11px] flex items-center justify-center gap-2 transition-all duration-300 shrink-0"
                >
                  <Search size={12} />
                  Search
                </button>
              </form>
              <div className="hidden sm:flex flex-wrap gap-2 mt-4 justify-start">
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
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

      {/* ── CINEMATIC VIRTUAL TOURS ─────────────────────── */}
      <section className="section-padding bg-transparent relative">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Experience Before You Visit</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white accent-line-center">
              Cinematic Property Tours
            </h2>
            <p className="text-cream/50 mt-4 max-w-xl mx-auto text-sm leading-relaxed">
              Take high-definition guided virtual walkthroughs of Mumbai's most prestigious and sought-after residential and commercial projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {properties.filter(p => p.videoUrl).map(p => {
              const isInlinePlaying = inlinePlayingId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    if (!isInlinePlaying) {
                      setInlinePlayingId(p.id);
                    }
                  }}
                  className="group relative rounded-3xl overflow-hidden aspect-[16/9] cursor-pointer shadow-luxury border border-white/10 bg-black flex items-center justify-center"
                >
                  {isInlinePlaying ? (
                    <>
                      <video
                        src={p.videoUrl}
                        controls
                        autoPlay
                        playsInline
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-full object-cover z-20"
                      />
                      {/* Close button to reset inline playing state */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setInlinePlayingId(null);
                        }}
                        className="absolute top-4 right-4 z-30 bg-black/60 hover:bg-black/85 text-white p-1.5 rounded-full border border-white/10 transition-all duration-300 flex items-center justify-center"
                        title="Close Video"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Custom Hover Video Preview */}
                      <HomeVideoPreview property={p} />
                      
                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#110D1A]/95 via-[#110D1A]/10 to-transparent transition-opacity duration-300 animate-fade-in" />
                      
                      {/* Play Button Overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-500 shadow-float z-10">
                          <Play size={20} className="text-white fill-white translate-x-0.5 group-hover:scale-105 transition-transform" />
                        </div>
                      </div>

                      {/* Video Tour Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="flex items-center gap-1.5 bg-accent/90 text-white text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping shrink-0" />
                          <span>Watch Walkthrough</span>
                        </span>
                      </div>

                      {/* Details Card */}
                      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10 flex items-end justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-cream/40 text-[9px] uppercase tracking-wider font-bold mb-1">{p.category} · {p.area}</div>
                          <h3 className="font-serif text-white font-bold text-base sm:text-xl truncate group-hover:text-accent transition-colors duration-300">{p.title}</h3>
                          <p className="text-cream/50 text-[11px] sm:text-xs truncate mt-0.5">{p.address}</p>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-cream/40 text-[8px] uppercase tracking-wider font-bold mb-0.5">Value</div>
                          <div className="font-serif font-bold text-white text-sm sm:text-lg">{p.priceDisplay}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {areas.map(a => (
              <Link
                key={a.name}
                to={`/properties?area=${encodeURIComponent(a.name)}`}
                className="group relative rounded-2xl sm:rounded-3xl overflow-hidden aspect-square sm:aspect-[4/3] cursor-pointer shadow-luxury border border-white/10"
              >
                <img
                  src={a.image}
                  alt={a.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#110D1A]/95 via-[#110D1A]/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5">
                  <div className="text-white font-serif font-bold text-sm sm:text-xl leading-snug">{a.name}</div>
                  <div className="text-cream/50 text-[10px] sm:text-xs mt-0.5 sm:mt-1">{a.count} Properties</div>
                  <div className="text-white text-[10px] sm:text-xs font-bold mt-0.5">{a.priceRange}</div>
                </div>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-white/20 backdrop-blur-md group-hover:bg-accent rounded-full flex items-center justify-center transition-all duration-300 shadow-sm">
                  <ChevronRight size={13} className="text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section className="section-padding bg-transparent overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-12">
            <p className="text-cream/60 text-xs font-bold uppercase tracking-widest mb-2">Client Stories</p>
            <h2 className="font-serif text-3xl md:text-5xl text-white accent-line-center">
              What Our Clients Say
            </h2>
          </div>
        </div>
        <div className="marquee-fade">
          <div className="flex w-max gap-4 animate-marquee-left">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="w-64 sm:w-72 shrink-0 glass rounded-2xl p-4 sm:p-5 shadow-luxury border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={11} className="text-white fill-accent" />
                    ))}
                  </div>
                  <p className="text-cream/60 text-[11px] leading-relaxed mb-4 italic line-clamp-4">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-2.5 border-t border-white/5 pt-3 mt-auto">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-8 h-8 rounded-full object-cover shadow-sm border border-white/10"
                    loading="lazy"
                  />
                  <div>
                    <div className="font-serif font-bold text-white text-xs">{t.name}</div>
                    <div className="text-cream/45 text-[9px] tracking-wider uppercase font-bold">{t.role} · {t.location}</div>
                  </div>
                </div>
              </div>
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

      {activeVideo && (
        <VideoTourModal 
          property={activeVideo} 
          onClose={() => setActiveVideo(null)} 
        />
      )}

      </div>
    </div>
  );
}

// ── CUSTOM VIDEO COMPONENTS FOR LUXURY SHOWCASE ──────────────────

function HomeVideoPreview({ property }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const playTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (property.videoUrl) {
      playTimeoutRef.current = setTimeout(() => {
        setIsPlaying(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
    if (playTimeoutRef.current) {
      clearTimeout(playTimeoutRef.current);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full"
    >
      <img
        src={property.images[0]}
        alt={property.title}
        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 select-none"
        loading="lazy"
      />
      {property.videoUrl && isPlaying && (
        <video
          ref={videoRef}
          src={property.videoUrl}
          loop
          muted
          playsInline
          autoPlay
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      )}
    </div>
  );
}


