import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, Search, X, ChevronDown, MapPin, Grid3X3, List } from 'lucide-react';
import PropertyCard from '../components/PropertyCard';
import { getProperties } from '../lib/queries';

const AREAS = ['All', 'Bandra West', 'Worli', 'Lower Parel', 'Juhu', 'Powai', 'Malabar Hill', 'Andheri West', 'Thane', 'Santacruz', 'Khar West', 'Tardeo', 'BKC'];
const TYPES = ['All', 'Residential', 'Commercial'];
const BHKS = ['Any', '1', '2', '3', '4', '5+'];
const SORTS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Area: Low to High', value: 'area-asc' },
];

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties()
      .then(setProperties)
      .catch(() => setProperties([]))
      .finally(() => setLoading(false));
  }, []);

  // Open/Close Accordion state
  const [openSections, setOpenSections] = useState({
    area: true,
    type: false,
    purpose: true,
    bhk: true,
    mumbaiSpecial: true,
    budget: true,
    possession: false,
  });

  const [filters, setFilters] = useState({
    area: searchParams.get('area') || 'All',
    type: searchParams.get('type') || 'All',
    purpose: searchParams.get('purpose') || 'All',
    bhk: 'Any',
    status: 'All',
    minPrice: 0,
    maxPrice: (searchParams.get('purpose') || 'All') === 'Rent' ? 1000000 : 200000000,
    possession: 'All',
    vastuCompliant: false,
    seaFacing: false,
    gatedTownship: false,
    minParking: 'Any',
  });

  useEffect(() => {
    const area = searchParams.get('area') || 'All';
    const type = searchParams.get('type') || 'All';
    const purpose = searchParams.get('purpose') || 'All';
    const bhk = searchParams.get('bhk') || 'Any';
    const maxPriceParam = searchParams.get('maxPrice');
    const searchVal = searchParams.get('search') || '';

    setFilters(f => ({
      ...f,
      area,
      type,
      purpose,
      bhk,
      maxPrice: maxPriceParam ? parseInt(maxPriceParam, 10) : (purpose === 'Rent' ? 1000000 : 200000000)
    }));
    if (searchVal) setSearch(searchVal);
  }, [searchParams]);

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const setFilter = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const handlePurposeChange = (purposeVal) => {
    setFilters(f => ({
      ...f,
      purpose: purposeVal,
      maxPrice: purposeVal === 'Rent' ? 1000000 : 200000000,
      minPrice: 0
    }));
  };

  const filtered = useMemo(() => {
    let list = [...properties];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q) || p.area.toLowerCase().includes(q));
    }
    if (filters.area !== 'All') list = list.filter(p => p.area === filters.area);
    if (filters.type !== 'All') list = list.filter(p => p.type === filters.type);
    if (filters.purpose !== 'All') list = list.filter(p => p.purpose === filters.purpose);
    if (filters.bhk !== 'Any') {
      const n = parseInt(filters.bhk);
      list = filters.bhk === '5+' ? list.filter(p => p.bhk >= 5) : list.filter(p => p.bhk === n);
    }
    if (filters.status !== 'All') list = list.filter(p => p.status === filters.status);
    list = list.filter(p => p.price >= filters.minPrice && p.price <= filters.maxPrice);
    if (filters.possession === 'Ready') list = list.filter(p => p.possession === 'Ready to Move');
    if (filters.possession === 'Under Construction') list = list.filter(p => p.status === 'Under Construction');

    // Mumbai specialties filters logic
    if (filters.vastuCompliant) {
      list = list.filter(p => 
        p.vastuCompliant || 
        p.highlights?.some(h => h.toLowerCase().includes('vastu')) ||
        p.facing?.toLowerCase().includes('east') ||
        p.facing?.toLowerCase().includes('north')
      );
    }
    if (filters.seaFacing) {
      list = list.filter(p => 
        p.facing?.toLowerCase().includes('sea') || 
        p.highlights?.some(h => h.toLowerCase().includes('sea'))
      );
    }
    if (filters.gatedTownship) {
      list = list.filter(p => 
        p.highlights?.some(h => 
          h.toLowerCase().includes('gated') || 
          h.toLowerCase().includes('township') || 
          h.toLowerCase().includes('integrated')
        )
      );
    }
    if (filters.minParking !== 'Any') {
      const minP = parseInt(filters.minParking);
      list = list.filter(p => p.parking >= minP);
    }

    if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
    else if (sort === 'area-asc') list.sort((a, b) => a.sqft - b.sqft);

    return list;
  }, [filters, search, sort, properties]);

  const clearFilters = () => {
    setFilters({
      area: 'All',
      type: 'All',
      purpose: 'All',
      bhk: 'Any',
      status: 'All',
      minPrice: 0,
      maxPrice: 200000000,
      possession: 'All',
      vastuCompliant: false,
      seaFacing: false,
      gatedTownship: false,
      minParking: 'Any',
    });
    setSearch('');
  };

  const hasFilters = 
    filters.area !== 'All' || 
    filters.type !== 'All' || 
    filters.purpose !== 'All' || 
    filters.bhk !== 'Any' || 
    filters.status !== 'All' || 
    filters.vastuCompliant || 
    filters.seaFacing || 
    filters.gatedTownship || 
    filters.minParking !== 'Any' || 
    search;

  const Sidebar = () => (
    <div className="space-y-5">
      {/* Area / Location Accordion */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('area')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>Area / Location</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.area ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.area && (
          <div className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1 transition-all duration-300">
            {AREAS.map(a => (
              <label key={a} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="area"
                  value={a}
                  checked={filters.area === a}
                  onChange={() => setFilter('area', a)}
                  className="accent-accent w-4 h-4 cursor-pointer"
                />
                <span className={`text-xs tracking-wider transition-colors duration-300 group-hover:text-white font-semibold ${filters.area === a ? 'text-white' : 'text-cream/50'}`}>
                  {a}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Property Type Accordion */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('type')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>Property Type</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.type ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.type && (
          <div className="mt-3 flex flex-wrap gap-2 transition-all duration-300">
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilter('type', t)}
                className={`text-[9px] uppercase tracking-widest font-bold px-3.5 py-2 rounded-full border transition-all duration-300 ${
                  filters.type === t
                    ? 'bg-accent text-white border-accent shadow-luxury'
                    : 'border-white/10 text-cream/50 hover:border-accent hover:text-white hover:bg-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Transaction Type (Rent / Buy) Accordion */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('purpose')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>For Rent / Sale</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.purpose ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.purpose && (
          <div className="mt-3 flex flex-wrap gap-2 transition-all duration-300">
            {[
              { label: 'All', value: 'All' },
              { label: 'For Sale (Buy)', value: 'Buy' },
              { label: 'For Rent', value: 'Rent' }
            ].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handlePurposeChange(value)}
                className={`text-[9px] uppercase tracking-widest font-bold px-3.5 py-2 rounded-full border transition-all duration-300 ${
                  filters.purpose === value
                    ? 'bg-accent text-white border-accent shadow-luxury'
                    : 'border-white/10 text-cream/50 hover:border-accent hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* BHK Configuration Accordion */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('bhk')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>BHK Configuration</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.bhk ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.bhk && (
          <div className="mt-3 flex flex-wrap gap-1.5 transition-all duration-300">
            {BHKS.map(b => (
              <button
                key={b}
                onClick={() => setFilter('bhk', b)}
                className={`text-[9px] uppercase tracking-widest font-bold px-3 py-2 rounded-full border transition-all duration-300 ${
                  filters.bhk === b
                    ? 'bg-accent text-white border-accent shadow-luxury'
                    : 'border-white/10 text-cream/50 hover:border-accent hover:text-white hover:bg-white/5'
                }`}
              >
                {b === 'Any' ? 'Any' : `${b} BHK`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mumbai Specialties Accordion */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('mumbaiSpecial')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>Mumbai Specialties</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.mumbaiSpecial ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.mumbaiSpecial && (
          <div className="mt-3 space-y-3 transition-all duration-300">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.vastuCompliant}
                onChange={e => setFilter('vastuCompliant', e.target.checked)}
                className="accent-accent w-4 h-4 cursor-pointer rounded border-white/10"
              />
              <span className={`text-xs tracking-wider transition-colors duration-300 group-hover:text-white font-semibold ${filters.vastuCompliant ? 'text-white' : 'text-cream/50'}`}>
                Vastu Shastra Compliant
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.seaFacing}
                onChange={e => setFilter('seaFacing', e.target.checked)}
                className="accent-accent w-4 h-4 cursor-pointer rounded border-white/10"
              />
              <span className={`text-xs tracking-wider transition-colors duration-300 group-hover:text-white font-semibold ${filters.seaFacing ? 'text-white' : 'text-cream/50'}`}>
                Sea Facing / Sea View
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.gatedTownship}
                onChange={e => setFilter('gatedTownship', e.target.checked)}
                className="accent-accent w-4 h-4 cursor-pointer rounded border-white/10"
              />
              <span className={`text-xs tracking-wider transition-colors duration-300 group-hover:text-white font-semibold ${filters.gatedTownship ? 'text-white' : 'text-cream/50'}`}>
                Gated Community / Township
              </span>
            </label>

            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-cream/40 block mb-2">Min Car Parking</span>
              <div className="flex gap-1.5">
                {['Any', '1', '2', '3+'].map(p => (
                  <button
                    key={p}
                    onClick={() => setFilter('minParking', p)}
                    className={`flex-1 py-1.5 rounded-lg border text-[10px] font-bold uppercase transition-all duration-300 ${
                      filters.minParking === p
                        ? 'bg-accent text-white border-accent shadow-sm'
                        : 'border-white/10 text-cream/50 hover:border-accent hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Max Budget Accordion */}
      <div className="border-b border-white/5 pb-4">
        <button
          onClick={() => toggleSection('budget')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>Max Budget</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.budget ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.budget && (
          <div className="mt-3 transition-all duration-300">
            {filters.purpose === 'Rent' ? (
              <>
                <div className="text-white font-bold text-sm tracking-wider mb-3">
                  {filters.maxPrice >= 1000000 ? 'No Limit' : filters.maxPrice >= 100000 ? `₹${(filters.maxPrice / 100000).toFixed(1)} Lakh / mo` : `₹${new Intl.NumberFormat('en-IN').format(filters.maxPrice)} / mo`}
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={10000}
                  value={filters.maxPrice > 1000000 ? 1000000 : filters.maxPrice}
                  onChange={e => setFilter('maxPrice', parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[9px] uppercase tracking-wider text-cream/40 font-bold mt-2">
                  <span>Any</span><span>₹10 Lakh+</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-white font-bold text-sm tracking-wider mb-3">
                  {filters.maxPrice >= 200000000 ? 'No Limit' : `₹${(filters.maxPrice / 10000000).toFixed(1)} Cr`}
                </div>
                <input
                  type="range"
                  min={0}
                  max={200000000}
                  step={5000000}
                  value={filters.maxPrice}
                  onChange={e => setFilter('maxPrice', parseInt(e.target.value))}
                  className="w-full cursor-pointer"
                />
                <div className="flex justify-between text-[9px] uppercase tracking-wider text-cream/40 font-bold mt-2">
                  <span>Any</span><span>₹20 Cr+</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Possession Accordion */}
      <div className="border-b border-white/5 pb-4 last:border-b-0 last:pb-0">
        <button
          onClick={() => toggleSection('possession')}
          className="w-full flex items-center justify-between font-serif font-bold text-white text-sm py-1.5 tracking-wide text-left hover:text-accent transition-colors duration-300"
        >
          <span>Possession Status</span>
          <ChevronDown
            size={14}
            className={`text-accent transition-transform duration-300 ${openSections.possession ? 'rotate-180' : ''}`}
          />
        </button>
        {openSections.possession && (
          <div className="mt-3 flex flex-wrap gap-2 transition-all duration-300">
            {['All', 'Ready', 'Under Construction'].map(s => (
              <button
                key={s}
                onClick={() => setFilter('possession', s)}
                className={`text-[9px] uppercase tracking-widest font-bold px-3.5 py-2 rounded-full border transition-all duration-300 ${
                  filters.possession === s
                    ? 'bg-accent text-white border-accent shadow-luxury'
                    : 'border-white/10 text-cream/50 hover:border-accent hover:text-white hover:bg-white/5'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasFilters && (
        <button
          onClick={clearFilters}
          className="w-full border border-red-500/30 text-red-400 hover:bg-red-950/20 text-[9px] uppercase tracking-widest font-bold py-3.5 rounded-full transition-all duration-300"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-20 page-enter bg-transparent min-h-screen">
      {/* Header */}
      <div className="bg-[#110D1A]/50 backdrop-blur-md py-14 px-4 border-b border-white/5">
        <div className="container-wide">
          <p className="text-cream/60 text-[9px] uppercase tracking-widest font-bold mb-3">
            <Link to="/" className="text-cream/50 hover:text-white transition-colors duration-300">Home</Link>
            {' / '}<span className="text-cream/80">Properties</span>
          </p>
          <h1 className="font-serif text-3xl md:text-5xl text-white mb-6 leading-tight">Mumbai Properties</h1>
          <div className="flex items-center gap-3 max-w-xl">
            <div className="flex-1 bg-white/[0.04] border border-white/10 rounded-2xl flex items-center gap-3 px-4 py-3 shadow-luxury">
              <Search size={16} className="text-white shrink-0" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search property, area, project…"
                className="flex-1 bg-transparent text-sm text-white placeholder:text-cream/35 outline-none font-medium"
              />
              {search && <button onClick={() => setSearch('')}><X size={15} className="text-cream/50 hover:text-white" /></button>}
            </div>
          </div>
        </div>
      </div>

      <div className="container-wide py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(o => !o)}
              className="lg:hidden flex items-center gap-2 border border-white/10 bg-white/10 rounded-full px-5 py-2.5 text-xs uppercase tracking-wider font-bold text-white hover:border-accent hover:text-white transition-all duration-300 shadow-sm"
            >
              <SlidersHorizontal size={14} className="text-white" /> Filters
              {hasFilters && <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            <span className="text-cream/50 text-xs tracking-wide">
              Showing <span className="font-bold text-white">{filtered.length}</span> luxury listings
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-cream/55 text-xs font-bold uppercase tracking-wider hidden sm:inline">Sort by:</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="border border-white/10 rounded-xl px-4 py-2.5 text-xs font-semibold text-white outline-none focus:border-accent bg-[#110D1A]/80 backdrop-blur-md shadow-sm cursor-pointer"
            >
              {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="glass rounded-3xl p-6 shadow-luxury border border-white/10 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif font-bold text-white text-lg">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-[10px] uppercase tracking-widest font-bold text-white hover:text-cream/70 transition-colors duration-300">Clear all</button>
                )}
              </div>
              <Sidebar />
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="lg:hidden fixed inset-0 z-50 flex">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <div className="relative bg-[#110D1A]/95 w-80 max-w-full p-6 overflow-y-auto ml-auto animate-slide-in shadow-float border-l border-white/10 rounded-l-3xl flex flex-col">
                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                  <h3 className="font-serif font-bold text-white text-xl">Filters</h3>
                  <button onClick={() => setSidebarOpen(false)} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5"><X size={16} className="text-cream" /></button>
                </div>
                <Sidebar />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="glass rounded-3xl p-12 text-center border border-white/10 shadow-luxury text-cream/50 text-sm">
                Loading properties…
              </div>
            ) : filtered.length === 0 ? (
              <div className="glass rounded-3xl p-12 text-center border border-white/10 shadow-luxury">
                <MapPin size={40} className="text-white/30 mx-auto mb-4" />
                <h3 className="font-serif text-2xl font-bold text-white mb-2">No properties match</h3>
                <p className="text-cream/50 text-xs mb-6 max-w-xs mx-auto leading-relaxed">We couldn't find any listings matching your current filter choices. Try widening your criteria.</p>
                <button onClick={clearFilters} className="bg-accent hover:bg-accent-dark text-white px-7 py-3 rounded-full text-xs uppercase tracking-wider font-bold shadow-luxury transition-all duration-300">
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map(p => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
