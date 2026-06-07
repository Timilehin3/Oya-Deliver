import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envFile = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line && !line.startsWith('#'))
    .map(line => line.split('='))
);

const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_ANON_KEY
);

const productsData = JSON.parse(fs.readFileSync('./src/data/products.json', 'utf8'));

async function seed() {
  console.log("Seeding products...");
  for (const p of productsData) {
    const { data, error } = await supabase.from('products').insert([{
      name: p.name,
      price: p.price,
      category: p.category,
      unit: p.unit,
      image: p.image,
      description: p.description,
      featured: p.featured,
      stock_quantity: 50, // default dummy stock
      reorder_threshold: 10,
      vendor: "Oya Deliver Primary"
    }]);
    if (error) {
      console.error("Error inserting:", p.name, error.message);
    } else {
      console.log("Inserted:", p.name);
    }
  }
  console.log("Done seeding.");
}

seed();
