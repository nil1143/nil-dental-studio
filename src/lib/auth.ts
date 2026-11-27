// Server only (imported by src/lib/session.ts and the /api/auth route). No `server-only` import and
// no `@/` imports: the Better Auth CLI loads this file to generate src/db/schema/auth.ts.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db";
import * as authSchema from "../db/schema/auth";

// Secret and base URL come from BETTER_AUTH_SECRET / BETTER_AUTH_URL.
export const auth = betterAuth({
  appName: "Nil Dental Studio",
  // Neon HTTP has no transactions; the adapter only uses them when `transaction: true`.
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  emailAndPassword: { enabled: true, autoSignIn: true },
  user: {
    additionalFields: {
      // Never settable through the API (`input: false`); only `npm run auth:promote` makes an admin.
      role: { type: ["patient", "admin"], required: true, defaultValue: "patient", input: false },
    },
  },
  // Shared across serverless instances; in-memory counters would be per instance.
  rateLimit: { storage: "database" },
  advanced: { database: { generateId: "uuid" } },
});

export type Role = "patient" | "admin";
