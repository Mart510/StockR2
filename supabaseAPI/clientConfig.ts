import {createClient} from '@supabase/supabase-js';


const supabaseURL = Deno.env.get("SUPABASE_REST_URL");
if (!supabaseURL) {
    throw new Error("SUPABASE_REST_URL is not set in the environment variables");
}

const supabaseKey = Deno.env.get("SUPABASE_API_KEY");
if (!supabaseKey) {
    throw new Error("SUPABASE_API_KEY is not set in the environment variables");
}

const supabase = createClient(supabaseURL, supabaseKey);

export default supabase;