"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

import WeaponCard from "./WeaponCard";

import { WeaponListItem } from "@/domains/weapons/type";
import { buildSearchableText } from "@/lib/utils";

type Props = {
  allWeapons: WeaponListItem[];
};

export default function WeaponListClient({ allWeapons }: Props) {
  const searchParams = useSearchParams();

  // --- URL 값 읽기 ---
  const category = searchParams.get("category");
  const weaponType = searchParams.get("weaponType");
  const attackType = searchParams.get("attackType");
  const element = searchParams.get("element");
  const keyword = searchParams.get("keyword");

  // --- 필터링 ---
  const filteredWeapons = useMemo(() => {
    return allWeapons.filter((w) => {
      // 카테고리
      if (category && w.category !== category) return false;

      // 무기 타입
      if (weaponType && w.weaponType !== weaponType) return false;

      // 공격 타입
      if (attackType && w.attackType !== attackType) return false;

      // 속성
      if (element && w.element !== element) return false;

      // 검색어
      if (keyword) {
        const q = keyword.trim().toLowerCase();

        const searchableText = buildSearchableText([
          w.name,
          w.categoryLabel,
          w.weaponType,
          w.weaponTypeLabel,
          w.attackType,
          w.attackTypeLabel,
          w.element ?? undefined,
          w.elementLabel ?? undefined,
          w.passiveStatLabel ?? undefined,
          w.activeSkillDescription ?? undefined,
        ]);

        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [allWeapons, category, weaponType, attackType, element, keyword]);

  if (filteredWeapons.length === 0) {
    return <div className="py-20 text-center text-gray-400">조건에 맞는 무기가 없습니다.</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {filteredWeapons.map((weapon) => (
        <WeaponCard key={weapon.id} weapon={weapon} />
      ))}
    </div>
  );
}
