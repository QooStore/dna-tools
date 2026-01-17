"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import CharacterCard from "@/components/characters/CharacterCard";

import { CharacterListItem } from "@/domains/characters/character";
import { buildSearchableText } from "@/lib/utils";
import { deleteCharacter } from "@/lib/api/admin";

type Props = {
  allCharacters: CharacterListItem[];
  isAdmin: boolean;
};

export default function CharacterListClient({ allCharacters, isAdmin }: Props) {
  const searchParams = useSearchParams();

  // 관리자 삭제 대비
  const [characters, setCharacters] = useState(allCharacters);

  // --- URL 값 읽기 ---
  const element = searchParams.get("element");
  const keyword = searchParams.get("keyword");
  const meleeProficiency = searchParams.get("meleeProficiency");
  const rangedProficiency = searchParams.get("rangedProficiency");
  const features = searchParams.getAll("feature");

  // --- 필터링 ---
  const filteredCharacters = useMemo(() => {
    return characters.filter((c) => {
      // 속성
      if (element && c.elementCode !== element) return false;

      // 근거리 숙련
      if (meleeProficiency && c.meleeProficiency !== meleeProficiency) {
        return false;
      }

      // 원거리 숙련
      if (rangedProficiency && c.rangedProficiency !== rangedProficiency) {
        return false;
      }

      // 특성 (AND 조건)
      if (features.length > 0) {
        const hasAllFeatures = features.every((f) => c.features.some((cf) => cf.featureCode === f));
        if (!hasAllFeatures) return false;
      }

      // 검색어
      if (keyword) {
        const q = keyword.trim().toLowerCase();

        const searchableText = buildSearchableText(
          [c.name],
          [c.elementCode, c.meleeProficiency, c.rangedProficiency, ...c.features.map((f) => f.featureCode)],
        );

        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [characters, element, meleeProficiency, rangedProficiency, features, keyword]);

  // --- 캐릭터 목록 삭제 ---
  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteCharacter(id);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      alert("삭제에 실패했습니다.");
    }
  };

  if (filteredCharacters.length === 0) {
    return <div className="py-20 text-center text-gray-400">조건에 맞는 캐릭터가 없습니다.</div>;
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {filteredCharacters.map((character) => (
        <CharacterCard
          key={character.id}
          slug={character.slug}
          name={character.name}
          listImage={character.listImage}
          features={character.features}
          elementImage={character.elementImage}
          onDelete={() => handleDelete(character.id)} // 관리자일 때만 노출
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}
