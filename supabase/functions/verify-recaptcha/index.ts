import { serve } from 'std/http/server.ts';

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY');

serve(async (req) => {
  const { token } = await req.json();

  if (!token) {
    return new Response(JSON.stringify({ error: 'Missing reCAPTCHA token' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    if (data.success && data.score > 0.5) {
      // The reCAPTCHA token is valid and the user is likely human.
      // In a real application, you would now proceed with the report submission logic.
      return new Response(JSON.stringify({ success: true, message: 'reCAPTCHA verified successfully' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // The reCAPTCHA token is invalid or the user is likely a bot.
      return new Response(JSON.stringify({ success: false, error: 'reCAPTCHA verification failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});