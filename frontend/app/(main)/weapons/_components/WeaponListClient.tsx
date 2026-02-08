"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import WeaponCard from "./WeaponCard";

import { WeaponListItem } from "@/domains/weapons/type";
import { buildSearchableText } from "@/lib/utils";
import { deleteWeapon } from "@/api/admin";

type Props = {
  allWeapons: WeaponListItem[];
  isAdmin?: boolean;
};

export default function WeaponListClient({ allWeapons, isAdmin = false }: Props) {
  const searchParams = useSearchParams();
  const [weapons, setWeapons] = useState(allWeapons);

  // --- URL 값 읽기 ---
  const category = searchParams.get("category");
  const weaponType = searchParams.get("weaponType");
  const attackType = searchParams.get("attackType");
  const element = searchParams.get("element");
  const keyword = searchParams.get("keyword");

  // --- 필터링 ---
  const filteredWeapons = useMemo(() => {
    return weapons.filter((w) => {
      // 카테고리
      if (category && w.category !== category) return false;

      // 무기 타입
      if (weaponType && w.weaponType !== weaponType) return false;

      // 공격 타입
      if (attackType && w.attackType !== attackType) return false;

      // 속성
      if (element) {
        if (element === "none") {
          if (w.element != null) return false;
        } else {
          if (w.element !== element) return false;
        }
      }

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
  }, [weapons, category, weaponType, attackType, element, keyword]);

  // --- 무기 삭제 ---
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteWeapon(id);
      setWeapons((prev) => prev.filter((w) => w.id !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (filteredWeapons.length === 0) {
    return <div className="py-20 text-center text-gray-400">조건에 맞는 무기가 없습니다.</div>;
  }

  return (
    <div className="grid gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {filteredWeapons.map((weapon) => (
        <WeaponCard
          key={weapon.id}
          weapon={weapon}
          isAdmin={isAdmin}
          onDelete={() => handleDelete(weapon.id)}
        />
      ))}
    </div>
  );
}
