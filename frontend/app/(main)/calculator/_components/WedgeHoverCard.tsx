"use client";

import type { DemonWedgeListItem } from "@/domains/demonWedges/type";

function stars(n?: any): string {
  const v = Number(n);
  if (!Number.isFinite(v) || v <= 0) return "";
  return "★".repeat(Math.min(5, Math.max(1, v)));
}

export default function WedgeHoverCard({ wedge }: { wedge: DemonWedgeListItem }) {
  const w: any = wedge as any;
  const stats: any[] = Array.isArray(w.stats) ? w.stats : [];

  return (
    <div className="rounded-xl border border-white/10 bg-slate-950/95 p-3 shadow-2xl">
      <div className="flex items-start gap-2">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white/90">{w.name}</div>
          <div className="mt-0.5 text-xs text-white/60">{stars(w.rarity)}</div>
        </div>
      </div>

      {w.subEffect ? (
        <div className="mt-2 text-xs text-white/75 leading-relaxed">
          <span className="font-semibold text-white/85">Sub Effect:</span> {w.subEffect}
        </div>
      ) : null}

      <div className="mt-2 space-y-1 text-xs text-white/70">
        {w.restriction ? (
          <div>
            <span className="font-semibold text-white/80">Restriction:</span> {w.restriction}
          </div>
        ) : null}
        {w.track != null ? (
          <div>
            <span className="font-semibold text-white/80">Track:</span> {String(w.track)}
          </div>
        ) : null}
        {w.tolerance != null ? (
          <div>
            <span className="font-semibold text-white/80">Tolerance:</span> {String(w.tolerance)}
          </div>
        ) : null}
        {w.source ? (
          <div>
            <span className="font-semibold text-white/80">Source:</span> {w.source}
          </div>
        ) : null}
      </div>

      {stats.length ? (
        <div className="mt-2 border-t border-white/10 pt-2">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-white/70">
            {stats.slice(0, 6).map((s: any, idx) => (
              <div key={idx} className="flex items-center justify-between gap-2">
                <span className="truncate">{s.statType}</span>
                <span className="font-semibold text-white/85">{String(s.value)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
