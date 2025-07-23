// scripts/process-raw-data.js (Definitive Version)
import fs from 'fs/promises';
import path from 'path';

// --- CONFIGURATION ---
const rawDataDir = path.join(process.cwd(), 'scripts', 'data-raw');
const jurisdictionsFile = path.join(process.cwd(), 'scripts', 'jurisdictions.json');
const outputDir = path.join(process.cwd(), 'scripts', 'data');
const mismatchReportFile = path.join(process.cwd(), 'scripts', '_mismatch_report.csv');
// --- END CONFIGURATION ---

async function findFiles(dirPath, extension) {
  let files = [];
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(await findFiles(fullPath, extension));
    } else if (entry.name.endsWith(extension)) {
      files.push(fullPath);
    }
  }
  return files;
}

function normalizeName(name) {
  if (!name) return '';
  return name.toLowerCase().split(',')[0].replace(/\bbrgy\.?\b/g, 'barangay').replace(/\bsto\.?\b/g, 'santo').replace(/\bsta\.?\b/g, 'santa').replace(/ñ/g, 'n').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, ' ').trim();
}

function createNameLookupMap(jurisdictions) {
  const lookupMap = new Map();
  for (const j of jurisdictions) {
    const cleanBarangay = normalizeName(j.barangay);
    const cleanCity = normalizeName(j.city);
    const key = `${cleanBarangay}-${cleanCity}`;
    lookupMap.set(key, j);
  }
  return lookupMap;
}

/**
 * Creates a simple list of unique city names from the jurisdictions file.
 * @param {Array<object>} jurisdictions
 * @returns {string[]}
 */
function getCityList(jurisdictions) {
    const citySet = new Set(jurisdictions.map(j => j.city.toLowerCase()));
    return Array.from(citySet);
}

/**
 * DEFINITIVE VERSION: Reliably extracts the city name from the complex 2019 format.
 * It checks against a list of all known cities for a confident match.
 * @param {object} props - The properties object from a 2019 GeoJSON feature.
 * @param {string[]} cityList - A list of all possible city names.
 * @returns {string|null} The extracted city name or null if not found.
 */
function getCityNameFrom2019Props(props, cityList, jurisdictions) {
    const adm2 = (props.ADM2_EN || '').toLowerCase();
    const adm3 = (props.ADM3_EN || '').toLowerCase();

    // The most reliable method: Iterate through known cities and see if they exist in the ADM2 string.
    for (const city of cityList) {
        if (adm2.includes(city.toLowerCase())) {
            // Find the original casing from the city list for consistency
            const originalCasingCity = jurisdictions.find(j => j.city.toLowerCase() === city).city;
            return originalCasingCity;
        }
    }
    
    // Fallback for cases where the city might only be in ADM3
    if (cityList.includes(adm3)) {
        const originalCasingCity = jurisdictions.find(j => j.city.toLowerCase() === adm3).city;
        return originalCasingCity;
    }

    return null; // Return null if no known city is found.
}

async function processRawData() {
  console.log('🔵 Starting raw GeoJSON processing...');
  
  try {
    const jurisdictions = JSON.parse(await fs.readFile(jurisdictionsFile, 'utf-8'));
    const jurisdictionLookupByPsgc = new Map(jurisdictions.map(j => [j.psgc_code, j]));
    const jurisdictionLookupByName = createNameLookupMap(jurisdictions);
    const cityList = getCityList(jurisdictions); // Create the list of cities
    console.log(`✅ Loaded ${jurisdictions.length} entries and ${cityList.length} unique cities from master list.`);

    const allJsonFiles = await findFiles(rawDataDir, '.json');
    console.log(`ℹ️ Found ${allJsonFiles.length} raw GeoJSON files to process.`);
    
    const cityData = {};
    const unmatchedRecords = [];

    for (const filePath of allJsonFiles) {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const geoJson = JSON.parse(fileContent);

      if (!geoJson.features || !geoJson.features.length) continue;
      
      const sampleProps = geoJson.features[0].properties;
      let formatType;
      if (sampleProps.adm4_psgc) formatType = '2023';
      else if (sampleProps.ADM4_EN) formatType = '2019';
      else continue;
      
      console.log(`\nProcessing ${path.basename(filePath)} (Format: ${formatType})...`);

      for (const feature of geoJson.features) {
        let jurisdiction = null;
        let rawPsgc = 'N/A', rawBarangay = 'N/A', rawCity = 'N/A';

        if (formatType === '2023') {
          const psgc = feature.properties.adm4_psgc?.toString();
          rawPsgc = psgc;
          rawBarangay = feature.properties.adm4_en;
          if (psgc) {
             jurisdiction = jurisdictionLookupByPsgc.get(psgc);
             rawCity = jurisdiction ? jurisdiction.city : '[City not found in master list]';
          }
        } else { // 2019 format
          const props = feature.properties;
          rawPsgc = props.ADM4_PCODE;
          rawBarangay = props.ADM4_EN;
          rawCity = getCityNameFrom2019Props(props, cityList, jurisdictions); // Use the new robust function
           
          if (rawBarangay && rawCity) {
            const lookupKey = `${normalizeName(rawBarangay)}-${normalizeName(rawCity)}`;
            jurisdiction = jurisdictionLookupByName.get(lookupKey);
          }
        }

        if (jurisdiction) {
          const newProperties = { adm4_psgc: jurisdiction.psgc_code, adm4_en: jurisdiction.barangay };
          const fixedFeature = { ...feature, properties: newProperties };
          const cityNameKey = jurisdiction.city.toUpperCase().replace(/\s/g, '_');
          if (!cityData[cityNameKey]) cityData[cityNameKey] = { type: 'FeatureCollection', features: [] };
          cityData[cityNameKey].features.push(fixedFeature);
        } else {
          unmatchedRecords.push({ psgc: rawPsgc || '', barangay: rawBarangay || '', city: rawCity || 'Unknown' });
        }
      }
    }
    
    console.log('\n🔵 Writing cleaned files to scripts/data/ directory...');
    await fs.mkdir(outputDir, { recursive: true });

    let totalFeaturesWritten = 0;
    for (const cityNameKey in cityData) {
      const outputFilePath = path.join(outputDir, `${cityNameKey}_FIXED.json`);
      const featuresCount = cityData[cityNameKey].features.length;
      totalFeaturesWritten += featuresCount;
      await fs.writeFile(outputFilePath, JSON.stringify(cityData[cityNameKey], null, 2));
      console.log(`  ✅ Wrote ${featuresCount} features to ${outputFilePath}`);
    }

    console.log('\n✨ Processing complete!');
    console.log(`   - Total features matched and written: ${totalFeaturesWritten}`);
    console.log(`   - Total unique unmatched records: ${unmatchedRecords.length}`);
    
    if (unmatchedRecords.length > 0) {
        console.log('\n🔵 Writing mismatch report...');
        const csvHeader = 'psgc,barangay,city\n';
        const csvRows = unmatchedRecords.map(r => 
            `"${(r.psgc || '').replace(/"/g, '""')}",` +
            `"${(r.barangay || '').replace(/"/g, '""')}",` +
            `"${(r.city || '').replace(/"/g, '""')}"`
        ).join('\n');
        
        await fs.writeFile(mismatchReportFile, csvHeader + csvRows);
        console.log(`📄 Success! Mismatch report created at: ${mismatchReportFile}`);
    }

  } catch (err) {
    console.error('❌ A fatal error occurred:', err);
  }
}

processRawData();