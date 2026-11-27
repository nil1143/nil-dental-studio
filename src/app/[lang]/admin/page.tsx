import type { Metadata } from "next";
import { Suspense } from "react";
import { SectionHeading } from "@/components/section-heading";
import { getDictionary } from "@/i18n/dictionaries";
import type { Dictionary } from "@/i18n/dictionaries";
import { fill } from "@/i18n/fill";
import { requireAdmin } from "@/lib/session";

// No admin title: a patient who opens /admin sees the 404 page, so the tab must not name the admin area.
export const metadata: Metadata = { robots: { index: false } };

// The shell holds no admin content; everything admin renders after requireAdmin() inside <Suspense>.
export default async function AdminPage() {
  const { admin } = await getDictionary();
  return (
    <div className="shell pt-10 pb-(--section-space) md:pt-16">
      <Suspense fallback={<p className="text-ink-muted">{admin.loading}</p>}>
        <AdminHome dict={admin} />
      </Suspense>
    </div>
  );
}

async function AdminHome({ dict }: { dict: Dictionary["admin"] }) {
  const user = await requireAdmin("/admin");
  return (
    <SectionHeading
      as="h1"
      id="admin-title"
      eyebrow={dict.eyebrow}
      title={dict.title}
      lead={fill(dict.lead, { name: user.name })}
    />
  );
}
