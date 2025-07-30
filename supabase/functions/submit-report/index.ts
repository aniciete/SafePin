import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { reportData, token } = await req.json();
    
    const recaptchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY');
    if (!recaptchaSecret) throw new Error('RECAPTCHA_SECRET_KEY is not configured.');
    
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${recaptchaSecret}&response=${token}`
    });
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      throw new Error('reCAPTCHA verification failed.');
    }

    const supabaseAdmin = createClient(
      Deno.env.get('VITE_SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // --- THIS IS THE FIX (Part 1): Look up the jurisdiction on the backend ---
    let jurisdictionCode = null;
    if (reportData.location) {
      const { data: psgc, error: rpcError } = await supabaseAdmin.rpc('get_jurisdiction_for_location', {
        location_data: reportData.location
      });
      if (rpcError) {
        throw new Error(`Jurisdiction lookup failed: ${rpcError.message}`);
      }
      jurisdictionCode = psgc;
    }

    // --- THIS IS THE FIX (Part 2): Add the found jurisdiction to the report data ---
    const finalReportData = {
      ...reportData,
      jurisdiction: jurisdictionCode,
    };
    
    // The service_role client does not need RLS bypass for simple inserts
    // as it has superuser privileges.
    const { error: insertError } = await supabaseAdmin.from('reports').insert([finalReportData]);
    if (insertError) {
      throw insertError;
    }

    return new Response(JSON.stringify({ message: 'Report submitted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error in submit-report function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});