import { Hono } from "hono";
import type { SupabaseApi } from "../apiClients/supabaseAPI.ts";

const createSupabaseRoutes = (supabaseAPI: SupabaseApi) => {

    const supabase = new Hono();

    supabase.get("/ticker-list", async (c) => {
        const response = await supabaseAPI.getAllTickers();
        console.log(response);
        return c.json(response);
    });

    supabase.get("/ticker-id", async (c) => {
        const tickerParam = c.req.query("ticker");
        if (!tickerParam) {
            return c.json({ error: "Ticker is required" }, 400);
        }
        const response = await supabaseAPI.getTickerUUID(tickerParam);
        console.log(response);
        return c.json(response);
    });

    supabase.get("/tickers-and-ids", async (c) => {
        const tickersAndIds = await supabaseAPI.getAllTickersAndIds();
        console.log(tickersAndIds);
        return c.json(tickersAndIds);
    });

    return supabase;
}

export default createSupabaseRoutes;