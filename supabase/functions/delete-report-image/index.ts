// @ts-nocheck
/// &lt;reference types="https://deno.land/x/deno/cli/types/dts/index.dts" /&gt;
import { serve } from 'std/http/server.ts';
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Initialize the Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  // 1. Set up CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // 2. Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 3. Check for the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    // 4. Get the user from the JWT
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(jwt);

    if (userError) {
      console.error('JWT validation error:', userError);
      return new Response(JSON.stringify({ error: 'Invalid JWT' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!user) {
        return new Response(JSON.stringify({ error: 'User not found' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // 5. Get the filePath and reportId from the request body
    const { filePath, reportId } = await req.json();
    if (!filePath || !reportId) {
      return new Response(JSON.stringify({ error: 'Missing filePath or reportId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 6. Verify ownership or admin role
    const { data: report, error: reportError } = await supabaseAdmin
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single();

    if (reportError || !report) {
        return new Response(JSON.stringify({ error: 'Report not found' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    const { data: userRole } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    const isOwner = report.user_id === user.id;
    const isAdmin = userRole?.role === 'admin';

    if (!isOwner && !isAdmin) {
        return new Response(JSON.stringify({ error: 'User is not authorized to delete this image' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    // 7. Delete the image from storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from('report-images')
      .remove([filePath]);

    if (deleteError) {
      console.error('Failed to delete image:', deleteError);
      return new Response(JSON.stringify({ error: 'Failed to delete image' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 8. Return a success response
    return new Response(JSON.stringify({ message: 'Image deleted successfully' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});