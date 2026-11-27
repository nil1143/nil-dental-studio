import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

// Sign-up, sign-in and sign-out come from the browser here, so Better Auth's rate limit and
// origin checks apply (they skip server-side `auth.api` calls).
export const { GET, POST } = toNextJsHandler(auth);
