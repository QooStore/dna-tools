"use client";

import type { WeaponListItem } from "@/domains/weapons/type";

const ELEMENT_COLORS: Record<string, string> = {
  hydro: "bg-blue-500/20 text-blue-300",
  pyro: "bg-red-500/20 text-red-300",
  anemo: "bg-emerald-500/20 text-emerald-300",
  lumino: "bg-yellow-500/20 text-yellow-200",
  electro: "bg-violet-500/20 text-violet-300",
  umbro: "bg-purple-500/20 text-purple-300",
};

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${className ?? "bg-white/10 text-white/60"}`}>
      {children}
    </span>
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between text-xs text-white/75">
      <span>{label}</span>
      <span className="font-semibold text-white tabular-nums">{value}</span>
    </div>
  );
}

export default function WeaponHoverCard({ weapon }: { weapon: WeaponListItem }) {
  const elementColor = weapon.element ? (ELEMENT_COLORS[weapon.element] ?? "bg-white/10 text-white/60") : null;

  return (
    <div className="rounded-xl border border-white/15 bg-slate-950/95 p-3 shadow-2xl backdrop-blur-sm">
      {/* 이름 */}
      <div className="mb-2 text-sm font-bold text-white/95">{weapon.name}</div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Tag>{weapon.categoryLabel}</Tag>
        <Tag>{weapon.weaponTypeLabel}</Tag>
        <Tag>{weapon.attackTypeLabel}</Tag>
        {elementColor ? (
          <Tag className={elementColor}>{weapon.elementLabel}</Tag>
        ) : (
          <Tag className="bg-white/10 text-white/40">무속성</Tag>
        )}
      </div>

      {/* 기본 스탯 */}
      <div className="space-y-1 border-t border-white/10 pt-2">
        <StatRow label="공격력" value={weapon.attack} />
        <StatRow label="치명타 확률" value={`${weapon.critRate}%`} />
        <StatRow label="치명타 피해" value={`${weapon.critDamage}%`} />
        <StatRow label="공격 속도" value={weapon.attackSpeed} />
        {weapon.triggerProbability > 0 && (
          <StatRow label="발동 확률" value={`${weapon.triggerProbability}%`} />
        )}
        {/* 근접 전용 */}
        {weapon.chargeAttackSpeed != null && (
          <StatRow label="차지 공격 속도" value={weapon.chargeAttackSpeed} />
        )}
        {weapon.fallAttackSpeed != null && (
          <StatRow label="낙하 공격 속도" value={weapon.fallAttackSpeed} />
        )}
        {/* 원거리 전용 */}
        {weapon.multishot != null && weapon.multishot > 0 && (
          <StatRow label="멀티샷" value={weapon.multishot} />
        )}
        {weapon.magCapacity != null && weapon.magCapacity > 0 && (
          <StatRow label="탄창" value={weapon.magCapacity} />
        )}
        {weapon.maxAmmo != null && weapon.maxAmmo > 0 && (
          <StatRow label="최대 탄약" value={weapon.maxAmmo} />
        )}
        {weapon.ammoConversionRate != null && weapon.ammoConversionRate > 0 && (
          <StatRow label="탄약 변환율" value={`${weapon.ammoConversionRate}%`} />
        )}
      </div>

      {/* 패시브 */}
      {weapon.passiveStatLabel && weapon.passiveValue != null && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <StatRow label={weapon.passiveStatLabel} value={`${weapon.passiveValue}%`} />
        </div>
      )}

      {/* 액티브 스킬 */}
      {weapon.activeSkillDescription && (
        <div className="mt-2 border-t border-white/10 pt-2">
          <p className="text-xs text-white/55 leading-snug">{weapon.activeSkillDescription}</p>
        </div>
      )}
    </div>
  );
}
