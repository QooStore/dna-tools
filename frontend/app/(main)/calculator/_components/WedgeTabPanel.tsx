"use client";

import { DemonWedgeListItem } from "@/domains/demonWedges/type";
import { WedgeTab, SlotCategory } from "@/domains/calculator/types";
import WedgeSlot from "./WedgeSlot";

type Props = {
  activeTab: WedgeTab;
  onTabChange: (tab: WedgeTab) => void;
  characterWedges: (DemonWedgeListItem | null)[];
  meleeWedges: (DemonWedgeListItem | null)[];
  rangedWedges: (DemonWedgeListItem | null)[];
  consonanceWedges: (DemonWedgeListItem | null)[];
  onOpenModal: (cat: SlotCategory, index: number) => void;
  onClear: (cat: SlotCategory, index: number) => void;
};

const TABS: { key: WedgeTab; label: string }[] = [
  { key: "character", label: "Character" },
  { key: "consonance", label: "Consonance" },
  { key: "melee", label: "Melee" },
  { key: "ranged", label: "Ranged" },
];

const TAB_TITLES: Record<WedgeTab, string> = {
  character: "Demon Wedges (Character)",
  consonance: "Demon Wedges (Consonance Weapon)",
  melee: "Demon Wedges (Melee)",
  ranged: "Demon Wedges (Ranged)",
};

export default function WedgeTabPanel({
  activeTab,
  onTabChange,
  characterWedges,
  meleeWedges,
  rangedWedges,
  consonanceWedges,
  onOpenModal,
  onClear,
}: Props) {

  const getWedges = (): (DemonWedgeListItem | null)[] => {
    switch (activeTab) {
      case "character": return characterWedges;
      case "consonance": return consonanceWedges;
      case "melee": return meleeWedges;
      case "ranged": return rangedWedges;
    }
  };

  const getSlotCategory = (index: number): SlotCategory => {
    switch (activeTab) {
      case "character": return index === 8 ? "kukulkanWedge" : "characterWedge";
      case "consonance": return "consonanceWedge";
      case "melee": return "meleeWedge";
      case "ranged": return "rangedWedge";
    }
  };

  const wedges = getWedges();
  const totalResistance = wedges.reduce((sum, w) => sum + (w?.resistance ?? 0), 0);

  return (
    <div className="space-y-4">
      {/* 탭 바 */}
      <div className="grid grid-cols-4 gap-1 rounded-lg bg-white/[0.03] p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              rounded-md px-2 py-2 text-sm font-medium transition
              ${activeTab === tab.key
                ? "bg-blue-600 text-white shadow"
                : "text-white/50 hover:text-white/70 hover:bg-white/5"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 타이틀 */}
      <div className="border-t border-white/10 pt-4">
        <h3 className="text-center text-lg font-bold">{TAB_TITLES[activeTab]}</h3>
      </div>

      {/* 내성 합계 */}
      <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
        <p className="text-xs text-white/40 uppercase tracking-wider">
          {activeTab.toUpperCase()} WEDGES — COMBINED
        </p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-white/40">COMBINED TOLERANCE</span>
          <span className="text-sm font-bold tabular-nums">{totalResistance}</span>
        </div>
      </div>

      {/* 슬롯 그리드 */}
      {activeTab === "character" && (
        <CharacterWedgeGrid
          wedges={characterWedges}
          onOpenModal={onOpenModal}
          onClear={onClear}
          getSlotCategory={getSlotCategory}
        />
      )}

      {activeTab === "consonance" && (
        <div className="flex justify-center gap-4 flex-wrap py-4">
          {consonanceWedges.map((w, i) => (
            <WedgeSlot
              key={i}
              index={i}
              image={w?.image}
              name={w?.name}
              onSelect={() => onOpenModal("consonanceWedge", i)}
              onClear={() => onClear("consonanceWedge", i)}
            />
          ))}
        </div>
      )}

      {(activeTab === "melee" || activeTab === "ranged") && (
        <EightSlotGrid
          wedges={activeTab === "melee" ? meleeWedges : rangedWedges}
          slotCategory={activeTab === "melee" ? "meleeWedge" : "rangedWedge"}
          onOpenModal={onOpenModal}
          onClear={onClear}
        />
      )}
    </div>
  );
}

/* 캐릭터: 4 - 1(쿠쿨칸) - 4 레이아웃 */
function CharacterWedgeGrid({
  wedges,
  onOpenModal,
  onClear,
  getSlotCategory,
}: {
  wedges: (DemonWedgeListItem | null)[];
  onOpenModal: (cat: SlotCategory, index: number) => void;
  onClear: (cat: SlotCategory, index: number) => void;
  getSlotCategory: (index: number) => SlotCategory;
}) {
  return (
    <div className="space-y-6 py-4">
      {/* 1~4 */}
      <div className="flex justify-center gap-4 flex-wrap">
        {wedges.slice(0, 4).map((w, i) => (
          <WedgeSlot
            key={i}
            index={i}
            image={w?.image}
            name={w?.name}
            onSelect={() => onOpenModal(getSlotCategory(i), i)}
            onClear={() => onClear(getSlotCategory(i), i)}
          />
        ))}
      </div>

      {/* 9 (쿠쿨칸) */}
      <div className="flex justify-center">
        <WedgeSlot
          index={8}
          label="Slot 9"
          image={wedges[8]?.image}
          name={wedges[8]?.name}
          onSelect={() => onOpenModal(getSlotCategory(8), 8)}
          onClear={() => onClear(getSlotCategory(8), 8)}
        />
      </div>

      {/* 5~8 */}
      <div className="flex justify-center gap-4 flex-wrap">
        {wedges.slice(4, 8).map((w, i) => (
          <WedgeSlot
            key={i + 4}
            index={i + 4}
            image={w?.image}
            name={w?.name}
            onSelect={() => onOpenModal(getSlotCategory(i + 4), i + 4)}
            onClear={() => onClear(getSlotCategory(i + 4), i + 4)}
          />
        ))}
      </div>
    </div>
  );
}

/* 무기: 4 + 4 레이아웃 */
function EightSlotGrid({
  wedges,
  slotCategory,
  onOpenModal,
  onClear,
}: {
  wedges: (DemonWedgeListItem | null)[];
  slotCategory: SlotCategory;
  onOpenModal: (cat: SlotCategory, index: number) => void;
  onClear: (cat: SlotCategory, index: number) => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <div className="flex justify-center gap-4 flex-wrap">
        {wedges.slice(0, 4).map((w, i) => (
          <WedgeSlot
            key={i}
            index={i}
            image={w?.image}
            name={w?.name}
            onSelect={() => onOpenModal(slotCategory, i)}
            onClear={() => onClear(slotCategory, i)}
          />
        ))}
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {wedges.slice(4, 8).map((w, i) => (
          <WedgeSlot
            key={i + 4}
            index={i + 4}
            image={w?.image}
            name={w?.name}
            onSelect={() => onOpenModal(slotCategory, i + 4)}
            onClear={() => onClear(slotCategory, i + 4)}
          />
        ))}
      </div>
    </div>
  );
}
