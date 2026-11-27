"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { authClient } from "@/lib/auth-client";

export function SignOutButton({ locale, label, pendingLabel }: { locale: Locale; label: string; pendingLabel: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);
    await authClient.signOut();
    router.replace(`/${locale}`);
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} disabled={pending} className="btn btn-secondary">
      {pending ? pendingLabel : label}
    </button>
  );
}
