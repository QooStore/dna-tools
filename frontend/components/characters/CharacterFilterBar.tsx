"use client";

import { useState } from "react";
import type { FilterGroup } from "@/config/characterFilters";

type CharacterFilterBarProps = {
  characterFilters: FilterGroup[];
};

export default function CharacterFilterBar({ characterFilters }: CharacterFilterBarProps) {
  /* 필터 상태 초기값 생성.
  filters = {
              element: "All",
              role: "All",
              proficiency: "All",
              feature: ["All"],
            }
   */
  const [filters, setFilters] = useState<Record<string, string | string[]>>(
    Object.fromEntries(characterFilters.map((f) => [f.key, f.key === "feature" ? ["All"] : "All"]))
  );

  const handleClick = (groupKey: string, option: string) => {
    setFilters((prev) => {
      // 1) feature: 다중 선택
      if (groupKey === "feature") {
        const current = prev[groupKey] as string[];

        // (a) All 클릭 → 무조건 All만
        if (option === "All") {
          return { ...prev, [groupKey]: ["All"] };
        }

        // (b) All 제거 후 토글
        const withoutAll = current.filter((v) => v !== "All");

        // 이미 선택되어 있으면 제거
        if (withoutAll.includes(option)) {
          const next = withoutAll.filter((v) => v !== option);
          // 아무것도 없으면 All로 복귀
          return { ...prev, [groupKey]: next.length === 0 ? ["All"] : next };
        }

        // 새로 추가
        return { ...prev, [groupKey]: [...withoutAll, option] };
      }

      // 2) 단일 선택
      return { ...prev, [groupKey]: option };
    });
  };

  const isActive = (groupKey: string, option: string) => {
    const value = filters[groupKey];
    if (groupKey === "feature") {
      return Array.isArray(value) && value.includes(option);
    }
    return value === option;
  };

  return (
    <div className="space-y-6 pb-8">
      {characterFilters.map((group) => (
        <div key={group.key}>
          {/* Label */}
          <div className="mb-2 text-sm font-semibold text-white/80">{group.label}</div>

          {/* Options */}
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const active = isActive(group.key, option);

              return (
                <button
                  key={option}
                  onClick={() => handleClick(group.key, option)}
                  className={`
                    h-8 rounded-md px-3 text-xs font-medium transition
                    ${
                      active
                        ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }
                  `}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
