import { CharacterDetail, CharacterListItem } from "@/domains/characters/character";

export async function getCharacterDetail(slug: string): Promise<CharacterDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/characters/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("캐릭터 정보를 불러오는데 실패했습니다.");
  }

  return res.json();
}

export async function getAllCharacters(): Promise<CharacterListItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/characters`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("캐릭터 목록을 불러오는데 실패했습니다.");
  }

  return res.json();
}

export async function deleteCharacter(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/characters/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("캐릭터 삭제 실패");
  }
}
