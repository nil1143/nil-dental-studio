import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { ServiceList } from "@/components/service-list";
import { getDictionary, getLocale } from "@/i18n/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const { servicesPage } = await getDictionary();
  return { title: servicesPage.metaTitle, description: servicesPage.metaDescription };
}

export default async function ServicesPage() {
  const [locale, dict] = await Promise.all([getLocale(), getDictionary()]);
  const page = dict.servicesPage;
  return (
    <section aria-labelledby="services-page-title" className="pt-10 pb-(--section-space) md:pt-16">
      <div className="shell">
        <SectionHeading
          as="h1"
          id="services-page-title"
          eyebrow={page.eyebrow}
          title={page.title}
          lead={page.lead}
        />
        <div className="mt-12 lg:mt-16">
          <ServiceList locale={locale} dict={dict.services} />
        </div>
      </div>
    </section>
  );
}
