import {config} from "https://deno.land/x/dotenv@v3.2.2/mod.ts";
import {Hono} from "npm:hono";
import "jsr:@std/dotenv/load";
import { setUpClients } from "./clients.ts";
import { setUpAuthMiddlewares } from "./apiClients/authMiddleware.ts";
import createBinanceRoutes from "./routes/binance.ts";
import createSupabaseRoutes from "./routes/supabase.ts";
import createCronRoutes from "./routes/cron.ts";

// load env
config({ export: true });

// initialize api clients
const {binanceAPI, supabaseApi} = setUpClients();

const app = new Hono();

// Auth middlewares
// const {authServer, authClient} = setUpAuthMiddlewares();


app.get("/", (c) => {
  return c.text("Hello World!");
});
// app.route("/binance", createBinanceRoutes(binanceAPI).use('*', authServer));
// app.route("/data", createSupabaseRoutes(supabaseApi).use('*', authServer));
// app.route("/updater", createUpdaterRoutes(binanceAPI, supabaseApi).use('*', authServer));

app.route("/cron", createCronRoutes(binanceAPI, supabaseApi));
app.route("/binance", createBinanceRoutes(binanceAPI));
app.route("/data", createSupabaseRoutes(supabaseApi));

// start server
Deno.serve(app.fetch);

