import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';
// This is our main transactional function.
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  try {
    // 1. Get all data from the incoming request
    const reportPayload = await req.json();
    const { reportData, token } = reportPayload;
    // 2. Verify the reCAPTCHA token
    const recaptchaSecret = Deno.env.get('RECAPTCHA_SECRET_KEY');
    if (!recaptchaSecret) {
      throw new Error('RECAPTCHA_SECRET_KEY is not set in secrets.');
    }
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${recaptchaSecret}&response=${token}`
    });
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      throw new Error('reCAPTCHA verification failed.');
    }
    // 3. If verification is successful, create a privileged Supabase client
    //    to bypass RLS for the insert.
    // --- THIS IS THE CHANGE ---
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? '' // Use the new, non-prefixed name
    );
    // 4. Insert the report data into the database
    const { error: insertError } = await supabaseAdmin.from('reports').insert([
      reportData
    ]);
    if (insertError) {
      throw insertError;
    }
    // 5. Return a success response
    return new Response(JSON.stringify({
      message: 'Report submitted successfully'
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      status: 200
    });
  } catch (error) {
    // Handle any errors that occur
    console.error('Error in submit-report function:', error);
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