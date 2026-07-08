// One-time migration: uploads media from src/data/properties.js to ImageKit,
// then inserts the properties/testimonials into Supabase.
//
// Run with:  node --env-file=.env.local scripts/seed.mjs
// Requires: SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) + IMAGEKIT_PRIVATE_KEY in .env.local.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import ImageKit from '@imagekit/nodejs';
import { properties, testimonials } from '../src/data/properties.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.resolve(__dirname, '../public');

const { VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, IMAGEKIT_PRIVATE_KEY } = process.env;

if (!VITE_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !IMAGEKIT_PRIVATE_KEY) {
  console.error('Missing env vars. Fill in .env.local (see .env.example) before running the seed script.');
  process.exit(1);
}

const supabase = createClient(VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const imagekit = new ImageKit({ privateKey: IMAGEKIT_PRIVATE_KEY });

async function uploadMedia(src, folder) {
  const fileName = path.basename(src).split('?')[0];
  const file = src.startsWith('http') ? await fetch(src) : fs.createReadStream(path.join(PUBLIC_DIR, src));
  const response = await imagekit.files.upload({ file, fileName, folder });
  return response.url;
}

async function seedProperties() {
  for (const p of properties) {
    console.log(`  Uploading media for: ${p.title}`);
    const images = [];
    for (const img of p.images) {
      images.push(await uploadMedia(img, '/synex-realty/properties'));
    }
    const videoUrl = p.videoUrl ? await uploadMedia(p.videoUrl, '/synex-realty/properties') : null;

    const row = {
      title: p.title,
      address: p.address,
      area: p.area,
      price: p.price,
      price_display: p.priceDisplay,
      price_per_sqft: p.pricePerSqft,
      type: p.type,
      category: p.category,
      bhk: p.bhk,
      sqft: p.sqft,
      sqft_display: p.sqftDisplay,
      floor: p.floor,
      total_floors: p.totalFloors,
      bathrooms: p.bathrooms,
      parking: p.parking,
      facing: p.facing,
      possession: p.possession,
      age_years: p.ageYears,
      status: p.status,
      purpose: p.purpose,
      featured: p.featured,
      is_new: p.isNew,
      is_price_drop: p.isPriceDrop,
      rera_approved: p.reraApproved,
      video_url: videoUrl,
      images,
      amenities: p.amenities,
      highlights: p.highlights,
      description: p.description,
    };

    const { error } = await supabase.from('properties').insert(row);
    if (error) throw new Error(`Failed inserting "${p.title}": ${error.message}`);
  }
}

async function seedTestimonials() {
  for (const t of testimonials) {
    console.log(`  Uploading avatar for: ${t.name}`);
    const avatar = await uploadMedia(t.avatar, '/synex-realty/testimonials');
    const { error } = await supabase.from('testimonials').insert({
      name: t.name,
      role: t.role,
      location: t.location,
      quote: t.quote,
      rating: t.rating,
      avatar,
    });
    if (error) throw new Error(`Failed inserting testimonial "${t.name}": ${error.message}`);
  }
}

async function main() {
  console.log('Seeding properties…');
  await seedProperties();
  console.log('Seeding testimonials…');
  await seedTestimonials();
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
