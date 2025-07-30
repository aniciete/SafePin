import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error("Authentication failed: Missing Authorization header.");
    }

    // --- THIS IS THE FIX: Create a client that can bypass RLS ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false, autoRefreshToken: false },
        global: { headers: { 'bypass-rls': 'true' } }
      }
    );

    // 1. Verify the identity of the person making the request.
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseAdmin.auth.getUser(jwt);
    if (!user) {
      throw new Error("Authentication failed: User not found.");
    }

    // 2. Check if the calling user is an admin. This requires bypassing RLS.
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || userProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Forbidden: Only admins can perform this action.' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 3. If the caller is an admin, proceed with the update logic.
    const { userId, role, jurisdiction } = await req.json();
    if (!userId || !role) {
      throw new Error("User ID and role are required for the update.");
    }

    // 4. Update the user's metadata in the auth schema.
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        role,
        jurisdiction: role === 'authority' ? jurisdiction : null
      }
    });
    if (updateUserError) throw updateUserError;

    // 5. Update the user's profile in the public.users table. This also requires bypassing RLS.
    const { error: updateProfileError } = await supabaseAdmin
      .from('users')
      .update({
        role,
        jurisdiction: role === 'authority' ? jurisdiction : null
      })
      .eq('id', userId);
    if (updateProfileError) throw updateProfileError;

    return new Response(JSON.stringify({ message: 'User updated successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in update-user function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});