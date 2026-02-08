"use server";
import { WeaponListItem, WeaponDetail } from "@/domains/weapons/type";

export async function getAllWeapons(): Promise<WeaponListItem[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weapons`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("무기 목록을 불러오는데 실패했습니다.");
  }

  return res.json();
}

export async function getWeaponDetail(slug: string): Promise<WeaponDetail> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/weapons/${slug}`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("무기 상세 정보를 불러오는데 실패했습니다.");
  }

  return res.json();
}
