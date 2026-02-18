"use client";

import type { DemonWedgeListItem } from "@/domains/demonWedges/type";

const RARITY_BORDER: Record<number, string> = {
  5: "border-amber-400/50",
  4: "border-purple-400/40",
  3: "border-blue-400/30",
  2: "border-green-400/25",
};

const RARITY_STAR_COLOR: Record<number, string> = {
  5: "text-amber-400",
  4: "text-purple-400",
  3: "text-blue-400",
  2: "text-green-400",
};

function stars(n: number): string {
  return "★".repeat(Math.min(5, Math.max(1, n)));
}

export default function WedgeHoverCard({ wedge }: { wedge: DemonWedgeListItem }) {
  const borderCls = RARITY_BORDER[wedge.rarity] ?? "border-white/10";
  const starColor = RARITY_STAR_COLOR[wedge.rarity] ?? "text-white/60";

  return (
    <div className={`rounded-xl border ${borderCls} bg-slate-950/95 p-3 shadow-2xl backdrop-blur-sm`}>
      {/* 이름 + 레어도 */}
      <div className="flex items-center justify-between gap-2">
        <div className="truncate text-sm font-bold text-white/95">{wedge.name}</div>
        <div className={`shrink-0 text-xs ${starColor}`}>{stars(wedge.rarity)}</div>
      </div>

      {/* 태그: 장착타입, 성향, 내성, 속성 */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Tag>{wedge.equipTypeLabel}</Tag>
        {wedge.tendencyLabel && <Tag>{wedge.tendencyLabel}</Tag>}
        <Tag className="bg-sky-500/20 text-sky-300">내성 {wedge.resistance}</Tag>
        {wedge.elementLabel ? (
          <Tag>{wedge.elementLabel}</Tag>
        ) : (
          <Tag className="bg-white/10 text-white/40">무속성</Tag>
        )}
      </div>

      {/* 스탯 */}
      {wedge.stats.length > 0 && (
        <div className="mt-2 border-t border-white/10 pt-2 space-y-1">
          {wedge.stats.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs text-white/75">
              <span>{s.statTypeLabel}</span>
              <span className="font-semibold text-white tabular-nums">
                {s.statType?.includes("Range") ? `+${s.value}` : `${s.value}%`}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 효과 설명 */}
      {wedge.effectDescription && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="text-xs text-white/55 leading-snug">{wedge.effectDescription}</p>
        </div>
      )}
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${className ?? "bg-white/10 text-white/60"}`}>
      {children}
    </span>
  );
}
