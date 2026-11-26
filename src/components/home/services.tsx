import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { ServiceList } from "@/components/service-list";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";

export function Services({
  locale,
  dict,
  services,
}: {
  locale: Locale;
  dict: Dictionary["home"]["services"];
  services: Dictionary["services"];
}) {
  return (
    <section id="services" aria-labelledby="services-title" className="pb-(--section-space)">
      <div className="shell">
        <SectionHeading id="services-title" eyebrow={dict.eyebrow} title={dict.title} lead={dict.lead} />
        <div className="mt-12 lg:mt-16">
          <ServiceList locale={locale} dict={services} limit={3} />
        </div>
        <Link href={`/${locale}/services`} className="btn btn-secondary mt-10">
          {dict.seeAll}
        </Link>
      </div>
    </section>
  );
}
