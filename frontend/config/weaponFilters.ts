import type { FilterGroup } from "@/config/characterFilters";

export const WEAPON_FILTERS: FilterGroup[] = [
  {
    field: "category",
    title: "카테고리",
    options: [
      { value: "All", label: "전체" },
      { value: "melee", label: "근거리" },
      { value: "ranged", label: "원거리" },
    ],
  },
  {
    field: "weaponType",
    title: "무기 타입",
    options: [
      { value: "All", label: "전체" },
      // 근거리
      { value: "sword", label: "한손검" },
      { value: "dualBlades", label: "쌍도" },
      { value: "greatsword", label: "대검" },
      { value: "polearm", label: "장병기" },
      { value: "katana", label: "대도" },
      { value: "whipsword", label: "칼날 채찍" },
      // 원거리
      { value: "pistol", label: "권총" },
      { value: "assaultRifle", label: "돌격소총" },
      { value: "bow", label: "활" },
      { value: "shotgun", label: "산탄총" },
      { value: "dualPistols", label: "쌍권총" },
      { value: "grenadeLauncher", label: "핸드 캐논" },
    ],
  },
  {
    field: "attackType",
    title: "공격 타입",
    options: [
      { value: "All", label: "전체" },
      { value: "slash", label: "베기" },
      { value: "smash", label: "진동" },
      { value: "spike", label: "관통" },
    ],
  },
  {
    field: "element",
    title: "속성",
    options: [
      { value: "All", label: "전체" },
      { value: "hydro", label: "물" },
      { value: "pyro", label: "불" },
      { value: "anemo", label: "바람" },
      { value: "electro", label: "번개" },
      { value: "lumino", label: "빛" },
      { value: "umbro", label: "어둠" },
      { value: "none", label: "무속성" },
    ],
  },
];
