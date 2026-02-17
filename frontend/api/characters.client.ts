import type { CharacterDetail } from "@/domains/characters/types";

/**
 * Client-side CharacterDetail fetcher with in-memory cache + inflight de-dup.
 * Uses NEXT_PUBLIC_API_URL (public env).
 */
const cache = new Map<string, CharacterDetail>();
const inflight = new Map<string, Promise<CharacterDetail>>();

export async function fetchCharacterDetailClient(slug: string): Promise<CharacterDetail> {
  if (!slug) {
    throw new Error("slug is required");
  }
  const cached = cache.get(slug);
  if (cached) return cached;

  const existing = inflight.get(slug);
  if (existing) return existing;

  const p = (async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/characters/${slug}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("캐릭터 상세 정보를 불러오는데 실패했습니다.");
    }

    const detail: CharacterDetail = await res.json();
    cache.set(slug, detail);
    return detail;
  })();

  inflight.set(slug, p);

  try {
    return await p;
  } finally {
    inflight.delete(slug);
  }
}

export function prefetchCharacterDetail(slug: string): void {
  if (!slug) return;
  if (cache.has(slug) || inflight.has(slug)) return;
  // fire and forget
  void fetchCharacterDetailClient(slug).catch(() => {});
}

export function clearCharacterDetailCache(): void {
  cache.clear();
  inflight.clear();
}
