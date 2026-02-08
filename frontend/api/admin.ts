"use server";
import { cookies } from "next/headers";

import { CharacterSaveRequest } from "@/domains/characterForm";
import { WeaponSaveRequest } from "@/domains/weaponForm";
import { DemonWedgeSaveRequest } from "@/domains/demonWedgeForm";

async function authHeaders(): Promise<Record<string, string>> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");
  return adminToken ? { Cookie: `admin_token=${adminToken.value}` } : {};
}

export async function getAdminMe(): Promise<boolean> {
  const headers = await authHeaders();
  if (!headers.Cookie) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/me`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
}

export async function deleteCharacter(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/characters/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    throw new Error("캐릭터 삭제 실패");
  }
}

export async function adminSaveCharacter(payload: CharacterSaveRequest, slug?: string) {
  const url = slug
    ? `${process.env.NEXT_PUBLIC_API_URL}/lee/characters/${slug}`
    : `${process.env.NEXT_PUBLIC_API_URL}/lee/characters`;

  const method = slug ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function adminSaveWeapon(payload: WeaponSaveRequest, slug?: string) {
  const url = slug
    ? `${process.env.NEXT_PUBLIC_API_URL}/lee/weapons/${slug}`
    : `${process.env.NEXT_PUBLIC_API_URL}/lee/weapons`;

  const method = slug ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function deleteWeapon(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/weapons/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    throw new Error("무기 삭제 실패");
  }
}

export async function adminSaveDemonWedge(payload: DemonWedgeSaveRequest, slug?: string) {
  const url = slug
    ? `${process.env.NEXT_PUBLIC_API_URL}/lee/demon-wedges/${slug}`
    : `${process.env.NEXT_PUBLIC_API_URL}/lee/demon-wedges`;

  const method = slug ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...(await authHeaders()) },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}

export async function deleteDemonWedge(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/demon-wedges/${id}`, {
    method: "DELETE",
    headers: await authHeaders(),
  });

  if (!res.ok) {
    throw new Error("악마의 쐐기 삭제 실패");
  }
}
