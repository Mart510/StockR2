import { assert } from "@std/assert";
import { SupabaseApi } from "../apiClients/supabaseAPI.ts";

// load env as deno doesn't load it automatically in tests
import "jsr:@std/dotenv/load";

Deno.test("Create Supabase Class", async () => {
    const supabaseURL = Deno.env.get("SUPABASE_REST_URL");
    const supabaseKey = Deno.env.get("SUPABASE_API_KEY");

    assert(supabaseURL, "SUPABASE_REST_URL should be defined");
    assert(supabaseKey, "SUPABASE_API_KEY should be defined");

    const supabaseApi = new SupabaseApi(supabaseURL, supabaseKey);
    assert(supabaseApi instanceof SupabaseApi);

    const response = await supabaseApi.getAllTickers();
    assert(response);

    assert(Array.isArray(response), "Response should be an array");
    assert(response.length > 0, "Response should not be empty");
});