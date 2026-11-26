// Eyebrow + heading + optional lead: the opening of every page section (h1 when it opens the page).
export function SectionHeading({
  id,
  eyebrow,
  title,
  lead,
  as: Heading = "h2",
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className="measure">
      <p className="eyebrow">{eyebrow}</p>
      <Heading id={id} className="mt-4">
        {title}
      </Heading>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}
