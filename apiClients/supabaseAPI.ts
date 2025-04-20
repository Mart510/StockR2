// import supabase from "./clientConfig.ts";
import {SupabaseClient} from "@supabase/supabase-js";
import {createClient} from '@supabase/supabase-js';

class SupabaseApi {
    client: SupabaseClient
    constructor(supabaseRestURL: string, supabaseKey: string) {
        this.client = createClient(supabaseRestURL, supabaseKey, {
            auth: {
                persistSession: Deno.env.get("DENO_ENV") !== "test",
                autoRefreshToken: Deno.env.get("DENO_ENV") !== "test",
            },
        });
    }

    getAllTickers = async () => {
        try {
            const { data, error } = await this.client
                .from('tickers')
                .select('*');
    
            if (error) {
                console.error("Error fetching tickers:", error);
                throw error;
            }
            console.log("Tickers data:", data);
            return data;
        } catch (err) {
            console.error("Error:", err);
            throw new Error("Failed to retrieve ticker UUID.");
        }
    }

    // get all info from price logs table
    getAllPriceLogs = async () => {
        try {
            const { data, error } = await this.client
                .from('pricelogs')
                .select('*');
    
            if (error) {
                console.error("Error fetching pricelogs:", error);
                throw error;
            }
            console.log("Price logs data:", data);
            return data;
        } catch (err) {
            console.error("Error:", err);
        }
    }

    getTickerUUID = async (ticker: string): Promise<string> => {
        try {
            const { data, error } = await this.client
                .from('tickers')
                .select('id')
                .eq('ticker', ticker)
                .single();
    
                if (error) {
                    console.error("Error finding ticker uuid:", error);
                    throw error;
                }
                console.log("ticker UUID:", data);
                return data.id;
            } catch (err) {
                console.error("Error:", err);
                throw new Error("Failed to retrieve ticker UUID.");
        }
    }

    // get all info from price logs table for a ticker
    getPriceLogsForTicker = async (ticker: string) => {
        try {
            const tickerId = await this.getTickerUUID(ticker);
            
            const { data, error} = await this.client
                .from('pricelogs')
                .select('*')
                .eq('ticker_id', tickerId);
    
            if (error) {
                console.error("Error fetching pricelogs for ticker:", error);
                throw error;
            }
            console.log("Price logs data for ticker:", data);
            return data;
        } catch (err) {
            console.error("Error:", err);
        }
    }

    // get all info from summary table
    getAlldailySummaries = async () => {
        try {
            const { data, error } = await this.client
                .from('dailysummaries')
                .select('*');

            if (error) {
                console.error("Error fetching dailysummaries:", error);
                throw error;
            }
            console.log("Daily Summaries data:", data);
            return data;
        } catch (err) {
            console.error("Error:", err);
        }
    }
}

export { SupabaseApi };