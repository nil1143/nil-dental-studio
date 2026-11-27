import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import { AuthForm } from "./auth-form";

// Shell of /sign-in and /sign-up. The form reads `?next=`, so it streams in behind <Suspense>.
export async function AuthPage({ mode }: { mode: "signIn" | "signUp" }) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const copy = dict.auth[mode];
  return (
    <section aria-labelledby="auth-title" className="pt-10 pb-(--section-space) md:pt-16">
      <div className="shell-narrow">
        <SectionHeading as="h1" id="auth-title" eyebrow={copy.eyebrow} title={copy.title} lead={copy.lead} />
        <Suspense fallback={<div aria-hidden className="card measure mt-10 min-h-96" />}>
          <AuthForm mode={mode} locale={locale} dict={dict.auth} />
        </Suspense>
      </div>
    </section>
  );
}
