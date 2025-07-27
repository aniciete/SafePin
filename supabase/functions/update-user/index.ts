import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // 1. Create a standard client to verify the identity of the person making the request.
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_ANON_KEY') ?? '', {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    // 2. Get the user from the JWT and check if they are an admin. This is a critical security check.
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("Authentication failed: User not found.");
    }
    const { data: userProfile, error: profileError } = await supabaseClient.from('users').select('role').eq('id', user.id).single();
    if (profileError || userProfile?.role !== 'admin') {
      return new Response(JSON.stringify({
        error: 'Forbidden: Only admins can perform this action.'
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    // 3. If the caller is confirmed to be an admin, proceed with the update logic.
    const { userId, role, jurisdiction } = await req.json();
    if (!userId || !role) {
      throw new Error("User ID and role are required for the update.");
    }
    // 4. Create the privileged admin client to perform the updates, bypassing RLS.
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SERVICE_ROLE_KEY') ?? '' // Use the secure key
    );
    // 5. Update the user's metadata in the auth schema. This is important for JWT claims.
    const { error: updateUserError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      user_metadata: {
        role,
        jurisdiction: role === 'authority' ? jurisdiction : null
      }
    });
    if (updateUserError) throw updateUserError;
    // 6. Update the user's profile in the public.users table to keep them in sync.
    const { error: updateProfileError } = await supabaseAdmin.from('users').update({
      role,
      jurisdiction: role === 'authority' ? jurisdiction : null
    }).eq('id', userId);
    if (updateProfileError) throw updateProfileError;
    return new Response(JSON.stringify({
      message: 'User updated successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error in update-user function:', error);
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 400
    });
  }
});
