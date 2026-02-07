import FilterBar from "@/components/ui/FilterBar";
import WeaponListClient from "./_components/WeaponListClient";
import WeaponSearchBar from "./_components/WeaponSearchBar";

import { WEAPON_FILTERS } from "@/config/weaponFilters";
import { getAllWeapons } from "@/api/weapons";

import { WeaponListItem } from "@/domains/weapons/type";

export default async function WeaponsPage() {
  const weapons: WeaponListItem[] = await getAllWeapons();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Title */}
      <div className="relative mb-8 text-center">
        <h1 className="text-3xl font-bold">무기</h1>
      </div>

      {/* Filters */}
      <div className="mb-10">
        <FilterBar filters={WEAPON_FILTERS} />
        <WeaponSearchBar />
      </div>

      {/* List */}
      <WeaponListClient allWeapons={weapons} />
    </div>
  );
}
