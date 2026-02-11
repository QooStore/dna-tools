"use client";

import { DemonWedgeListItem } from "@/domains/demonWedges/type";
import { SlotCategory } from "@/domains/calculator/types";
import ItemSlot from "./ItemSlot";

type Props = {
  title: string;
  wedges: (DemonWedgeListItem | null)[];
  slotCategory: SlotCategory;
  kukulkanIndex?: number; // 캐릭터 쐐기의 쿠쿨칸 슬롯 인덱스
  accent: "cyan" | "amber";
  onOpenModal: (cat: SlotCategory, index: number) => void;
  onClear: (cat: SlotCategory, index: number) => void;
};

export default function WedgeGrid({ title, wedges, slotCategory, kukulkanIndex, accent, onOpenModal, onClear }: Props) {
  const totalResistance = wedges.reduce((sum, w) => sum + (w?.resistance ?? 0), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">{title}</h4>
        <span className="text-xs text-white/30">
          내성 합계: <span className="font-semibold text-white/60">{totalResistance}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {wedges.map((wedge, i) => {
          const isKukulkan = kukulkanIndex !== undefined && i === kukulkanIndex;
          const cat: SlotCategory = isKukulkan ? "kukulkanWedge" : slotCategory;

          return (
            <ItemSlot
              key={i}
              label={isKukulkan ? "쿠쿨칸 슬롯" : `슬롯 ${i + 1}`}
              image={wedge?.image}
              name={wedge?.name}
              subtitle={wedge ? `★${wedge.rarity} · 내성 ${wedge.resistance}` : undefined}
              accent={accent}
              size="sm"
              onSelect={() => onOpenModal(cat, i)}
              onClear={() => onClear(cat, i)}
            />
          );
        })}
      </div>
    </div>
  );
}
