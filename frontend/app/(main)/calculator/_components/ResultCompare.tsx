import type { OutputKey } from "./calculatorLogic";

const OUTPUT_META: { key: OutputKey; label: string }[] = [
  { key: "skillDamage", label: "스킬 대미지" },
  { key: "meleeWeaponDamage", label: "근접 무기 대미지" },
  { key: "rangedWeaponDamage", label: "원거리 무기 대미지" },
  { key: "meleeConsonanceWeaponDamage", label: "근접 동조 무기 대미지" },
  { key: "rangedConsonanceWeaponDamage", label: "원거리 동조 무기 대미지" },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (abs >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function ResultCompare({ a, b }: { a: Record<OutputKey, number>; b: Record<OutputKey, number> }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-white/80">항목</th>
              <th className="px-4 py-3 text-right font-semibold text-white/80">빌드 A</th>
              <th className="px-4 py-3 text-right font-semibold text-white/80">빌드 B</th>
              <th className="px-4 py-3 text-right font-semibold text-white/80">차이</th>
              <th className="px-4 py-3 text-center font-semibold text-white/80">+</th>
            </tr>
          </thead>
          <tbody>
            {OUTPUT_META.map((m) => {
              const av = a[m.key] ?? 0;
              const bv = b[m.key] ?? 0;
              const high = Math.max(av, bv);
              const low = Math.min(av, bv);
              const winner: "A" | "B" | "=" = av === bv ? "=" : av > bv ? "A" : "B";
              const winClass = winner === "A" ? "text-cyan-200" : winner === "B" ? "text-fuchsia-200" : "text-white/60";

              return (
                <tr key={m.key} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white/80">{m.label}</td>
                  <td className={`px-4 py-3 text-right ${winner === "A" ? "text-cyan-200" : "text-white/70"}`}>
                    {fmt(av)}
                  </td>
                  <td className={`px-4 py-3 text-right ${winner === "B" ? "text-fuchsia-200" : "text-white/70"}`}>
                    {fmt(bv)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/70">{fmt(high - low)}</td>
                  <td className={`px-4 py-3 text-center font-semibold ${winClass}`}>{winner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
