import CharacterFilterBar from "@/components/characters/CharacterFilterBar";
import CharacterListClient from "@/components/characters/CharacterListClient";
import CharacterSearchBar from "@/components/characters/CharacterSearchBar";

import { CHARACTER_FILTERS } from "@/config/characterFilters";
import { getAllCharacters } from "@/lib/api/characters";

import { CharacterListItem } from "@/domains/characters/character";

export default async function CharactersPage() {
  const characters: CharacterListItem[] = await getAllCharacters();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">캐릭터</h1>
      </div>

      {/* Filters */}
      <div className="mb-10">
        <CharacterFilterBar characterFilters={CHARACTER_FILTERS} />
        <CharacterSearchBar />
      </div>

      {/* List */}
      <CharacterListClient allCharacters={characters} />
    </div>
  );
}
