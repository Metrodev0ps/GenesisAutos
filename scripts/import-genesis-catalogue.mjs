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
const WEBSITE_SLUG = 'genesis-autos-1218d5';
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
  rows.push({external_key:String(key),name:String(name),slug:count ? `${base}-${count+1}` : base,category,description:description || `${name} available from Genesis Autos in Iyana Ipaja, Lagos. Contact us to confirm current availability and pricing.`,price:typeof price === 'number' ? price : null,image_path:image || null,brand:brand || null,details:details || null,display_order:rows.length+1});
}
for (const p of source.batteryProducts) add({key:`battery:${p.brand}:${p.capacity}:${p.terminal || 'standard'}`,name:`${p.name} ${p.capacity} Battery`,category:'Car Batteries',description:`Shop ${p.brand} ${p.capacity} car batteries from Genesis Autos in Iyana Ipaja, Lagos. ${p.voltage} automotive battery${p.terminal ? ` with ${p.terminal.toLowerCase()}` : ''}.`,price:p.price,image:p.image,brand:p.brand,details:[p.voltage,p.capacity,p.terminal].filter(Boolean).join(' · ')});
for (const p of source.accessoryProducts) add({key:`accessory:${p.name}`,name:p.name,category:'Car Accessories',price:p.price,image:p.image});
for (const [name,image,price] of [['Normal Steering Cover','/DESIGN 1 STEERING.jpg'],['Condom Steering Cover','/DESIGN 2 STEERING.jpg'],['Seat Covers — OC CLASSIC','/DESIGN 1 SEATCOVER.jpg'],['Seat Covers — R-POWER','/DESIGN 2 SEAT COVER.jpg'],['Seat Covers — CROWN','/DESIGN 3 SEAT COVER.jpg'],['Seat Covers — SMILEY','/DESIGN SEAT COVER 4.jpg'],['Seat Covers — Design 5','/DESIGN 5SEAT CIVER.jpg'],['Seat Covers — VIP Luxury 1','/VIP LUXURY SEAT COVERS.jpg',150000],['Seat Covers — VIP Luxury 2','/VIP LUXURY SEAT COVERS2.jpg',150000],['Seat Covers — VIP Luxury 3','/VIP LUXURY SEAT COVERS3.jpg',150000],['Seat Covers — VIP Luxury 4','/VIP LUXURY SEAT COVERS4.jpg',150000],['Seat Covers — VIP Luxury 5','/VIP LUXURY SEAT COVERS5.jpg',150000],['Steering Cover Collection','/STEERING COVERS.jpg']]) add({key:`accessory-extra:${name}`,name,category:'Car Accessories',image,price});
for (const rim of source.alloyRimProducts) for (const opt of rim.options) add({key:`rim:${rim.size}:${opt.name}`,name:`Alloy Rim ${rim.size} — ${opt.name}`,category:'Alloy Rims',price:opt.price,image:'/RIMS.jpg',details:`${rim.size} · ${opt.name}`});
for (const p of source.toolsProducts) add({key:`tool:${p.name}`,name:p.name,category:'Automotive Tools & Essentials',price:p.price,image:p.image});
for (const group of source.brakeFluidProducts) for (const b of group.brands) add({key:`brake-fluid:${b.name}`,name:`Brake Fluid — ${b.name}`,category:'Automotive Tools & Essentials',price:b.price,image:b.image,brand:b.name});
for (const group of source.matProducts) for (const opt of group.options) add({key:`mat:${group.name}:${opt.name}`,name:`${group.name} — ${opt.name}`,category:'Car Accessories',price:opt.price,image:opt.image || group.image,brand:opt.name,details:opt.name});
for (const p of source.securityProducts) add({key:`security:${p.name}`,name:p.name,category:'Vehicle Security',price:p.price,image:p.image});
for (const group of source.engineOilGrades) for (const [brand,sizes] of Object.entries(group.brands)) for (const item of sizes) add({key:`engine-oil:${brand}:${group.grade}:${item.size}`,name:`${brand} ${group.grade} Engine Oil — ${item.size}`,category:'Engine Oil',price:item.price,brand,details:`${group.grade} · ${item.size}`});
for (const name of ['TOYOTA ATF 1L','TOYOTA ATF 4L','SEAMAX ATF 1L','SEAMAX ATF 4L','ABRO MASTERS 1L','HARDEX T4 1L','HARDEX T4 4L','HOLTS ATF']) { const image=name.includes('TOYOTA')?'/TOYOTA ATF.jpg':name.includes('SEAMAX')?'/SEAMAX ATF.jpg':name.includes('HARDEX')?'/HARDEX ATF.jpg':'/ATF.jpg'; const prices={'TOYOTA ATF 1L':7000,'TOYOTA ATF 4L':25000,'SEAMAX ATF 1L':4500,'SEAMAX ATF 4L':17000,'ABRO MASTERS 1L':4500,'HARDEX T4 1L':10000,'HARDEX T4 4L':42000,'HOLTS ATF':5000}; add({key:`atf:${name}`,name,category:'ATF',price:prices[name],image}); }
for (const item of source.coolantOptions) add({key:`coolant:${item.size}`,name:`Coolant — ${item.size}`,category:'Coolant',price:item.price,details:item.size});
for (const name of source.lubricantGroups.other) add({key:`fluid:${name}`,name,category:'Automotive Fluids',price:3500,image:name==='INJECTOR CLEANER'?'/FUEL INJECTOR CLEANER.jpg':'/OIL TREATMENT.jpg'});
const externalKeys = new Set(rows.map((row) => row.external_key));
if (externalKeys.size !== rows.length) throw new Error('Duplicate external keys found in the source catalogue.');
if (DRY_RUN) {
  const byCategory = Object.fromEntries([...new Set(rows.map((row) => row.category))].map((category) => [category, rows.filter((row) => row.category === category).length]));
  console.log(JSON.stringify({ dryRun: true, website: WEBSITE_SLUG, sourceRecords: rows.length, pricedRecords: rows.filter((row) => typeof row.price === 'number').length, recordsWithImages: rows.filter((row) => row.image_path).length, uniqueExternalKeys: externalKeys.size, categories: byCategory, publishedByDefault: 0 }, null, 2));
  process.exit(0);
}
const client = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {auth:{persistSession:false}});
const {data:website,error:websiteError} = await client.from('websites').select('id,slug,status').eq('slug',WEBSITE_SLUG).single();
if (websiteError || !website) throw websiteError || new Error('Genesis website record not found.');
const products = rows.map((row) => ({...row,website_id:website.id,currency:'NGN',is_published:false,source:'genesis-app-tsx-import-v1'}));
for (let i=0; i<products.length; i+=100) { const {error} = await client.from('products').upsert(products.slice(i,i+100), {onConflict:'website_id,external_key'}); if (error) throw new Error(`Upsert at row ${i} failed: ${error.message}`); }
console.log(JSON.stringify({website:WEBSITE_SLUG,status:website.status,input:products.length,upserted:products.length,published:0},null,2));
