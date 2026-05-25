// Purpose: Page header with title and optional subtitle.
export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 align-middle text-center">
      <h1 className="text-2xl font-bold text-brand">{title}</h1>
      {subtitle && <p className="text-slate-500">{subtitle}</p>}
    </div>
  );
}
