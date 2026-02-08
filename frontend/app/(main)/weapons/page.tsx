import FilterBar from "@/components/ui/FilterBar";
import WeaponListClient from "./_components/WeaponListClient";
import WeaponSearchBar from "./_components/WeaponSearchBar";

import { WEAPON_FILTERS } from "@/config/weaponFilters";
import { getAllWeapons } from "@/api/weapons";
import { getAdminMe } from "@/api/admin";

import { WeaponListItem } from "@/domains/weapons/type";
import Link from "next/link";

export default async function WeaponsPage() {
  const weapons: WeaponListItem[] = await getAllWeapons();
  const isAdmin = await getAdminMe();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Title */}
      <div className="relative mb-8 text-center">
        <h1 className="text-3xl font-bold">무기</h1>
        {isAdmin && (
          <Link
            href="/weapons/new"
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
            + 무기 등록
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-10">
        <FilterBar filters={WEAPON_FILTERS} />
        <WeaponSearchBar />
      </div>

      {/* List */}
      <WeaponListClient allWeapons={weapons} isAdmin={isAdmin} />
    </div>
  );
}
