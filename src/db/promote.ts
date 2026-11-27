/*
 * `npm run auth:promote -- <email>`: give an existing account the admin role. The only way to make
 * an admin (the auth API cannot set `role`). Applies on the user's next request, no re-login needed.
 */
import { eq } from "drizzle-orm";
import { db } from "./index";
import { user } from "./schema/auth";

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  if (!email) {
    console.error("Usage: npm run auth:promote -- <email>");
    process.exit(1);
  }

  // Better Auth stores emails lower-cased.
  const promoted = await db
    .update(user)
    .set({ role: "admin" })
    .where(eq(user.email, email))
    .returning({ id: user.id });

  // Counts only: the email is personal data and stays out of the output.
  if (promoted.length === 0) {
    console.error("No account with that email. Sign up first, then promote.");
    process.exit(1);
  }
  console.log(`Promoted ${promoted.length} account to admin.`);
}

main().catch(() => {
  console.error("Promotion failed.");
  process.exit(1);
});
