import { Loader } from '@googlemaps/js-api-loader';

const mapLoader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'quarterly',
  // This is the correct, complete list of libraries we need.
  libraries: ['marker', 'places', 'geocoding'],
});

export default mapLoader;