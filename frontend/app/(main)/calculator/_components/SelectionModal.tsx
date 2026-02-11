"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";

import { SlotCategory } from "@/domains/calculator/types";
import { CharacterListItem } from "@/domains/characters/types";
import { WeaponListItem } from "@/domains/weapons/type";
import { DemonWedgeListItem } from "@/domains/demonWedges/type";

type AnyItem = CharacterListItem | WeaponListItem | DemonWedgeListItem;

type Props = {
  title: string;
  items: AnyItem[];
  slotCategory: SlotCategory;
  onSelect: (item: AnyItem) => void;
  onClose: () => void;
};

const TENDENCY_FILTERS = [
  { value: "", label: "전체" },
  { value: "triangle", label: "◬" },
  { value: "diamond", label: "◊" },
  { value: "crescent", label: "☽" },
  { value: "circle", label: "⊙" },
];

export default function SelectionModal({ title, items, slotCategory, onSelect, onClose }: Props) {
  const [keyword, setKeyword] = useState("");
  const [tendency, setTendency] = useState("");
  const [hovered, setHovered] = useState<{
    wedge: DemonWedgeListItem;
    rect: DOMRect;
  } | null>(null);

  const isCharacter = slotCategory === "character" || slotCategory === "ally1" || slotCategory === "ally2";

  const isWeapon = slotCategory === "meleeWeapon" || slotCategory === "rangedWeapon";

  const isWedge = !isCharacter && !isWeapon;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const filtered = useMemo(() => {
    let result = items;

    if (keyword.trim()) {
      const q = keyword.toLowerCase();
      result = result.filter((item) => {
        const name = "name" in item ? item.name : "";
        return name.toLowerCase().includes(q);
      });
    }

    if (isWedge && tendency) {
      result = result.filter((item) => (item as DemonWedgeListItem).tendency === tendency);
    }

    return result;
  }, [items, keyword, tendency, isWedge]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-start sm:pt-16 justify-center px-2 sm:px-4">
      {/* overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* modal */}
      <div className="relative z-10 w-full max-w-6xl max-h-[85vh] flex flex-col rounded-2xl border border-white/10 bg-[#0c1225]">
        {/* header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white/70 text-xl transition">
            ✕
          </button>
        </div>

        {/* search + filter */}
        <div className="flex items-center gap-2 border-b border-white/5 px-5 py-3">
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search..."
            className="h-11 flex-1 rounded-lg bg-white/5 px-4 text-base text-white outline-none ring-1 ring-white/10 focus:ring-cyan-400/50 placeholder:text-white/30"
          />

          {isWedge && (
            <div className="flex gap-1">
              {TENDENCY_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTendency(tendency === f.value ? "" : f.value)}
                  className={`rounded-md px-2.5 py-1.5 text-sm transition ${
                    tendency === f.value ? "bg-blue-600 text-white" : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filtered.length === 0 ? (
            <p className="py-10 text-center text-white/30">결과가 없습니다</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {filtered.map((item) => (
                <GridItem
                  key={getItemKey(item, slotCategory)}
                  item={item}
                  slotCategory={slotCategory}
                  onSelect={onSelect}
                  onHoverWedge={isWedge ? (wedge, rect) => setHovered({ wedge, rect }) : undefined}
                  onLeave={isWedge ? () => setHovered(null) : undefined}
                />
              ))}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="border-t border-white/10 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-red-500/20 px-4 py-2 text-sm text-red-300 hover:bg-red-500/30"
          >
            Cancel
          </button>
        </div>

        {/* hover tooltip */}
        {isWedge && hovered && <FloatingWedgeTooltip wedge={hovered.wedge} rect={hovered.rect} />}
      </div>
    </div>
  );
}

/* grid item */
function GridItem({
  item,
  slotCategory,
  onSelect,
  onHoverWedge,
  onLeave,
}: {
  item: AnyItem;
  slotCategory: SlotCategory;
  onSelect: (item: AnyItem) => void;
  onHoverWedge?: (wedge: DemonWedgeListItem, rect: DOMRect) => void;
  onLeave?: () => void;
}) {
  const isCharacter = slotCategory === "character" || slotCategory === "ally1" || slotCategory === "ally2";

  const isWeapon = slotCategory === "meleeWeapon" || slotCategory === "rangedWeapon";

  const name = "name" in item ? item.name : "";
  let image: string | null = null;

  if (isCharacter) image = (item as CharacterListItem).listImage;
  else if (isWeapon) image = (item as WeaponListItem).image;
  else image = (item as DemonWedgeListItem).image;

  return (
    <button
      onClick={() => onSelect(item)}
      onMouseEnter={(e) => {
        if (!isCharacter && !isWeapon) {
          const rect = e.currentTarget.getBoundingClientRect();
          onHoverWedge?.(item as DemonWedgeListItem, rect);
        }
      }}
      onMouseLeave={() => onLeave?.()}
      className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] p-3 transition hover:bg-white/[0.1] hover:border-cyan-400/40"
    >
      <div className="relative h-24 w-24 rounded-lg bg-white/5">
        {image && <Image src={image} alt={name} fill className="object-contain p-1" />}
      </div>
      <span className="text-sm text-white/80 truncate w-full text-center">{name}</span>
    </button>
  );
}

/* tooltip */
function FloatingWedgeTooltip({ wedge, rect }: { wedge: DemonWedgeListItem; rect: DOMRect }) {
  const tooltipWidth = 256;
  const margin = 12;

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1024;

  let left = rect.left + rect.width / 2;
  const top = rect.top - margin;

  const minLeft = tooltipWidth / 2 + margin;
  const maxLeft = viewportWidth - tooltipWidth / 2 - margin;

  left = Math.max(minLeft, Math.min(maxLeft, left));

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left,
        top,
        transform: "translate(-50%, -100%)",
      }}
    >
      <div className="w-72 rounded-xl border border-white/10 bg-[#0b1020]/95 px-3 py-2 text-sm shadow-xl">
        <div className="font-bold mb-2 text-base">{wedge.name}</div>
        {wedge.stats.map((s) => (
          <div key={s.statType} className="flex justify-between text-white/70">
            <span>{s.statTypeLabel}</span>
            <span>+{s.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function getItemKey(item: AnyItem, slotCategory: SlotCategory) {
  if (slotCategory === "character" || slotCategory === "ally1" || slotCategory === "ally2") return `char-${item.id}`;
  if (slotCategory === "meleeWeapon" || slotCategory === "rangedWeapon") return `wpn-${item.id}`;
  return `wedge-${item.id}`;
}
