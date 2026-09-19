const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

    const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

    if (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: error.message })
        };
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data || [])
    };
};
