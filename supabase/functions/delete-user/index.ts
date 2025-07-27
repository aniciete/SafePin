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
    // 2. Get the user from the JWT and check if they are an admin.
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
    // 3. If the caller is an admin, proceed with the deletion.
    const { userId } = await req.json();
    if (!userId) {
      throw new Error("User ID is required to delete a user.");
    }
    // 4. Create the privileged admin client to perform the deletion.
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SERVICE_ROLE_KEY') ?? '' // Use the secure key
    );
    // 5. Use the admin client to delete the user from the auth schema.
    // The profile in public.users will be deleted automatically due to the 'ON DELETE CASCADE' constraint.
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (error) throw error;
    return new Response(JSON.stringify({
      message: 'User deleted successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    console.error('Error in delete-user function:', error);
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
