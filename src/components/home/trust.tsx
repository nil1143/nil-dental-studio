import Image from "next/image";
import { SectionHeading } from "@/components/section-heading";
import type { Dictionary } from "@/i18n/dictionaries";

export function Trust({ dict }: { dict: Dictionary["home"]["trust"] }) {
  return (
    <section aria-labelledby="trust-title" className="section">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="media aspect-landscape lg:col-span-5 lg:aspect-portrait">
          <Image
            src="/placeholders/waiting-area.svg"
            alt={dict.imageAlt}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="lg:col-span-7">
          <SectionHeading
            id="trust-title"
            eyebrow={dict.eyebrow}
            title={dict.title}
            lead={dict.lead}
          />
          {/* Divided rows, not icon tiles: the reasons read as a list, not as features. */}
          <ul className="mt-10 border-t border-line">
            {dict.items.map((item) => (
              <li key={item.title} className="border-b border-line py-5 sm:flex sm:gap-8">
                <h3 className="item-title sm:w-2/5 sm:shrink-0">{item.title}</h3>
                <p className="mt-1.5 text-small text-ink-muted sm:mt-0">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
