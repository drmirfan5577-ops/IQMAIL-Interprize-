import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, from, subject, html, text, replyTo } = await req.json();

    // Get Resend API key from environment
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured. Please set it in Admin Panel.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Sending email via Resend: to=${to}, subject=${subject}`);

    const emailPayload: Record<string, unknown> = {
      from: from || 'IQMAIL <noreply@iqmail.io>',
      to: Array.isArray(to) ? to : [to],
      subject,
      html: html || `<p>${text}</p>`,
    };
    if (replyTo) emailPayload.reply_to = replyTo;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    const data = await response.json();
    console.log('Resend response:', JSON.stringify(data));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Resend: ${data.message || data.name || 'Failed to send'}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('send-email error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
