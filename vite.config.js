/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on the mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/setup.js',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // This 'define' block is the fix.
    // It securely exposes your VITE_ prefixed variables to the front-end code,
    // but it will NOT expose the SUPABASE_SERVICE_ROLE_KEY, keeping it secure.
    // However, for the getSupabaseAdmin function to work locally, we need a different approach.
    // The supabaseAdmin client should ONLY be used in server-side contexts like Edge Functions.
    // To make it work in a client-side component (like your admin panel), we must
    // temporarily and carefully expose the necessary keys during local development.
    define: {
      // This makes process.env available in your client-side code,
      // similar to how Create React App works.
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      // WARNING: This is for LOCAL DEVELOPMENT ONLY.
      // It exposes the service role key to your browser while running `npm run dev`.
      // This is acceptable for a trusted local environment but would be a major
      // security risk in production if you were not using Edge Functions.
      'process.env.VITE_SUPABASE_SERVICE_ROLE_KEY': JSON.stringify(env.SUPABASE_SERVICE_ROLE_KEY),
    },
  };
});