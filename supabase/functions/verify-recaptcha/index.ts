const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');
// Define CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};
Deno.serve(async (req)=>{
  // Handle preflight requests for CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }
  // Add a check for the secret key's existence.
  if (!RECAPTCHA_SECRET_KEY) {
    console.error('FATAL: RECAPTCHA_SECRET_KEY environment variable not set.');
    return new Response(JSON.stringify({
      error: 'reCAPTCHA secret key not configured on the server.'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
  try {
    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({
        error: 'Missing reCAPTCHA token'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`
    });
    const data = await response.json();
    if (data.success && data.score > 0.5) {
      // The reCAPTCHA token is valid.
      return new Response(JSON.stringify({
        success: true,
        message: 'reCAPTCHA verified successfully'
      }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    } else {
      // The reCAPTCHA token is invalid or the request failed.
      console.error('reCAPTCHA verification failed:', data['error-codes']);
      return new Response(JSON.stringify({
        success: false,
        error: 'reCAPTCHA verification failed'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Error in reCAPTCHA function:', error.message);
    return new Response(JSON.stringify({
      error: 'Internal server error'
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
