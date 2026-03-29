export default function BountyDetailLoading() {
  return (
    <div className="min-h-full pb-20 animate-pulse">
      {/* Hero skeleton */}
      <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070B] via-[#05070B]/80 to-transparent" />

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 pt-8 flex flex-col justify-between">
          {/* Back button skeleton */}
          <div className="w-36 h-8 rounded-lg bg-white/10" />

          {/* Title area */}
          <div className="pb-10 space-y-4">
            <div className="w-28 h-6 rounded-full bg-blue-500/20" />
            <div className="w-3/4 h-12 rounded-xl bg-white/10" />
            <div className="w-1/3 h-5 rounded-lg bg-white/5" />
          </div>
        </div>
      </div>

      {/* Content grid skeleton */}
      <div className="max-w-7xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main content skeleton */}
        <div className="lg:col-span-2 space-y-10">
          <div className="space-y-4">
            <div className="w-40 h-5 rounded bg-white/10" />
            <div className="space-y-2">
              <div className="w-full h-4 rounded bg-white/5" />
              <div className="w-5/6 h-4 rounded bg-white/5" />
              <div className="w-4/6 h-4 rounded bg-white/5" />
              <div className="w-full h-4 rounded bg-white/5" />
              <div className="w-3/4 h-4 rounded bg-white/5" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-44 h-5 rounded bg-white/10" />
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <div className="w-5 h-5 rounded bg-blue-400/20 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="w-16 h-3 rounded bg-green-400/20" />
                    <div className="w-1/2 h-4 rounded bg-white/10" />
                    <div className="w-3/4 h-3 rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reward panel skeleton */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-[#0A0E17]">
            <div className="w-32 h-4 rounded bg-white/10 mb-6" />
            <div className="space-y-3 mb-8">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/10" />
                    <div className="w-20 h-4 rounded bg-white/10" />
                  </div>
                  <div className="w-20 h-7 rounded bg-white/10" />
                </div>
              ))}
            </div>
            <div className="w-full h-12 rounded-xl bg-primary/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
