import jurisdictions from './jurisdictions.json';

// Memoize the formatted list for performance
let formattedJurisdictions = null;

// Formats the raw JSON into the { value, label } structure needed by the Combobox
export const getFormattedJurisdictions = () => {
  if (formattedJurisdictions) {
    return formattedJurisdictions;
  }
  formattedJurisdictions = jurisdictions.map(j => ({
    value: j.psgc_code,
    label: `${j.barangay}, ${j.city}`,
  }));
  return formattedJurisdictions;
};

// A simple map for quick lookups
const jurisdictionMap = new Map(
  jurisdictions.map(j => [j.psgc_code, `${j.barangay}, ${j.city}`])
);

// Translates a single PSGC code to its human-readable name
export const getJurisdictionNameByCode = (code) => {
  if (!code) return 'N/A';
  return jurisdictionMap.get(code) || code; // Return the code itself if not found
};