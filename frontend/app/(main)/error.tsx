"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <img src="/images/home/error_generic.png" alt="Error" className="h-40 opacity-60" />
      <p className="text-lg text-white/60">문제가 발생했습니다</p>
      <p className="text-sm text-white/40">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
      >
        다시 시도
      </button>
    </div>
  );
}
