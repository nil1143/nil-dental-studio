// Browser side of Better Auth (same origin, /api/auth). The only auth module client components import.
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();
