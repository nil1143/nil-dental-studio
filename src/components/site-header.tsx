import Link from "next/link";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary["common"] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-3 md:h-20">
        <Link
          href={`/${locale}`}
          aria-label={dict.homeLink}
          className="font-display text-h3 whitespace-nowrap"
        >
          {dict.brand}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-5 md:gap-8">
          {/* Brand + link + CTA do not fit a phone header; no mobile menu exists yet. Below sm the
              gaps and CTA padding are tighter so brand + account icon + CTA fit a 360px screen. */}
          <Link href={`/${locale}/services`} className="link hidden text-small font-medium sm:inline">
            {dict.nav.services}
          </Link>
          {/* Static link (no session read here, so every page keeps its prerendered shell):
              signed-out visitors are sent on to sign-in. */}
          <Link
            href={`/${locale}/account`}
            aria-label={dict.nav.account}
            title={dict.nav.account}
            className="inline-flex size-11 items-center justify-center rounded-full text-ink transition-colors hover:text-primary"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <circle cx="12" cy="8.5" r="3.75" />
              <path d="M4.75 19.5c1.2-3.3 4-5 7.25-5s6.05 1.7 7.25 5" />
            </svg>
          </Link>
          <Link href={`/${locale}#services`} className="btn btn-primary px-4 sm:px-7">
            {dict.bookVisit}
          </Link>
        </nav>
      </div>
    </header>
  );
}
