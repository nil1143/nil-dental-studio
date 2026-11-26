import { Hero } from "@/components/home/hero";
import { Services } from "@/components/home/services";
import { Steps } from "@/components/home/steps";
import { Trust } from "@/components/home/trust";
import { Visit } from "@/components/home/visit";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export default async function Home() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const { home, common } = dict;
  return (
    <>
      <Hero locale={locale} dict={home.hero} bookVisit={common.bookVisit} />
      <Services locale={locale} dict={home.services} services={dict.services} />
      <Steps dict={home.steps} />
      <Trust dict={home.trust} />
      <Visit locale={locale} dict={home.visit} days={common.days} bookVisit={common.bookVisit} />
    </>
  );
}
