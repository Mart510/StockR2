import {config} from "https://deno.land/x/dotenv/mod.ts";
import {Hono} from "npm:hono";
import "jsr:@std/dotenv/load";
import { BinanceApi } from "./binanceAPI/binanceApi.ts";
import { SupabaseApi } from "./supabaseAPI/databaseMethods.ts";
import { RateLimiter } from "./utils/RateLimiter.ts";
import { setUpClients } from "./clients.ts";

// TODO refactor this file to only do the following:
// 1. load environment variables
// 2. initialize api clients
// 3. register the routes
// 4. start the server

// src/
// │
// ├── main.ts
// ├── config.ts               <- Loads env vars
// ├── clients.ts              <- setUpClients function
// │
// ├── routes/
// │   ├── binance.ts
// │   ├── supabase.ts
// │   └── index.ts            <- Optionally aggregates all routes
// │
// ├── binanceAPI/
// │   └── binanceApi.ts
// │
// ├── supabaseAPI/
// │   └── databaseMethods.ts
// │
// └── utils/
//     └── RateLimiter.ts



// load env
config({ export: true });

const {binanceAPI, supabaseApi} = setUpClients();

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));

  console.log(Deno.env.get("DENO_ENV"));
  console.log(Deno.env.get("TESTER"));
  console.log(Deno.env.get("FIN_KEY"));
}


// start server
const app = new Hono();
Deno.serve(app.fetch);


// demo route
app.get("/", (c) => {
  return c.text("Hello World!");
});




app.get("/binance/ping", async (c) => {
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


app.get("/binance/ping-tester", async () => {
  const response = await pingTester();
  console.log(response);
});

app.get("/binance/ticker-average-price", async (c) => {
  const tickerParam = c.req.query("ticker");
  const pairTicker = c.req.query("pairTicker") || "USDC";
  if (!tickerParam) {
    return c.json({ error: "Ticker is required" }, 400);
  }
  const response = await binanceAPI.getTickerAvgprice(tickerParam, pairTicker);
  console.log(response);
  return c.json(response);
});


// supabase API routes
app.get("/data/ticker-list", async (c) => {
  const response = await supabaseApi.getAllTickers();
  console.log(response);
  return c.json(response);
});

app.get("/data/ticker-id", async (c) => {
  const tickerParam = c.req.query("ticker");
  if (!tickerParam) {
    return c.json({ error: "Ticker is required" }, 400);
  }
  const response = await supabaseApi.getTickerUUID(tickerParam);
  console.log(response);
  return c.json(response);
});


// test insert for daily summary
app.get("/data/insert-daily-summary", async (c) => {
  // const getAllTickers = await getAllTickers();
});

export function add(a: number, b: number): number {
  return a + b;
}






// TODO - set up finnhub api calls
// Get Ticker list
// Set up Supabase integration
// Get Ticker info for all day for each ticker

// Get ticker list

// set up database

// scripts to generate tables for each ticker
// store statically in this repo a json for each ticker
  // ticker name
  // ticker symbol as image url
  // ticker description
  // stactially store images on this server

// main table holds tickers and ticker info

// table per ticker for history
  // price
  // timestamp

// table per ticker for 24h summaries
  // date
  // summary

// have scripts to create test_tables for all tables