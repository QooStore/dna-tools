import FilterBar from "@/components/ui/FilterBar";
import DemonWedgeListClient from "./_components/DemonWedgeListClient";
import DemonWedgeSearchBar from "./_components/DemonWedgeSearchBar";

import { DEMON_WEDGE_FILTERS } from "@/config/demonWedgeFilters";
import { getAllDemonWedges } from "@/api/demonWedges";
import { getAdminMe } from "@/api/admin";

import { DemonWedgeListItem } from "@/domains/demonWedges/type";
import Link from "next/link";

export default async function DemonWedgesPage() {
  const wedges: DemonWedgeListItem[] = await getAllDemonWedges();
  const isAdmin = await getAdminMe();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Title */}
      <div className="relative mb-8 text-center">
        <h1 className="text-3xl font-bold">악마의 쐐기</h1>
        {isAdmin && (
          <Link
            href="/demon-wedges/new"
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
            + 쐐기 등록
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="mb-10">
        <FilterBar filters={DEMON_WEDGE_FILTERS} />
        <DemonWedgeSearchBar />
      </div>

      {/* List */}
      <DemonWedgeListClient allWedges={wedges} isAdmin={isAdmin} />
    </div>
  );
}
