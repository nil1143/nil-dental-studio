import type { Metadata } from "next";
import { Suspense } from "react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { requireUser } from "@/lib/session";

export async function generateMetadata(): Promise<Metadata> {
  const { account } = await getDictionary();
  return { title: account.metaTitle, robots: { index: false } };
}

export default async function AccountPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <section aria-labelledby="account-title" className="pt-10 pb-(--section-space) md:pt-16">
      <div className="shell-narrow">
        <SectionHeading as="h1" id="account-title" eyebrow={dict.account.eyebrow} title={dict.account.title} />
        <Suspense fallback={<p className="mt-10 text-ink-muted">{dict.account.loading}</p>}>
          <AccountDetails locale={locale} dict={dict.account} />
        </Suspense>
      </div>
    </section>
  );
}

async function AccountDetails({ locale, dict }: { locale: Locale; dict: Dictionary["account"] }) {
  const user = await requireUser("/account");
  return (
    <div className="card mt-10 grid gap-8 p-6 md:p-8">
      <dl className="grid gap-6 sm:grid-cols-2">
        <div>
          <dt className="label">{dict.nameLabel}</dt>
          <dd className="mt-2">{user.name}</dd>
        </div>
        <div>
          <dt className="label">{dict.emailLabel}</dt>
          <dd className="mt-2 break-words">{user.email}</dd>
        </div>
      </dl>
      <div>
        <SignOutButton locale={locale} label={dict.signOut} pendingLabel={dict.signingOut} />
      </div>
    </div>
  );
}
