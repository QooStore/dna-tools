import CalculatorClient from "./_components/CalculatorClient";

import { getAllCharacters } from "@/api/characters";
import { getAllWeapons } from "@/api/weapons";
import { getAllDemonWedges } from "@/api/demonWedges";

import { CharacterListItem } from "@/domains/characters/types";
import { WeaponListItem } from "@/domains/weapons/type";
import { DemonWedgeListItem } from "@/domains/demonWedges/type";

const EXCLUDED_SLUGS = ["hellfire", "sibylle", "randy"];

export default async function CalculatorPage() {
  const [allCharacters, weapons, wedges]: [CharacterListItem[], WeaponListItem[], DemonWedgeListItem[]] =
    await Promise.all([getAllCharacters(), getAllWeapons(), getAllDemonWedges()]);

  const characters = allCharacters.filter((c) => !EXCLUDED_SLUGS.includes(c.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">대미지 계산기</h1>
        <p className="mt-2 text-sm text-white/60">
          위에서 캐릭터/무기/악마의 쐐기를 선택하면 아래 입력 폼에 자동으로 반영됩니다. (필요하면 직접 수정 가능)
        </p>
      </div>

      <CalculatorClient characters={characters} weapons={weapons} wedges={wedges} />
    </div>
  );
}
