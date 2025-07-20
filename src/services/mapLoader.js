import { Loader } from '@googlemaps/js-api-loader';

const mapLoader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
});

export default mapLoader;