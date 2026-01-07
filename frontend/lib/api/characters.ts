import { CharacterDetail } from "@/domains/characters/character";

export async function getCharacterDetail(slug: string): Promise<CharacterDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/characters/${slug}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("캐릭터 정보를 불러오는데 실패했습니다.");
  }

  return res.json();
}
