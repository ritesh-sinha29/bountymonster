export default function BountyLoading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-64 bg-white/5 rounded-lg" />
        <div className="h-9 w-28 bg-white/5 rounded-lg" />
      </div>
      {/* Tabs skeleton */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-32 bg-white/5 rounded-full" />
        ))}
      </div>
      {/* Cards skeleton */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="h-[130px] rounded-xl bg-white/[0.03] border border-white/5"
          />
        ))}
      </div>
    </div>
  );
}
