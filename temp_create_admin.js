import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.staging' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  try {
    const { data, error } = await supabase.functions.invoke('create-user', {
      body: {
        email: 'admin@safepin.com',
        password: 'password123',
        role: 'admin',
        jurisdiction: null,
      },
    });

    if (error) {
      throw error;
    }

    console.log('Admin user created successfully:', data);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

createAdmin();