import { assert } from "@std/assert";
import { BinanceApi } from "../apiClients/binanceApi.ts";

// load env as deno doesn't load it automatically in tests
import "jsr:@std/dotenv/load";


Deno.test("Create Binance Class", async ()  => {

    const binanceBaseURL = Deno.env.get("BINANCE_BASE_URL")

    assert(binanceBaseURL, "BINANCE_BASE_URL should be defined");

    const binanceApi = new BinanceApi(binanceBaseURL);
    assert(binanceApi instanceof BinanceApi);

    const response = await binanceApi.getPing();

    assert(response);
});