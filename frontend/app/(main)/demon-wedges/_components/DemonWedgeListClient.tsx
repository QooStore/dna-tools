"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import DemonWedgeCard from "./DemonWedgeCard";

import { DemonWedgeListItem } from "@/domains/demonWedges/type";
import { buildSearchableText } from "@/lib/utils";
import { deleteDemonWedge } from "@/api/admin";

type Props = {
  allWedges: DemonWedgeListItem[];
  isAdmin?: boolean;
};

export default function DemonWedgeListClient({ allWedges, isAdmin = false }: Props) {
  const searchParams = useSearchParams();
  const [wedges, setWedges] = useState(allWedges);

  const rarity = searchParams.get("rarity");
  const equipType = searchParams.get("equipType");
  const tendency = searchParams.get("tendency");
  const element = searchParams.get("element");
  const keyword = searchParams.get("keyword");

  const filteredWedges = useMemo(() => {
    return wedges.filter((w) => {
      if (rarity && String(w.rarity) !== rarity) return false;
      if (equipType && w.equipType !== equipType) return false;
      if (tendency && w.tendency !== tendency) return false;

      if (element) {
        if (element === "none") {
          if (w.element != null) return false;
        } else {
          if (w.element !== element) return false;
        }
      }

      if (keyword) {
        const q = keyword.trim().toLowerCase();
        const searchableText = buildSearchableText([
          w.name,
          w.equipTypeLabel,
          w.tendencyLabel,
          w.elementLabel ?? undefined,
          w.effectDescription ?? undefined,
          ...w.stats.map((s) => s.statTypeLabel),
        ]);
        if (!searchableText.includes(q)) return false;
      }

      return true;
    });
  }, [wedges, rarity, equipType, tendency, element, keyword]);

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteDemonWedge(id);
      setWedges((prev) => prev.filter((w) => w.id !== id));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  if (filteredWedges.length === 0) {
    return <div className="py-20 text-center text-gray-400">조건에 맞는 악마의 쐐기가 없습니다.</div>;
  }

  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
      {filteredWedges.map((wedge) => (
        <DemonWedgeCard
          key={wedge.id}
          wedge={wedge}
          isAdmin={isAdmin}
          onDelete={() => handleDelete(wedge.id)}
        />
      ))}
    </div>
  );
}
