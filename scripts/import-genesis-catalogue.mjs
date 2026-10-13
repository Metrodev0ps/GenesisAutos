#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const SOURCE_FILE = path.resolve('scripts/genesis-catalogue-source.json');
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DRY_RUN = process.argv.includes('--dry-run');
if (!DRY_RUN && (!SUPABASE_URL || !SERVICE_ROLE_KEY)) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your local shell. Do not add the service-role key to Vite/client variables, .env.example, or Git.');
  process.exit(1);
}
const WEBSITE_SLUG = process.env.WEBSITE_SLUG || 'genesis-autos-1218d5';
const EXPECTED_SUPABASE_REF = process.env.EXPECTED_SUPABASE_REF || 'xfguwqqhfktnbfsipyor';
const EXPECTED_WEBSITE_ID = process.env.EXPECTED_WEBSITE_ID || '9c8efcb7-a75b-4d9c-a6b9-75640bad7549';

const businessContent = {
  title: 'Genesis Autos',
  description: 'Automobile spare parts and automotive products business in Iyana Ipaja, Lagos.',
  logo_url: 'https://genesisautos.org/Logo%20and%20icon.jpg',
  business_details: {
    telephone: '+2347065379450',
    secondary_telephone: '+2349083561212',
    address: '62 Alimosho Rd., Opp. Multigrace Sch. Alagutan B/Stop, Iyana Ipaja, Lagos, Nigeria',
    instagram: 'https://www.instagram.com/genesisautosalimosho/',
    tiktok: 'https://www.tiktok.com/@genesisautosalimosho',
    telegram: 'https://t.me/genesisautosalimosho'
  },
  content: { currency: 'NGN', catalogue_source: 'GenesisAutos/src/App.tsx' }
};

