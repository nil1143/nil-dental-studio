// Eyebrow + h2 + optional lead: the opening of every page section.
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="measure">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="mt-4">
        {title}
      </h2>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}
