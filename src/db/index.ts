import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema/clinic";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is not set (use Neon's pooled connection string).");

// Neon over HTTP: no transactions, use db.batch(). The transactional `dbTx` arrives with booking.
export const db = drizzle({ client: neon(url), schema, casing: "snake_case" });
