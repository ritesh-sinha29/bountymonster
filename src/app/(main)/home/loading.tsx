export default function HomeLoading() {
  return (
    <div className="min-h-screen w-full flex bg-background animate-pulse">
      {/* Left content */}
      <div className="flex-1 px-6 py-8 space-y-10">
        <div className="h-8 w-72 bg-white/5 rounded-lg" />
        {/* Boosted bounties skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-40 bg-white/5 rounded" />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-[130px] rounded-xl bg-white/[0.03] border border-white/5" />
            ))}
          </div>
        </div>
        {/* Top hunters skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-32 bg-white/5 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/[0.03] border border-white/5" />
            ))}
          </div>
        </div>
      </div>
      {/* Right sidebar skeleton */}
      <div className="w-[320px] border-l border-white/10 pt-6 px-5 space-y-4 shrink-0">
        <div className="h-[280px] rounded-xl bg-white/[0.03] border border-white/5" />
        <div className="h-[320px] rounded-xl bg-white/[0.03] border border-white/5" />
      </div>
    </div>
  );
}
