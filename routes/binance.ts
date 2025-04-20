import { Hono } from "npm:hono";
import type { BinanceApi } from "../apiClients/binanceApi.ts";
import { RateLimiter } from "../utils/RateLimiter.ts";

const createBinanceRoutes = (binanceAPI: BinanceApi) => {

    const binance = new Hono();

    binance.get("/ping", async (c) => {
        const response = await binanceAPI.getPing();
        console.log(response);
        return c.json(response);
    });

    const pingTester = async () => {
        let finalResponse;
        for (let i = 0; i < 10; i++) {
            const response = await binanceAPI.getPing();
            console.log(`Call ${i+1}, reponse: ${response}`);
            await RateLimiter.seconds(5);
            finalResponse = JSON.stringify(response);
        }
        return finalResponse;
    }

    binance.get("/ping-tester", async () => {
        const response = await pingTester();
        console.log(response);
    });

    binance.get("/ticker-average-price", async (c) => {
        const tickerParam = c.req.query("ticker");
        const pairTicker = c.req.query("pairTicker") || "USDC";
        if (!tickerParam) {
            return c.json({ error: "Ticker is required" }, 400);
        }
        const response = await binanceAPI.getTickerAvgprice(tickerParam, pairTicker);
        console.log(response);
        return c.json(response);
    });

    return binance;
}

export default createBinanceRoutes;