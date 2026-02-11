import { getAllCharacters } from "@/api/characters";
import { getAllWeapons } from "@/api/weapons";
import { getAllDemonWedges } from "@/api/demonWedges";
import CalculatorClient from "./_components/CalculatorClient";

export default async function CalculatorPage() {
  const [characters, weapons, demonWedges] = await Promise.all([
    getAllCharacters(),
    getAllWeapons(),
    getAllDemonWedges(),
  ]);

  return (
    <div className="mx-auto max-w-[1600px]">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold">데미지 계산기</h1>
        <p className="mt-2 text-sm text-white/40">두 빌드의 최종 대미지 배율을 비교합니다</p>
      </div>

      <CalculatorClient referenceData={{ characters, weapons, demonWedges }} />
    </div>
  );
}
