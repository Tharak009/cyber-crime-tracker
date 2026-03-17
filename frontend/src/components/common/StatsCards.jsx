export default function StatsCards({ cards }) {
  const items = Array.isArray(cards) ? cards : [];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((card) => (
        <div key={card.label} className="card p-5">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{card.value}</p>
          <p className="mt-2 text-sm text-slate-500">{card.helper}</p>
        </div>
      ))}
    </div>
  );
}
