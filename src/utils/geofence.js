// Import the GeoJSON data directly.
// This assumes your file is named 'metroManilaBoundary.json' and is in the same directory.
import metroManilaBoundary from './metroManilaBoundary.json';

// This is a standard and highly efficient point-in-polygon algorithm.
// It uses a ray-casting method to determine if a point is inside a polygon.
const isPointInPolygon = (point, polygon) => {
  const [x, y] = point;
  let isInside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];

    const intersect = ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) {
      isInside = !isInside;
    }
  }

  return isInside;
};

// This function checks a location against the Metro Manila GeoJSON boundary.
export const isWithinMetroManila = (location) => {
  if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
    return false;
  }

  const point = [location.lng, location.lat]; // GeoJSON uses [longitude, latitude]

  // The GeoJSON 'FeatureCollection' can contain multiple features (districts).
  // We need to check the point against each polygon in the geometry.
  for (const feature of metroManilaBoundary.features) {
    const { type, coordinates } = feature.geometry;

    if (type === 'Polygon') {
      // For a simple Polygon, the coordinates array has one outer boundary.
      if (isPointInPolygon(point, coordinates[0])) {
        return true;
      }
    } else if (type === 'MultiPolygon') {
      // For a MultiPolygon, we check each individual polygon.
      for (const polygon of coordinates) {
        if (isPointInPolygon(point, polygon[0])) {
          return true;
        }
      }
    }
  }

  // If the point is not in any of the polygons, it's outside.
  return false;
};