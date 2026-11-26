import type { Metadata } from "next";
import { DM_Sans, Newsreader } from "next/font/google";
import { locales } from "@/i18n/config";
import { SiteHeader } from "@/components/site-header";
import { getDictionary, getLocale } from "@/i18n/dictionaries";
import "../globals.css";

// latin-ext carries the Polish diacritics (ą ć ę ł ń ó ś ź ż).
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="btn btn-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          {dict.a11y.skipToContent}
        </a>
        <SiteHeader locale={locale} dict={dict.common} />
        <main id="main" className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
