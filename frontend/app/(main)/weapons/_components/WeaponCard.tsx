"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { WeaponListItem } from "@/domains/weapons/type";
import { AdminActionButton } from "@/components/ui/AdminActionButton";

const ELEMENT_IMAGE_GLOW: Record<string, string> = {
  hydro: "from-blue-500/10",
  pyro: "from-red-500/10",
  anemo: "from-emerald-500/10",
  lumino: "from-yellow-400/12",
  electro: "from-violet-500/10",
  umbro: "from-purple-500/10",
};

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
  isAdmin?: boolean;
  onDelete?: () => void;
};

export default function WeaponCard({ weapon, isAdmin = false, onDelete }: WeaponCardProps) {
  const router = useRouter();
  const stats = buildStats(weapon);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1020]/90 transition hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-black/50">
      {/* 이미지 영역 */}
      <div className="relative aspect-[3/4] flex items-center overflow-hidden">
        {weapon.image ? (
          <Image
            src={weapon.image}
            alt={weapon.name}
            fill
            className="object-cover object-center p-6 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-white/20">🗡</div>
        )}

        {/* 관리자 버튼 */}
        {isAdmin && (
          <div
            className="
              absolute inset-0 z-20
              flex items-center justify-center gap-2
              bg-black/40
              opacity-0 group-hover:opacity-100
              transition
            "
          >
            <AdminActionButton variant="delete" onClick={() => onDelete?.()} />
            <AdminActionButton variant="edit" onClick={() => router.push(`/weapons/${weapon.slug}/edit`)} />
          </div>
        )}

        {/* 무기 하단 속성 글로우 (이미지 안쪽!) */}
        {weapon.element && (
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t ${
              ELEMENT_IMAGE_GLOW[weapon.element]
            } to-transparent`}
          />
        )}
      </div>

      {/* 정보 영역 */}
      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-3">
        {/* 이름 */}
        <h3 className="mb-3 text-center text-lg font-bold tracking-tight">{weapon.name}</h3>

        {/* 태그 */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <Tag>{weapon.categoryLabel}</Tag>
          <Tag>{weapon.weaponTypeLabel}</Tag>
          <Tag className="bg-rose-500/20 text-rose-300">{weapon.attackTypeLabel}</Tag>
          <Tag className={weapon.element ? ELEMENT_TAG_COLORS[weapon.element] : "bg-white/10 text-white/40"}>
            {weapon.elementLabel ?? "무속성"}
          </Tag>
        </div>

        {/* 스탯 */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex justify-between text-white/75">
              <span>{label}</span>
              <span className="font-semibold text-white tabular-nums">{value}</span>
            </div>
          ))}
        </div>

        {/* 스킬 */}
        {(weapon.passiveStat || weapon.activeSkillDescription) && (
          <div className="mt-4 border-t border-white/10 pt-3 text-sm text-white/65">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-cyan-500/20 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">스킬</span>
            </div>

            <p
              className="
                          overflow-hidden
                          leading-snug
                          max-h-[4.5em]
                          transition-[max-height]
                          duration-300
                          ease-in-out
                          group-hover:max-h-[999px]
                        "
            >
              {weapon.activeSkillDescription}
            </p>
          </div>
        )}
      </div>
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

  if (w.multishot != null) stats.push({ label: "다중 사격", value: w.multishot });
  if (w.magCapacity != null && w.magCapacity !== 0) stats.push({ label: "탄창 용량", value: w.magCapacity });
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
