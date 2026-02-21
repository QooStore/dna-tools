"use server";
import { DemonWedgeListItem, DemonWedgeDetail } from "@/domains/demonWedges/type";

export async function getAllDemonWedges(): Promise<DemonWedgeListItem[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/demon-wedges`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("악마의 쐐기 목록을 불러오는데 실패했습니다.");
  }

  return res.json();
}

export async function getDemonWedgeDetail(slug: string): Promise<DemonWedgeDetail> {
  const res = await fetch(`${process.env.BACKEND_URL}/api/demon-wedges/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("악마의 쐐기 상세 정보를 불러오는데 실패했습니다.");
  }

  return res.json();
}
