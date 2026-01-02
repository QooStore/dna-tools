// frontend/lib/api/characters.ts
import { getMockCharacterBySlug } from "@/mocks/characters";
import { CharacterDetail } from "@/types/character";

export async function getCharacterDetail(slug: string): Promise<CharacterDetail> {
  const character = getMockCharacterBySlug(slug);

  if (!character) {
    throw new Error("Character not found");
  }

  return character;
}
