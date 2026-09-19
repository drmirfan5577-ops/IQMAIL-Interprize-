 import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers: { 'Access-Control-Allow-Origin': '*' } };
    }

    try {
        const { to, subject, body } = JSON.parse(event.body);
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'IQMAIL <hello@yourdomain.com>',
                to: [to],
                subject: subject,
                html: `<p>${body}</p>`
            })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'ای میل بھیجنے میں ناکامی');
        }

        await supabase.from('emails').insert([{
            type: 'sent',
            from_email: 'hello@yourdomain.com',
            to_email: to,
            subject: subject,
            body: body
        }]);

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: 'ای میل بھیج دی گئی!' })
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ message: error.message })
        };
    }
};
