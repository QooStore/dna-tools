"use server";
import { cookies } from "next/headers";

export async function getAdminMe(): Promise<boolean> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token");

  // 쿠키 자체가 없으면 바로 false
  if (!adminToken) return false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/me`, {
      method: "GET",
      headers: {
        // 서버에 쿠키 전달
        Cookie: `admin_token=${adminToken.value}`,
      },
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
  });

  if (!res.ok) {
    throw new Error("캐릭터 삭제 실패");
  }
}

export async function adminSaveCharacter(payload: any, slug?: string) {
  const url = slug
    ? `${process.env.NEXT_PUBLIC_API_URL}/lee/characters/${slug}`
    : `${process.env.NEXT_PUBLIC_API_URL}/lee/characters`;

  const method = slug ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }
}
