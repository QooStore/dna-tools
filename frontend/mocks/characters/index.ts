import { BERENICA } from "./berenica";

export const MOCK_CHARACTERS = [BERENICA];

export function getMockCharacterBySlug(slug: string) {
  return MOCK_CHARACTERS.find((c) => c.slug === slug);
}
