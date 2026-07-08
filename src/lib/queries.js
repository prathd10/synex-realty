import { supabase } from './supabaseClient';

// ── mapping helpers (DB snake_case ↔ app camelCase) ──────────

function mapPropertyRow(row) {
  return {
    id: row.id,
    title: row.title,
    address: row.address,
    area: row.area,
    price: Number(row.price), // Postgres numeric/bigint come back as strings over PostgREST
    priceDisplay: row.price_display,
    pricePerSqft: row.price_per_sqft,
    type: row.type,
    category: row.category,
    bhk: row.bhk,
    sqft: row.sqft,
    sqftDisplay: row.sqft_display,
    floor: row.floor,
    totalFloors: row.total_floors,
    bathrooms: row.bathrooms,
    parking: row.parking,
    facing: row.facing,
    possession: row.possession,
    ageYears: row.age_years,
    status: row.status,
    purpose: row.purpose,
    featured: row.featured,
    isNew: row.is_new,
    isPriceDrop: row.is_price_drop,
    reraApproved: row.rera_approved,
    videoUrl: row.video_url,
    images: row.images || [],
    amenities: row.amenities || [],
    highlights: row.highlights || [],
    description: row.description,
  };
}

function toPropertyRow(p) {
  return {
    title: p.title,
    address: p.address,
    area: p.area,
    price: p.price,
    price_display: p.priceDisplay,
    price_per_sqft: p.pricePerSqft,
    type: p.type,
    category: p.category,
    bhk: p.bhk || null,
    sqft: p.sqft || null,
    sqft_display: p.sqftDisplay,
    floor: p.floor || null,
    total_floors: p.totalFloors || null,
    bathrooms: p.bathrooms || null,
    parking: p.parking || null,
    facing: p.facing,
    possession: p.possession,
    age_years: p.ageYears || null,
    status: p.status,
    purpose: p.purpose,
    featured: !!p.featured,
    is_new: !!p.isNew,
    is_price_drop: !!p.isPriceDrop,
    rera_approved: !!p.reraApproved,
    video_url: p.videoUrl || null,
    images: p.images || [],
    amenities: p.amenities || [],
    highlights: p.highlights || [],
    description: p.description,
  };
}

// ── properties ────────────────────────────────────────────────

export async function getProperties() {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map(mapPropertyRow);
}

export async function getFeaturedProperties(limit = 6) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(mapPropertyRow);
}

export async function searchProperties(filters = {}, limit = 4) {
  let query = supabase.from('properties').select('*');
  if (filters.bhk) query = query.eq('bhk', filters.bhk);
  if (filters.area) query = query.eq('area', filters.area);
  if (filters.purpose) query = query.eq('purpose', filters.purpose);
  if (filters.type) query = query.eq('type', filters.type);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.maxPrice) query = query.lte('price', filters.maxPrice);

  const { data, error } = await query
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data.map(mapPropertyRow);
}

export async function getProperty(id) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapPropertyRow(data) : null;
}

export async function getSimilarProperties(property, limit = 3) {
  if (!property) return [];
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .neq('id', property.id)
    .or(`area.eq.${property.area},bhk.eq.${property.bhk}`)
    .limit(limit);
  if (error) throw error;
  return data.map(mapPropertyRow);
}

export async function createProperty(property) {
  const { data, error } = await supabase
    .from('properties')
    .insert(toPropertyRow(property))
    .select()
    .single();
  if (error) throw error;
  return mapPropertyRow(data);
}

export async function updateProperty(id, property) {
  const { data, error } = await supabase
    .from('properties')
    .update(toPropertyRow(property))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return mapPropertyRow(data);
}

export async function deleteProperty(id) {
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

// ── testimonials ──────────────────────────────────────────────

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTestimonial(testimonial) {
  const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(id, testimonial) {
  const { data, error } = await supabase
    .from('testimonials')
    .update(testimonial)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
}

// ── leads (CRM) ───────────────────────────────────────────────

export async function createLead({ name, phone, email, source, propertyId = null, details = {} }) {
  const { error } = await supabase.from('leads').insert({
    name,
    phone,
    email,
    source,
    property_id: propertyId,
    details,
  });
  if (error) throw error;
}

export async function getLeads() {
  const { data, error } = await supabase
    .from('leads')
    .select('*, properties(title)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateLeadStatus(id, status) {
  const { error } = await supabase.from('leads').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteLead(id) {
  const { error } = await supabase.from('leads').delete().eq('id', id);
  if (error) throw error;
}

// ── page views (self-tracked analytics) ──────────────────────

const VISITOR_ID_KEY = 'synex_visitor_id';

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_ID_KEY, id);
  }
  return id;
}

export async function logPageView(path) {
  try {
    await supabase.from('page_views').insert({ path, visitor_id: getVisitorId() });
  } catch {
    // Analytics is best-effort — never block the page for this.
  }
}

// ── dashboard stats ───────────────────────────────────────────

export async function getDashboardStats() {
  const [
    { count: totalLeads },
    { count: newEnquiries },
    { count: testimonialsCount },
    { count: propertiesCount },
    { count: totalViews },
    { data: recentLeads },
    { data: viewRows },
  ] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('leads').select('*, properties(title)').order('created_at', { ascending: false }).limit(5),
    supabase.from('page_views').select('visitor_id'),
  ]);

  const uniqueVisitors = new Set((viewRows || []).map((r) => r.visitor_id)).size;

  return {
    totalLeads: totalLeads || 0,
    newEnquiries: newEnquiries || 0,
    testimonialsCount: testimonialsCount || 0,
    propertiesCount: propertiesCount || 0,
    totalViews: totalViews || 0,
    uniqueVisitors,
    recentLeads: recentLeads || [],
  };
}
