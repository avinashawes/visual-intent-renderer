export function SectionHead({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-8 border-l-4 border-primary pl-4">
      <h2 className="text-3xl font-extrabold text-primary">{title}</h2>
      <p className="mt-1 text-muted-foreground">{sub}</p>
    </div>
  );
}
