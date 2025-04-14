import {config} from "https://deno.land/x/dotenv/mod.ts";


// loading environment variables from .env file
config({ export: true });


export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 3));

  console.log(Deno.env.get("DENO_ENV"));
  console.log(Deno.env.get("TESTER"));
}
