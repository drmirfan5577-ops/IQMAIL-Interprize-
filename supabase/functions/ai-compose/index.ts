import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, emailBody, subject, context, language } = await req.json();

    const apiKey = Deno.env.get('ONSPACE_AI_API_KEY');
    const baseUrl = Deno.env.get('ONSPACE_AI_BASE_URL');

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'OnSpace AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const langInstruction = language === 'ur' ? 'Respond in Urdu.' : 
                            language === 'ar' ? 'Respond in Arabic.' : 
                            'Respond in English.';

    const prompts: Record<string, string> = {
      compose: `You are an expert email writer. Write a professional, concise email for the following context:\n${context}\nSubject: ${subject || 'As appropriate'}\n${langInstruction}\nProvide only the email body text, no subject line.`,
      improve: `Improve this email to be more professional, clear, and concise:\n\n${emailBody}\n\n${langInstruction}\nProvide only the improved email body.`,
      summarize: `Summarize this email in 1-2 sentences:\n\n${emailBody}\n\n${langInstruction}`,
      reply: `Write a professional reply to this email:\n\n${emailBody}\n\n${langInstruction}\nProvide only the reply body.`,
      translate: `Translate this email to ${language === 'ur' ? 'Urdu' : language === 'ar' ? 'Arabic' : 'English'}:\n\n${emailBody}`,
    };

    const prompt = prompts[action] || prompts.compose;

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are IQMAIL AI Assistant — an intelligent email composition and management assistant.' },
          { role: 'user', content: prompt }
        ]
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content ?? '';

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('ai-compose error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
