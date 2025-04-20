import {config} from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import {Hono} from "npm:hono";
import "jsr:@std/dotenv/load";
import { setUpClients } from "./clients.ts";
import createBinanceRoutes from "./routes/binance.ts";
import createSupabaseRoutes from "./routes/supabase.ts";

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

// initialize api clients
const {binanceAPI, supabaseApi} = setUpClients();


// register routes

// start server
const app = new Hono();

app.route("/binance", createBinanceRoutes(binanceAPI));
app.route("/data", createSupabaseRoutes(supabaseApi));

Deno.serve(app.fetch);
// demo route
app.get("/", (c) => {
  return c.text("Hello World!");
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