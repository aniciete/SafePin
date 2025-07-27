import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  try {
    const { record: authUser } = await req.json()
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SERVICE_ROLE_KEY') ?? ''
    )
    // Insert into public.users. This will fire the 'on_user_profile_created' trigger.
    const { error } = await supabaseAdmin.from('users').insert({
      id: authUser.id,
      email: authUser.email,
      role: authUser.raw_user_meta_data?.role,
      jurisdiction: authUser.raw_user_meta_data?.jurisdiction,
    })
    if (error) throw error
    return new Response(JSON.stringify({ message: "Profile created" }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})