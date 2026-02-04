import FilterBar from "@/components/ui/FilterBar";
import CharacterListClient from "@/components/characters/CharacterListClient";
import CharacterSearchBar from "@/components/characters/CharacterSearchBar";

import { CHARACTER_FILTERS } from "@/config/characterFilters";
import { getAllCharacters } from "@/lib/api/characters";

import { CharacterListItem } from "@/domains/characters/character";
import { getAdminMe } from "@/lib/api/admin";
import Link from "next/link";

export default async function CharactersPage() {
  const characters: CharacterListItem[] = await getAllCharacters();
  const isAdmin = await getAdminMe();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Title */}
      <div className="relative mb-8 text-center">
        <h1 className="text-3xl font-bold">캐릭터</h1>
        {/* 관리자 등록 버튼 */}
        {isAdmin && (
          <Link
            href="/characters/new"
            className="
              absolute right-0 top-1/2 -translate-y-1/2
              px-4 py-2
              text-sm font-medium
              text-cyan-300
              border border-cyan-400/40
              rounded-lg
              hover:bg-cyan-400/10
              hover:border-cyan-300
              transition
          "
          >
            + 캐릭터 등록
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-10">
        <FilterBar filters={CHARACTER_FILTERS} />
        <CharacterSearchBar />
      </div>

      {/* List */}
      <CharacterListClient allCharacters={characters} isAdmin={isAdmin} />
    </div>
  );
}
