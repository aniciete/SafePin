import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Regular expression for basic email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json();

    if (!email || !emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'A valid email is required.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if the email already exists
    const { data: existingSubscription, error: selectError } = await supabaseAdmin
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // Ignore 'not found' error
      throw selectError;
    }

    if (existingSubscription) {
      if (existingSubscription.is_active) {
        return new Response(JSON.stringify({ message: "You're already subscribed." }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      } else {
        // Reactivate an inactive subscription
        const { error: updateError } = await supabaseAdmin
          .from('newsletter_subscriptions')
          .update({ is_active: true, unsubscribed_at: null, consent_timestamp: new Date().toISOString() })
          .eq('id', existingSubscription.id);

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ message: 'Your subscription has been reactivated.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    } else {
      // Insert a new subscription
      const { error: insertError } = await supabaseAdmin
        .from('newsletter_subscriptions')
        .insert({ email: email, is_active: true, consent_timestamp: new Date().toISOString() });

      if (insertError) throw insertError;

      return new Response(JSON.stringify({ message: 'Subscription successful! Welcome.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});