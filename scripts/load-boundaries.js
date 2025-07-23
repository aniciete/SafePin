// scripts/load-boundaries.js
import fs from 'fs/promises';
import path from 'path';
import pg from 'pg';

// --- CONFIGURATION ---
const config = {
  user: 'postgres',
  host: 'db.tsyowtatzuxbvquhkgyo.supabase.co',
  database: 'postgres',
  password: 'vMI0Gt15BlQEZHmg', // PASTE YOUR NEW PASSWORD HERE
  port: 5432,
  family: 'ipv4',
};

const dataDir = path.join(process.cwd(), 'scripts', 'data');
const jurisdictionsFile = path.join(process.cwd(), 'scripts', 'jurisdictions.json');
// --- END CONFIGURATION ---

const { Client } = pg;

async function processData() {
  const client = new Client(config);
  
  try {
    await client.connect();
    console.log('✅ Connected to Supabase database.');

    const jurisdictions = JSON.parse(await fs.readFile(jurisdictionsFile, 'utf-8'));
    const cityLookup = new Map(jurisdictions.map(j => [j.psgc_code, j.city]));
    console.log(`✅ Loaded ${cityLookup.size} jurisdictions for city name lookup.`);

    const files = await fs.readdir(dataDir);
    const geojsonFiles = files.filter(f => f.endsWith('.json'));
    console.log(`ℹ️ Found ${geojsonFiles.length} GeoJSON files to process.`);
    
    let insertedCount = 0;
    let missingCityCount = 0;

    for (const file of geojsonFiles) {
      try {
        const content = await fs.readFile(path.join(dataDir, file), 'utf-8');
        const data = JSON.parse(content);

        if (!Array.isArray(data.features)) {
          console.warn(`⚠️ Skipping file ${file} - no valid 'features' array.`);
          continue;
        }

        for (const feature of data.features) {
          const props = feature.properties;
          const geometry = feature.geometry;
          const psgc_code = props.adm4_psgc?.toString();
          const barangayName = props.adm4_en;

          if (!psgc_code || !barangayName || !geometry) {
            continue;
          }
          
          const cityName = cityLookup.get(psgc_code);

          if (!cityName) {
            if (missingCityCount === 0) console.log('---');
            console.warn(`❗️ Missing city for PSGC: ${psgc_code} (Barangay: ${barangayName})`);
            missingCityCount++;
            continue;
          }

          const query = {
            text: `
              INSERT INTO public.jurisdiction_boundaries (psgc_code, barangay_name, city_name, geom)
              VALUES ($1, $2, $3, ST_Multi(ST_GeomFromGeoJSON($4)))
              ON CONFLICT (psgc_code) DO NOTHING;
            `,
            values: [psgc_code, barangayName, cityName, JSON.stringify(geometry)],
          };
          const res = await client.query(query);
          if (res.rowCount > 0) insertedCount++;
        }
      } catch (e) {
        console.error(`❌ Error processing file ${file}:`, e.message);
      }
    }
    console.log('---');
    console.log('✅ Data loading complete!');
    console.log(`New barangays inserted: ${insertedCount}`);
    console.log(`Barangays skipped (missing city in jurisdictions.json): ${missingCityCount}`);

  } catch (err) {
      console.error("A fatal error occurred:", err);
  } finally {
    await client.end();
    console.log('✅ Database connection closed.');
  }
}

processData();