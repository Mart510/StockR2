// import supabase from "./clientConfig.ts";
import {SupabaseClient} from "@supabase/supabase-js";
import {createClient} from '@supabase/supabase-js';
import { ticker24HrSummary } from "./binanceApi.ts";

interface tickerIDPairs {
    ticker: string;
    id: string;
}

interface ticker24HrSummaryWithID extends ticker24HrSummary {
    id: string;
}
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

    getAllTickersAndIds = async (): Promise<tickerIDPairs[]> => {
        try {
            const { data, error } = await this.client
                .from('tickers')
                .select('id, ticker');
    
            if (error) {
                console.error("Error fetching tickers and ids:", error);
                throw error;
            }
            console.log("Tickers and IDs data:", data);
            return data;
        } catch (err) {
            console.error("Error:", err);
            throw new Error("Failed to retrieve ticker UUID.");
        }
    };

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

    // update ticker in database for each ticker
    updateTicker = async (id: string, latestAvgPrice: string) => {
        try {

            const now = new Date();
    
            const { data: _insertData, error: insertError } = await this.client
                .from('pricelogs')
                .insert([
                    {
                        ticker_id: id,
                        price: latestAvgPrice, logged_at: now,
                        logged_at_posix: Math.floor(now.getTime() / 1000),
                    }
                ]);
    
            if (insertError) {
                console.error('Error inserting price log:', insertError);
                return;
            }
    
            const { data: _updateData, error: updateError } = await this.client
                .from('tickers')
                .update({ last_called_at: now })
                .eq('id', id);
    
            if (updateError) {
                console.error('Error updating ticker:', updateError);
                return;
            }
    
            console.log('Successfully updated ticker and logged price.');

            return `Successfully updated ticker  and logged price for ID: ${id}`;

        } catch (err) {
            console.error('Unexpected error:', err);
        }
    };

    updateDailySummary = async (tickerUpdates: ticker24HrSummaryWithID[]) => {
        try {
            const now = new Date();

            const insertPayload = tickerUpdates.map((ticker) => ({
                ticker_id: ticker.id,
                logged_at: now,
                logged_at_posix: Math.floor(now.getTime() / 1000),
                price_change: ticker.priceChange,
                price_change_percent: ticker.priceChangePercent,
                weighted_avg_price: ticker.weightedAvgPrice,
                prev_close_price: ticker.prevClosePrice,
                last_price: ticker.lastPrice,
                last_quantity: ticker.lastQty,
                bid_price: ticker.bidPrice,
                ask_price: ticker.askPrice,
                ask_quantity: ticker.askQty,
                open_price: ticker.openPrice,
                high_price: ticker.highPrice,
                low_price: ticker.lowPrice,
                volume: ticker.volume,
                quote_volume: ticker.quoteVolume,
                open_time: new Date(ticker.openTime),
                open_time_posix: Math.floor(ticker.openTime / 1000),
                close_time: new Date(ticker.closeTime),
                first_id: ticker.firstId,
                last_id: ticker.lastId,
                count: ticker.count,
                source: 'binance',
            }));
    
            const { data: _insertdata, error: insertError } = await this.client
                .from('dailysummaries')
                .insert(insertPayload);
    
            if (insertError) {
                console.error('Error inserting daily summaries:', insertError);
            }

            console.log('Successfully inserted daily summaries.');

            return `Successfully inserted daily summaries for IDs: ${tickerUpdates.map(t => t.id).join(', ')}`;

        } catch (err) {
            console.error('Unexpected error inserting daily summaries:', err);
        }
    };
}

export { SupabaseApi };
export type { tickerIDPairs, ticker24HrSummaryWithID };