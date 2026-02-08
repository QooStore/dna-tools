// --- 악마의 쐐기 목록 ---

export interface DemonWedgeStat {
  statType: string;
  statTypeLabel: string;
  value: number;
}

export interface DemonWedgeListItem {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  rarity: number;
  resistance: number;
  tendency: string;
  tendencyLabel: string;
  equipType: string;
  equipTypeLabel: string;
  element: string | null;
  elementLabel: string | null;
  isKukulkan: boolean;
  effectDescription: string | null;
  stats: DemonWedgeStat[];
}

// --- 악마의 쐐기 상세 (수정 폼용) ---

export interface DemonWedgeDetailStat {
  statType: string;
  value: number;
}

export interface DemonWedgeDetail {
  id: number;
  slug: string;
  name: string;
  image: string | null;
  rarity: number;
  resistance: number;
  tendency: string;
  equipType: string;
  element: string | null;
  isKukulkan: boolean;
  effectDescription: string | null;
  stats: DemonWedgeDetailStat[];
}
