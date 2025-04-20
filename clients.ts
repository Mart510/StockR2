import { BinanceApi } from "./apiClients/binanceApi.ts";
import { SupabaseApi } from "./apiClients/supabaseAPI.ts";

const setUpClients = (): { binanceAPI: BinanceApi; supabaseApi: SupabaseApi } => {
    const binanceBaseURL = Deno.env.get("BINANCE_BASE_URL");
    const supabaseURL = Deno.env.get("SUPABASE_REST_URL");
    const supabaseKey = Deno.env.get("SUPABASE_API_KEY");

    if (!binanceBaseURL || !supabaseURL || !supabaseKey) {
        throw new Error("Missing required environment variables.");
    }

    const binanceAPI = new BinanceApi(binanceBaseURL);
    const supabaseApi = new SupabaseApi(supabaseURL, supabaseKey);

    return { binanceAPI, supabaseApi };
}

export { setUpClients };