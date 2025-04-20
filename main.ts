import {config} from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import {Hono} from "npm:hono";
import "jsr:@std/dotenv/load";
import { setUpClients } from "./clients.ts";
import { setUpAuthMiddlewares } from "./apiClients/authMiddleware.ts";
import createBinanceRoutes from "./routes/binance.ts";
import createSupabaseRoutes from "./routes/supabase.ts";
import createUpdaterRoutes from "./routes/updater.ts";

// TODO refactor this file to only do the following:
// 1. load environment variables - done
// 2. initialize api clients - done
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

const app = new Hono();

// Auth middlewares
const {authServer, authClient} = setUpAuthMiddlewares();


app.get("/", (c) => {
  return c.text("Hello World!");
});
app.route("/binance", createBinanceRoutes(binanceAPI).use('*', authServer));
app.route("/data", createSupabaseRoutes(supabaseApi).use('*', authServer));
app.route("/updater", createUpdaterRoutes(binanceAPI, supabaseApi).use('*', authServer));

// start server
Deno.serve(app.fetch);

export function add(a: number, b: number): number {
  return a + b;
}