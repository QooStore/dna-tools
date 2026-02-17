"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";

type FilterGroup = {
  field: string;
  title: string;
  options: { value: string; label: string }[];
};

type BaseItem = {
  slug: string;
  name: string;
  [k: string]: unknown;
};

function getImageUrl(item: any): string | undefined {
  return item?.listImage || item?.image;
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
}) {
  const [q, setQ] = useState("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setQ("");
    setActiveFilters({});
  }, [open]);

  const filtered = useMemo(() => {
    const nq = normalize(q);
    return items.filter((it: any) => {
      if (nq) {
        const hay = normalize(`${it?.name ?? ""} ${it?.slug ?? ""}`);
        if (!hay.includes(nq)) return false;
      }

      if (filters) {
        for (const g of filters) {
          const v = activeFilters[g.field];
          if (!v || v === "All") continue;
          const fieldValue = it?.[g.field];
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
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      <div className="relative w-full max-w-6xl rounded-t-2xl sm:rounded-2xl border border-white/10 bg-slate-950/90 shadow-2xl">
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="text-lg font-semibold text-white/90">{title}</div>
          <button onClick={onClose} className="rounded-md px-2 py-1 text-sm text-white/70 hover:bg-white/10">
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
            {filtered.map((it: any) => {
              const img = getImageUrl(it);
              const selected = selectedSlug && it.slug === selectedSlug;

              return (
                <button
                  key={it.slug}
                  onMouseEnter={() => onItemHover?.(it)}
                  onClick={() => {
                    onSelect(it.slug);
                    onClose();
                  }}
                  className={
                    "group relative overflow-hidden rounded-xl border text-left transition " +
                    (selected ? "border-cyan-300/60 bg-cyan-400/10" : "border-white/10 bg-white/5 hover:bg-white/10")
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

                  {renderHoverCard ? (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden w-[340px] -translate-x-1/2 -translate-y-1/2 group-hover:block">
                      {renderHoverCard(it)}
                    </div>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-white/50">총 {filtered.length}개</div>
            <button
              onClick={() => {
                onSelect("");
                onClose();
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
