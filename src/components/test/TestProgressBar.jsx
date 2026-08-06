export default function TestProgressBar({ current, total }) {
  const percentage = total > 0 ? ((current + 1) / total) * 100 : 0;

  return (
    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-gold-400 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
