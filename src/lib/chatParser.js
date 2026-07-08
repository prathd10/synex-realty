// Lightweight rule-based parser for real-estate search intent in free text,
// e.g. "I want a 2bhk in bandra under 1 crore" or "3bhk flat for rent in powai under 50k".

const AREAS = ['Bandra West', 'Worli', 'Lower Parel', 'Juhu', 'Powai', 'Malabar Hill', 'Andheri West', 'Thane', 'Santacruz', 'Khar West', 'Tardeo', 'BKC'];

const NUMBER_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };

function parseAmount(numStr, unit) {
  const n = parseFloat(numStr.replace(/,/g, ''));
  if (Number.isNaN(n)) return null;
  const u = (unit || '').toLowerCase();
  if (u.startsWith('cr')) return n * 10000000;
  if (u.startsWith('l')) return n * 100000;
  if (u === 'k') return n * 1000;
  return n;
}

export function parsePropertyQuery(text) {
  const lower = text.toLowerCase();
  const filters = {};

  const bhkMatch = lower.match(/(\d+)\s*-?\s*bhk/);
  if (bhkMatch) {
    filters.bhk = parseInt(bhkMatch[1], 10);
  } else {
    for (const [word, num] of Object.entries(NUMBER_WORDS)) {
      if (new RegExp(`\\b${word}\\s*-?\\s*bhk`).test(lower)) {
        filters.bhk = num;
        break;
      }
    }
  }

  if (/\bstudio\b/.test(lower)) filters.category = 'Studio';

  if (/\b(rent|renting|rental|lease)\b/.test(lower)) filters.purpose = 'Rent';
  else if (/\b(buy|buying|purchase|sale|sell)\b/.test(lower)) filters.purpose = 'Buy';

  if (/\b(commercial|office|shop|showroom|retail)\b/.test(lower)) filters.type = 'Commercial';
  else if (/\b(residential|flat|apartment|home|house)\b/.test(lower)) filters.type = 'Residential';

  for (const area of AREAS) {
    const short = area.split(' ')[0].toLowerCase();
    if (lower.includes(area.toLowerCase()) || lower.includes(short)) {
      filters.area = area;
      break;
    }
  }

  const boundedMatch = lower.match(/(?:under|below|less than|within|max|up to|budget of)\s*₹?\s*([\d.,]+)\s*(crore|cr|lakhs?|l|k)?/);
  if (boundedMatch) {
    const amount = parseAmount(boundedMatch[1], boundedMatch[2]);
    if (amount) filters.maxPrice = amount;
  } else {
    const bareMatch = lower.match(/₹?\s*([\d.,]+)\s*(crore|cr|lakhs?|l)\b/);
    if (bareMatch) {
      const amount = parseAmount(bareMatch[1], bareMatch[2]);
      if (amount) filters.maxPrice = amount;
    }
  }

  const hasFilters = Object.keys(filters).length > 0;
  return { ...filters, hasFilters };
}

export function formatPrice(n) {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)} L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

export function describeFilters(f) {
  const parts = [];
  if (f.bhk) parts.push(`${f.bhk} BHK`);
  if (f.category === 'Studio') parts.push('Studio');
  if (f.type === 'Commercial') parts.push('commercial');
  if (f.area) parts.push(`in ${f.area}`);
  if (f.purpose) parts.push(f.purpose === 'Rent' ? 'for rent' : 'for sale');
  if (f.maxPrice) parts.push(`under ${formatPrice(f.maxPrice)}`);
  return parts.join(' ') || 'your criteria';
}
