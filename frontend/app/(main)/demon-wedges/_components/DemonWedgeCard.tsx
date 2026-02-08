"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { DemonWedgeListItem } from "@/domains/demonWedges/type";
import { AdminActionButton } from "@/components/ui/AdminActionButton";

const RARITY_COLORS: Record<number, string> = {
  5: "from-amber-400/20 border-amber-400/40",
  4: "from-purple-400/15 border-purple-400/30",
  3: "from-blue-400/10 border-blue-400/20",
  2: "from-green-400/10 border-green-400/20",
};

const ELEMENT_TAG_COLORS: Record<string, string> = {
  hydro: "bg-blue-500/20 text-blue-300",
  pyro: "bg-red-500/20 text-red-300",
  anemo: "bg-emerald-500/20 text-emerald-300",
  lumino: "bg-yellow-500/20 text-yellow-200",
  electro: "bg-violet-500/20 text-violet-300",
  umbro: "bg-purple-500/20 text-purple-300",
};

type Props = {
  wedge: DemonWedgeListItem;
  isAdmin?: boolean;
  onDelete?: () => void;
};

export default function DemonWedgeCard({ wedge, isAdmin = false, onDelete }: Props) {
  const router = useRouter();
  const rarityColor = RARITY_COLORS[wedge.rarity] ?? RARITY_COLORS[2];

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-gradient-to-b ${rarityColor} to-[#0b1020]/90 transition hover:shadow-2xl hover:shadow-black/50`}
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-square px-6 pt-6 overflow-hidden">
        {wedge.image ? (
          <Image
            src={wedge.image}
            alt={wedge.name}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-white/20">💎</div>
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
            <AdminActionButton variant="edit" onClick={() => router.push(`/demon-wedges/${wedge.slug}/edit`)} />
          </div>
        )}
      </div>

      {/* 정보 영역 */}
      <div className="relative flex flex-1 flex-col px-5 pb-5 pt-3">
        {/* 이름 */}
        <h3 className="mb-3 text-center text-lg font-bold tracking-tight">{wedge.name}</h3>

        {/* 태그 */}
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <Tag>{wedge.equipTypeLabel}</Tag>
          <Tag>{wedge.tendencyLabel}</Tag>
          <Tag className="bg-sky-500/20 text-sky-300">내성 {wedge.resistance}</Tag>
          {wedge.element ? (
            <Tag className={ELEMENT_TAG_COLORS[wedge.element] ?? "bg-white/10 text-white/60"}>{wedge.elementLabel}</Tag>
          ) : (
            <Tag className="bg-white/10 text-white/40">무속성</Tag>
          )}
        </div>

        {/* 스탯 (main_effect) */}
        {wedge.stats.length > 0 && (
          <div className="space-y-1.5 text-sm">
            {wedge.stats.map((stat, i) => (
              <div key={i} className="flex justify-between text-white/75">
                <span>{stat.statTypeLabel}</span>
                <span className="font-semibold text-white tabular-nums">{stat.value}%</span>
              </div>
            ))}
          </div>
        )}

        {/* 효과 설명 (sub_effect) */}
        {wedge.effectDescription && (
          <div className="mt-3 border-t border-white/10 pt-3">
            <p
              className="
                text-sm text-white/50 leading-snug
                overflow-hidden
                max-h-[4.5em]
                transition-[max-height]
                duration-300
                ease-in-out
                group-hover:max-h-[999px]
              "
            >
              {wedge.effectDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${className ?? "bg-white/10 text-white/60"}`}>
      {children}
    </span>
  );
}
