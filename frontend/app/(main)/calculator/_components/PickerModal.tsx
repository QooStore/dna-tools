"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

type FilterGroup = {
  field: string;
  title: string;
  options: { value: string; label: string }[];
};

interface BaseItem {
  slug: string;
  name: string;
}

function getImageUrl(item: BaseItem): string | undefined {
  const img = item as { listImage?: string; image?: string | null };
  return img.listImage || img.image || undefined;
}

function normalize(str: string): string {
  return str.toLowerCase().replace(/\s+/g, " ").trim();
}

export default function PickerModal<T extends BaseItem>({
  open,
  title,
  items,
  selectedSlug,
  onClose,
  onSelect,
  filters,
  grid = "md",
  renderHoverCard,
  onItemHover,
  itemClassName,
}: {
  open: boolean;
  title: string;
  items: T[];
  selectedSlug?: string;
  onClose: () => void;
  onSelect: (slug: string) => void;
  filters?: FilterGroup[];
  grid?: "sm" | "md" | "lg";
  renderHoverCard?: (item: T) => React.ReactNode;
  onItemHover?: (item: T) => void;
  itemClassName?: (item: T) => string;
}) {
  const [q, setQ] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [tooltipItem, setTooltipItem] = useState<T | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const handleClose = useCallback(() => {
    onClose();
    setQ("");
    setActiveFilters({});
  }, [onClose]);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, item: T) => {
      if (!renderHoverCard) return;
      onItemHover?.(item);
      const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setTooltipItem(item);
      setTooltipPos({
        x: btnRect.left + btnRect.width / 2,
        y: btnRect.top,
      });
    },
    [renderHoverCard, onItemHover],
  );

  const handleMouseLeave = useCallback(() => {
    setTooltipItem(null);
    setTooltipPos(null);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, handleClose]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return items.filter((it) => {
      if (nq) {
        const hay = normalize(`${it?.name ?? ""} ${it?.slug ?? ""}`);
        if (!hay.includes(nq)) return false;
      }

      if (filters) {
        for (const g of filters) {
          const v = activeFilters[g.field];
          if (!v || v === "All") continue;
          const fieldValue = (it as Record<string, unknown>)[g.field];
          // 다중 값(배열)도 처리
          if (Array.isArray(fieldValue)) {
            if (!fieldValue.includes(v)) return false;
          } else {
            if (String(fieldValue) !== String(v)) return false;
          }
        }
      }
      return true;
    });
  }, [items, q, filters, activeFilters]);

  if (!open) return null;

  const cols =
    grid === "sm"
      ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
      : grid === "lg"
        ? "grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
        : "grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70" onClick={handleClose} />

      <div className="relative w-full max-w-6xl rounded-t-2xl sm:rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold text-white/90">{title}</div>
          <button onClick={handleClose} className="rounded-md px-2 py-1 text-sm text-white/70 hover:bg-white/10">
            닫기
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="w-full md:flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
            />

            {filters?.length ? (
              <div className="flex gap-2 flex-wrap">
                {filters.map((g) => (
                  <select
                    key={g.field}
                    value={activeFilters[g.field] ?? "All"}
                    onChange={(e) => setActiveFilters((p) => ({ ...p, [g.field]: e.target.value }))}
                    className="h-10 rounded-lg border border-white/10 bg-white/5 px-2 text-sm text-white/80"
                  >
                    {g.options.map((o) => (
                      <option key={o.value} value={o.value} className="text-black">
                        {o.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            ) : null}
          </div>

          <div className={`grid ${cols} gap-3 max-h-[70vh] overflow-auto pr-2`}>
            {filtered.map((it) => {
              const img = getImageUrl(it);
              const selected = selectedSlug && it.slug === selectedSlug;
              const extraCls = itemClassName?.(it) ?? "";

              return (
                <button
                  key={it.slug}
                  onMouseEnter={(e) => handleMouseEnter(e, it)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => {
                    onSelect(it.slug);
                    handleClose();
                  }}
                  className={
                    "group relative overflow-hidden rounded-xl border text-left transition " +
                    (selected
                      ? "border-cyan-300/60 bg-cyan-400/10"
                      : extraCls
                        ? `${extraCls}`
                        : "border-white/10 bg-white/5 hover:bg-white/10")
                  }
                >
                  <div className="aspect-[3/4] w-full bg-black/30">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img} alt={it.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/30 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
                    <div className="truncate text-xs font-semibold text-white/90">{it.name}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 툴팁 — fixed로 뷰포트 기준 렌더링하여 overflow 컨테이너에 잘리지 않음 */}
          {renderHoverCard && tooltipItem && tooltipPos && (
            <div
              className="pointer-events-none fixed z-[60] w-[320px]"
              style={{
                left: `${tooltipPos.x}px`,
                top: `${tooltipPos.y}px`,
                transform: "translate(-50%, -100%) translateY(-8px)",
              }}
            >
              {renderHoverCard(tooltipItem)}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-white/50">총 {filtered.length}개</div>
            <button
              onClick={() => {
                onSelect("");
                handleClose();
              }}
              className="rounded-lg bg-red-600/80 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
            >
              제거
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
