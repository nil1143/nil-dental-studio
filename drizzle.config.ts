import { defineConfig } from "drizzle-kit";

// The app gets .env.local from Next; drizzle-kit needs it loaded explicitly (CI sets the variable instead).
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
  out: "./drizzle",
  casing: "snake_case",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
