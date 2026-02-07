"use client";

import Image from "next/image";

import { WeaponListItem } from "@/domains/weapons/type";

const ELEMENT_TAG_COLORS: Record<string, string> = {
  hydro: "bg-blue-500/20 text-blue-300",
  pyro: "bg-red-500/20 text-red-300",
  anemo: "bg-emerald-500/20 text-emerald-300",
  lumino: "bg-yellow-500/20 text-yellow-200",
  electro: "bg-violet-500/20 text-violet-300",
  umbro: "bg-purple-500/20 text-purple-300",
};

type WeaponCardProps = {
  weapon: WeaponListItem;
};

export default function WeaponCard({ weapon }: WeaponCardProps) {
  const stats = buildStats(weapon).slice(0, 4); // 핵심만

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/90 transition-all hover:-translate-y-1 hover:border-white/25 hover:shadow-xl hover:shadow-black/40">
      {/* 상단 비주얼 영역 */}
      <div className="relative flex items-center gap-4 p-5">
        <div className="relative h-24 w-24 shrink-0 rounded-xl bg-gradient-to-br from-white/10 to-white/0">
          {weapon.image ? (
            <Image
              src={weapon.image}
              alt={weapon.name}
              fill
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl text-white/20">🗡</div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold tracking-tight">{weapon.name}</h3>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <Tag>{weapon.categoryLabel}</Tag>
            <Tag>{weapon.weaponTypeLabel}</Tag>
            <Tag className="bg-rose-500/20 text-rose-300">{weapon.attackTypeLabel}</Tag>
            {weapon.element && weapon.elementLabel && (
              <Tag className={ELEMENT_TAG_COLORS[weapon.element]}>{weapon.elementLabel}</Tag>
            )}
          </div>
        </div>
      </div>

      {/* 스탯 */}
      <div className="grid grid-cols-2 gap-y-2 gap-x-6 px-5 pb-4 text-sm">
        {stats.map(({ label, value }) => (
          <div key={label} className="flex justify-between text-white/70">
            <span>{label}</span>
            <span className="font-semibold text-white tabular-nums">{value}</span>
          </div>
        ))}
      </div>

      {/* 스킬 요약 */}
      {(weapon.passiveStat || weapon.activeSkillDescription) && (
        <div className="border-t border-white/10 px-5 py-3 text-sm text-white/60">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-cyan-500/20 px-2 py-0.5 text-xs font-semibold text-cyan-300">스킬</span>
            {weapon.passiveStat && <span className="text-amber-300 font-semibold">+{weapon.passiveValue}%</span>}
          </div>

          <p className="line-clamp-2 leading-relaxed">{weapon.activeSkillDescription}</p>
        </div>
      )}
    </div>
  );
}

// --- helpers ---

function buildStats(w: WeaponListItem) {
  const stats: { label: string; value: string | number }[] = [
    { label: "공격력", value: w.attack },
    { label: "치명타 확률", value: `${w.critRate}%` },
    { label: "치명타 피해", value: `${w.critDamage}%` },
    { label: "공격 속도", value: `${w.attackSpeed * 100}%` },
    { label: "발동 확률", value: `${w.triggerProbability}%` },
  ];

  if (w.chargeAttackSpeed != null) stats.push({ label: "차지 공속", value: `${w.chargeAttackSpeed * 100}%` });
  if (w.fallAttackSpeed != null) stats.push({ label: "낙하 공속", value: `${w.fallAttackSpeed * 100}%` });

  if (w.multiShot != null) stats.push({ label: "다중 사격", value: w.multiShot });
  if (w.maxAmmo != null) stats.push({ label: "최대 탄약", value: w.maxAmmo });
  if (w.ammoConversionRate != null) stats.push({ label: "탄약 전환율", value: `${w.ammoConversionRate}%` });

  return stats;
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${className ?? "bg-white/10 text-white/60"}`}>
      {children}
    </span>
  );
}
