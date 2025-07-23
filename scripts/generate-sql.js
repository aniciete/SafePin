// scripts/generate-sql.js
import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const dataDir = path.join(process.cwd(), 'scripts', 'data');
const jurisdictionsFile = path.join(process.cwd(), 'scripts', 'jurisdictions.json');
const outputFile = path.join(process.cwd(), 'scripts', 'upload.sql');
// --- END CONFIGURATION ---

async function generateSqlFile() {
  console.log('🔵 Starting SQL file generation...');

  try {
    const jurisdictions = JSON.parse(await fs.readFile(jurisdictionsFile, 'utf-8'));
    const cityLookup = new Map(jurisdictions.map(j => [j.psgc_code, j.city]));
    console.log(`✅ Loaded ${cityLookup.size} jurisdictions for city name lookup.`);

    const files = await fs.readdir(dataDir);
    const geojsonFiles = files.filter(f => f.endsWith('.json'));
    console.log(`ℹ️ Found ${geojsonFiles.length} GeoJSON files to process.`);
    
    let allSqlStatements = [];

    for (const file of geojsonFiles) {
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

        if (!psgc_code || !barangayName || !geometry || !geometry.type.includes('Polygon')) {
          continue;
        }
        
        const cityName = cityLookup.get(psgc_code);
        if (!cityName) {
          console.warn(`❗️ Missing city for PSGC: ${psgc_code} (Barangay: ${barangayName})`);
          continue;
        }

        // Escape single quotes in names to prevent SQL errors
        const safeBarangayName = barangayName.replace(/'/g, "''");
        const safeCityName = cityName.replace(/'/g, "''");
        const geometryString = JSON.stringify(geometry).replace(/'/g, "''");

        const sql = `
          INSERT INTO public.jurisdiction_boundaries (psgc_code, barangay_name, city_name, geom)
          VALUES ('${psgc_code}', '${safeBarangayName}', '${safeCityName}', ST_Multi(ST_GeomFromGeoJSON('${geometryString}')))
          ON CONFLICT (psgc_code) DO NOTHING;
        `;
        allSqlStatements.push(sql);
      }
    }

    await fs.writeFile(outputFile, allSqlStatements.join('\\n'));
    console.log('---');
    console.log(`✅ Success! Generated upload.sql with ${allSqlStatements.length} INSERT statements.`);
    console.log(`📄 File is located at: ${outputFile}`);

  } catch (err) {
    console.error("❌ A fatal error occurred:", err);
  }
}

generateSqlFile();