"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { FEATURE_LABELS, WEAPON_CATEGORY_LABELS, ELEMENT_LABELS, WORD_LABELS } from "@/domains/labels";
import type { FilterGroup } from "@/config/characterFilters";

type CharacterFilterBarProps = {
  characterFilters: FilterGroup[];
};

const LABEL_MAP = {
  ...FEATURE_LABELS,
  ...WEAPON_CATEGORY_LABELS,
  ...ELEMENT_LABELS,
};

export default function CharacterFilterBar({ characterFilters }: CharacterFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 URL을 기반으로 active 여부 판단
  const isActive = (groupKey: string, option: string) => {
    // feature: 다중 선택
    if (groupKey === "feature") {
      const values = searchParams.getAll(groupKey);

      // 쿼리 없으면 All active
      if (option === "All") {
        return values.length === 0;
      }

      return values.includes(option);
    }

    // 단일 선택
    const value = searchParams.get(groupKey);

    // 🔥 쿼리 없으면 All active
    if (option === "All") {
      return value === null;
    }

    return value === option;
  };

  const handleClick = (groupKey: string, option: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // 1) feature: 다중 선택
    if (groupKey === "feature") {
      const current = params.getAll(groupKey);

      // (a) All 클릭 → 무조건 All만
      if (option === "All") {
        params.delete(groupKey);
        router.push(`?${params.toString()}`);
        return;
      }

      // (b) 토글
      if (current.includes(option)) {
        // 이미 있으면 제거
        const next = current.filter((v) => v !== option);
        params.delete(groupKey);
        next.forEach((v) => params.append(groupKey, v));
      } else {
        // 없으면 추가
        params.append(groupKey, option);
      }

      router.push(`?${params.toString()}`);
      return;
    }

    // 2) 단일 선택
    if (option === "All") {
      params.delete(groupKey);
    } else {
      params.set(groupKey, option);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-6 pb-8">
      {characterFilters.map((group) => (
        <div key={group.key}>
          {/* Label */}
          <div className="mb-2 text-sm font-semibold text-white/80">{WORD_LABELS[group.key]}</div>

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
                  {LABEL_MAP[option] ?? option}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