const sourceServices = [
  { external_key: 'spare-parts-sourcing', name: 'Spare Parts Sourcing', description: 'Get assistance finding the automotive parts you need.', display_order: 1 },
  { external_key: 'vehicle-support', name: 'Vehicle Support', description: 'Automotive support for vehicle owners and businesses.', display_order: 2 },
  { external_key: 'parts-enquiries', name: 'Parts Enquiries', description: 'Contact Genesis Autos to ask about availability and pricing.', display_order: 3 }
];
const raw = JSON.parse(fs.readFileSync(SOURCE_FILE, 'utf8'));
function parseLiteralArray(text) {
  // JSON5-lite converter for the existing source arrays.
  let out = '';
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (c === "'") {
      let value = '';
      i++;
      while (i < text.length) {
        const next = text[i++];
        if (next === "'") break;
        if (next === "\\") {
          const escaped = text[i++];
          if (escaped === "'" || escaped === '"' || escaped === "\\") value += escaped;
          else if (escaped === "n") value += "\n";
          else if (escaped === "r") value += "\r";
          else if (escaped === "t") value += "\t";
          else value += "\\" + escaped;
        } else value += next;
      }
      out += JSON.stringify(value);
      continue;
    }
    if (c === '"') {
      const start = i++;
      while (i < text.length) {
        if (text[i] === "\\") { i += 2; continue; }
        if (text[i++] === '"') break;
      }
      out += text.slice(start, i);
      continue;
    }
    if (/[A-Za-z_$]/.test(c)) {
      const start = i++;
      while (i < text.length && /[\w$]/.test(text[i])) i++;
      const word = text.slice(start, i);
      let lookahead = i;
      while (/\s/.test(text[lookahead] || "")) lookahead++;
      if (lookahead < text.length && text[lookahead] === ":") out += JSON.stringify(word);
      else if (word === "undefined") out += "null";
      else if (word === "true" || word === "false" || word === "null") out += word;
      else out += JSON.stringify(word);
      continue;
    }
    out += c;
    i++;
  }
  return JSON.parse(out.replace(/,\s*([}\]])/g, "$1"));
}
function slugify(value) { return String(value ?? '').toLowerCase().trim().replace(/['"\[\]]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item'; }
const source = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, parseLiteralArray(value)]));
const rows = [];
const slugCounts = new Map();
function add({key,name,category,description,price,image,brand,details}) {
  const base = slugify(key); const count = slugCounts.get(base) || 0; slugCounts.set(base, count+1);
  rows.push({
    external_key: String(key),
    name: String(name),
    slug: count ? `${base}-${count+1}` : base,
    category,
    description: typeof description === 'string' ? description : '',
    price: typeof price === 'number' && Number.isFinite(price) ? price : null,
    image_path: image || null,
    brand: brand || null,
    details: details || null,
    display_order: rows.length + 1
  });
}
for (const p of source.batteryProducts) add({key:`battery:${p.brand}:${p.capacity}:${p.terminal || 'standard'}`,name:`${p.name} ${p.capacity} Battery`,category:'Car Batteries',description:`Shop ${p.brand} ${p.capacity} car batteries from Genesis Autos in Iyana Ipaja, Lagos. ${p.voltage} automotive battery${p.terminal ? ` with ${p.terminal.toLowerCase()}` : ''}.`,price:p.price,image:p.image,brand:p.brand,details:[p.voltage,p.capacity,p.terminal].filter(Boolean).join(' · ')});
for (const p of source.accessoryProducts) add({key:`accessory:${p.name}`,name:p.name,category:'Car Accessories',description:`${p.name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and pricing.`,price:p.price,image:p.image});
for (const [name,image,price] of [['Normal Steering Cover','/DESIGN 1 STEERING.jpg'],['Condom Steering Cover','/DESIGN 2 STEERING.jpg'],['Seat Covers — OC CLASSIC','/DESIGN 1 SEATCOVER.jpg'],['Seat Covers — R-POWER','/DESIGN 2 SEAT COVER.jpg'],['Seat Covers — CROWN','/DESIGN 3 SEAT COVER.jpg'],['Seat Covers — SMILEY','/DESIGN SEAT COVER 4.jpg'],['Seat Covers — Design 5','/DESIGN 5SEAT CIVER.jpg'],['Seat Covers — VIP Luxury 1','/VIP LUXURY SEAT COVERS.jpg',150000],['Seat Covers — VIP Luxury 2','/VIP LUXURY SEAT COVERS2.jpg',150000],['Seat Covers — VIP Luxury 3','/VIP LUXURY SEAT COVERS3.jpg',150000],['Seat Covers — VIP Luxury 4','/VIP LUXURY SEAT COVERS4.jpg',150000],['Seat Covers — VIP Luxury 5','/VIP LUXURY SEAT COVERS5.jpg',150000],['Steering Cover Collection','/STEERING COVERS.jpg']]) add({key:`accessory-extra:${name}`,name,category:'Car Accessories',description:`${name} available from Genesis Autos in Iyana Ipaja, Lagos. Ask about current availability and price.`,image,price});
for (const rim of source.alloyRimProducts) for (const opt of rim.options) add({key:`rim:${rim.size}:${opt.name}`,name:`Alloy Rim ${rim.size} — ${opt.name}`,category:'Alloy Rims',description:`${opt.name} ${rim.size} alloy rims available from Genesis Autos in Iyana Ipaja, Lagos. Contact us to confirm availability.`,price:opt.price,image:'/RIMS.jpg',details:`${rim.size} · ${opt.name}`});
for (const p of source.toolsProducts) add({key:`tool:${p.name}`,name:p.name,category:'Automotive Tools & Essentials',description:`${p.name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,price:p.price,image:p.image});
for (const group of source.brakeFluidProducts) for (const b of group.brands) add({key:`brake-fluid:${b.name}`,name:`Brake Fluid — ${b.name}`,category:'Automotive Tools & Essentials',description:`${b.name} brake fluid available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current price.`,price:b.price,image:b.image,brand:b.name});
for (const group of source.matProducts) for (const opt of group.options) add({key:`mat:${group.name}:${opt.name}`,name:`${group.name} — ${opt.name}`,category:'Car Accessories',description:`${group.name} for ${opt.name} available from Genesis Autos in Iyana Ipaja, Lagos.`,price:opt.price,image:opt.image || group.image,brand:opt.name,details:opt.name});
for (const p of source.securityProducts) add({key:`security:${p.name}`,name:p.name,category:'Vehicle Security',description:`${p.name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,price:p.price,image:p.image});
for (const group of source.engineOilGrades) for (const [brand,sizes] of Object.entries(group.brands)) for (const item of sizes) add({key:`engine-oil:${brand}:${group.grade}:${item.size}`,name:`${brand} ${group.grade} Engine Oil — ${item.size}`,category:'Engine Oil',description:`${brand} ${group.grade} engine oil in ${item.size}, available from Genesis Autos in Iyana Ipaja, Lagos. Contact us to confirm current stock.`,price:item.price,brand,details:`${group.grade} · ${item.size}`});
for (const name of ['TOYOTA ATF 1L','TOYOTA ATF 4L','SEAMAX ATF 1L','SEAMAX ATF 4L','ABRO MASTERS 1L','HARDEX T4 1L','HARDEX T4 4L','HOLTS ATF']) { const image=name.includes('TOYOTA')?'/TOYOTA ATF.jpg':name.includes('SEAMAX')?'/SEAMAX ATF.jpg':name.includes('HARDEX')?'/HARDEX ATF.jpg':'/ATF.jpg'; const prices={'TOYOTA ATF 1L':6500,'TOYOTA ATF 4L':25000,'SEAMAX ATF 1L':4500,'SEAMAX ATF 4L':17000,'ABRO MASTERS 1L':4500,'HARDEX T4 1L':10000,'HARDEX T4 4L':42000,'HOLTS ATF':5000}; add({key:`atf:${name}`,name,category:'ATF',description:`${name} automatic transmission fluid available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,price:prices[name],image}); }
for (const item of source.coolantOptions) add({key:`coolant:${item.size}`,name:`Coolant — ${item.size}`,category:'Coolant',description:`Automotive coolant in ${item.size} available from Genesis Autos in Iyana Ipaja, Lagos.`,price:item.price,details:item.size});
for (const name of source.lubricantGroups.other) add({key:`fluid:${name}`,name,category:'Automotive Fluids',description:`${name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us for current availability and price.`,image:name==='INJECTOR CLEANER'?'/FUEL INJECTOR CLEANER.jpg':'/OIL TREATMENT.jpg',price:name==='INJECTOR CLEANER' || name==='OIL TREATMENT' ? 3500 : undefined});
const externalKeys = new Set(rows.map((row) => row.external_key));
if (externalKeys.size !== rows.length) throw new Error('Duplicate external keys found in the source catalogue.');
const imageExists = (image) => {
  if (!image) return false;
  if (/^https?:\/\//i.test(image)) return true;
  return fs.existsSync(path.resolve('public', image.replace(/^\/+/, '')));
};
const byCategory = Object.fromEntries([...new Set(rows.map((row) => row.category))].map((category) => [category, rows.filter((row) => row.category === category).length]));
const missingImageReferences = rows.filter((row) => !row.image_path).map((row) => ({ name: row.name }));
const missingImageFiles = rows.filter((row) => row.image_path && !imageExists(row.image_path)).map((row) => ({ name: row.name, image_path: row.image_path }));
const report = {
  dryRun: DRY_RUN,
  website: WEBSITE_SLUG,
  expectedSupabaseRef: EXPECTED_SUPABASE_REF,
  expectedWebsiteId: EXPECTED_WEBSITE_ID,
  sourceRecords: rows.length,
  pricedRecords: rows.filter((row) => typeof row.price === 'number').length,
  recordsMissingPrice: rows.filter((row) => row.price === null).length,
  recordsWithImageReference: rows.filter((row) => Boolean(row.image_path)).length,
  recordsMissingImageReference: rows.filter((row) => !row.image_path).length,
  imageFilesMissingFromPublic: missingImageFiles.length,
  missingImageFileExamples: missingImageFiles.slice(0, 20),
  missingImageReferenceExamples: missingImageReferences.slice(0, 20),
  recordsMissingDescription: rows.filter((row) => !row.description).length,
  uniqueExternalKeys: externalKeys.size,
  categories: byCategory,
  businessContentIncluded: true,
  servicesIncluded: sourceServices.length,
  publishedByDefault: 0
};
if (DRY_RUN) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(0);
}
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.');
}
const actualRef = new URL(SUPABASE_URL).hostname.split('.')[0];
if (actualRef !== EXPECTED_SUPABASE_REF) {
  throw new Error(`Refusing import: Supabase ref "${actualRef}" does not match expected "${EXPECTED_SUPABASE_REF}".`);
}
const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {auth:{persistSession:false}});
const {data:website,error:websiteError} = await client.from('websites').select('id,client_id,slug,status').eq('slug',WEBSITE_SLUG).single();
if (websiteError || !website) throw websiteError || new Error(`Website "${WEBSITE_SLUG}" not found.`);
if (website.id !== EXPECTED_WEBSITE_ID) {
  throw new Error(`Refusing import: website ID "${website.id}" does not match expected ID "${EXPECTED_WEBSITE_ID}".`);
}
const products = rows.map((row) => ({...row,website_id:website.id,currency:'NGN',is_published:false,source:'genesis-app-tsx-import-v1'}));
for (let i=0; i<products.length; i+=100) {
  const {error} = await client.from('products').upsert(products.slice(i,i+100), {onConflict:'website_id,external_key',ignoreDuplicates:true});
  if (error) throw new Error(`Product import failed at batch ${i}: ${error.message}`);
}

// Insert website content only if it does not exist; preserve any Hub-edited content.
const {error:contentError} = await client.from('website_content').upsert(
  {...businessContent,website_id:website.id},
  {onConflict:'website_id',ignoreDuplicates:true}
);
if (contentError) throw new Error(`Business content import failed: ${contentError.message}`);

// These three services are defined in the existing storefront's services array.
const services = sourceServices.map((service) => ({...service,website_id:website.id,is_published:false}));
const {error:servicesError} = await client.from('services').upsert(services,{onConflict:'website_id,external_key',ignoreDuplicates:true});
if (servicesError) throw new Error(`Service import failed: ${servicesError.message}`);

const keys = rows.map((row) => row.external_key);
const {data:verifiedProducts,error:verifyError} = await client.from('products').select('external_key').eq('website_id',website.id).in('external_key',keys);
if (verifyError) throw new Error(`Post-import verification failed: ${verifyError.message}`);
const existingKeys = new Set((verifiedProducts ?? []).map((row) => row.external_key));
const missingKeys = keys.filter((key) => !existingKeys.has(key));
if (missingKeys.length) throw new Error(`Import verification missing ${missingKeys.length} products: ${missingKeys.slice(0,20).join(', ')}`);
console.log(JSON.stringify({...report,dryRun:false,websiteId:website.id,clientId:website.client_id,websiteStatus:website.status,productsVerified:existingKeys.size,manualRecordsOverwritten:false,published:0},null,2));
