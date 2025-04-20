import { Hono } from "hono";
import type { SupabaseApi, ticker24HrSummaryWithID } from "../apiClients/supabaseAPI.ts";
import { BinanceApi, binanceServerError, numberAsString, ticker24HrSummary } from "../apiClients/binanceApi.ts";


interface tickerPrice {
    ticker: string;
    tickerID: string;
    price: numberAsString;
};

const isBinanceServerError = (response: any): response is binanceServerError => {
    return (
        typeof response === "object" &&
        response !== null &&
        "code" in response &&
        "msg" in response
    );
}

const createUpdaterRoutes = (binanceAPI: BinanceApi, supabaseAPI: SupabaseApi) => {
    const updater = new Hono();

    // update all tickers
    updater.post("/tickers-spot-price", async (c) => {

        const tickersAndIds = await supabaseAPI.getAllTickersAndIds();
        
        const tickerPrices: tickerPrice[] = [];

        // get latest price from binance for each ticker
        for (const tickerObj of tickersAndIds) {
            const {ticker, id} = tickerObj;
            
            const currentTickerPrice = await binanceAPI.getTickerAvgprice(ticker);
            
            if (isBinanceServerError(currentTickerPrice)) {
                console.error(`Error fetching price for ${ticker}: ${currentTickerPrice}`);
                continue;
            }
            
            const price = currentTickerPrice.price;
            
            tickerPrices.push({ ticker, tickerID: id, price });       
            
        }
        
        // insert latest price into database for each ticker
        for (const tickerPriceObj of tickerPrices) {
            const { ticker, tickerID, price } = tickerPriceObj;
            const result = await supabaseAPI.updateTicker(tickerID, price);
            if (result) {
                console.log(`Inserted price for ${ticker}: ${price}`);
            } else {
                console.error(`Failed to insert price for ${ticker}`);
            }
        }

        return c.json({ message: "Tickers updated successfully" });
    });



    // update ticker in database for each ticker
    updater.post("/tickers-24hr-summary", async (c) => {
        const tickersAndIds = await supabaseAPI.getAllTickersAndIds();
        
        const tickers = tickersAndIds.map(tickerObj => tickerObj.ticker);

        const tickerUpdates = await binanceAPI.getTicker24Hr(tickers)

        if (isBinanceServerError(tickerUpdates)) {
            console.error(`Error fetching 24hr summary: ${tickerUpdates}`);
            return c.json({ error: "Failed to fetch 24hr summary" }, 500);
        }

        // add the uuid back onto the ticker updates
        const tickerUpdatesWithUUID: ticker24HrSummaryWithID[] = tickerUpdates.map((tickerUpdate: ticker24HrSummary) => {
            const tickerObj = tickersAndIds.find(tickerObj => tickerObj.ticker === tickerUpdate.symbol);

            if (!tickerObj) {
                throw new Error(`Missing ticker match for symbol: ${tickerUpdate.symbol}`);
            }
        
            return {
                ...tickerUpdate,
                id: tickerObj.id
            };
        });

        const result = await supabaseAPI.updateDailySummary(tickerUpdatesWithUUID);

        return c.json(result);

    });
    // update daily summary

    // update all daily summaries

    return updater;

}

export default createUpdaterRoutes;