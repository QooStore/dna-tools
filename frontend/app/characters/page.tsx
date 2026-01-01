import CharacterCard from "@/components/characters/CharacterCard";
import CharacterFilterBar from "@/components/characters/CharacterFilterBar";
import CharacterSearchBar from "@/components/characters/CharacterSearchBar";

import { CHARACTER_FILTERS } from "@/config/characterFilters";
import { CHARACTERS } from "@/config/characters";

export default function CharactersPage() {
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
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {CHARACTERS.map((character) => (
          <CharacterCard
            key={character.id}
            slug={character.slug}
            name={character.name}
            image={character.image}
            features={character.features}
            elementIcon={character.elementIcon}
          />
        ))}
      </div>
    </div>
  );
}
