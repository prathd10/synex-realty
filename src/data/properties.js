// Properties and testimonials now live in Supabase (see src/lib/queries.js) and
// were migrated from this file via scripts/seed.mjs. `areas` stays static/curated
// content — it's not part of the admin CRUD scope.

export const areas = [
  {
    name: 'Worli',
    count: 24,
    image: '/images/hero_luxury.png',
    priceRange: '₹40–60K / sq.ft',
  },
  {
    name: 'Bandra West',
    count: 36,
    image: '/images/bandra_modern.png',
    priceRange: '₹35–55K / sq.ft',
  },
  {
    name: 'Lower Parel',
    count: 18,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80',
    priceRange: '₹25–40K / sq.ft',
  },
  {
    name: 'Juhu',
    count: 12,
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    priceRange: '₹30–45K / sq.ft',
  },
  {
    name: 'Powai',
    count: 28,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    priceRange: '₹18–28K / sq.ft',
  },
  {
    name: 'Malabar Hill',
    count: 8,
    image: '/images/malabar_infinity.png',
    priceRange: '₹50–80K / sq.ft',
  },
];
