import { SectionHeading } from "@/components/section-heading";
import type { Dictionary } from "@/i18n/dictionaries";

export function Steps({ dict }: { dict: Dictionary["home"]["steps"] }) {
  return (
    <section aria-labelledby="steps-title" className="section bg-mist">
      <div className="shell">
        <SectionHeading id="steps-title" eyebrow={dict.eyebrow} title={dict.title} />
        <ol className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {dict.items.map((step, index) => (
            <li key={step.title} className="border-t border-line-strong pt-5">
              {/* Decorative: the list order already conveys the sequence. */}
              <span
                aria-hidden="true"
                className="block font-display text-h3 leading-none text-primary tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3">{step.title}</h3>
              <p className="mt-2 text-small text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
