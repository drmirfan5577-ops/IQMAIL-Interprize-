import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
    try {
        const data = JSON.parse(event.body);
        const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

        const from = data.from;
        const subject = data.subject;
        const body = data.html || data.text || 'کوئی مواد نہیں';

        await supabase.from('emails').insert([{
            type: 'received',
            from_email: from,
            to_email: data.to ? data.to[0] : 'unknown',
            subject: subject,
            body: body
        }]);

        return { statusCode: 200, body: 'OK' };
    } catch (error) {
        return { statusCode: 500, body: 'Error' };
    }
};