import type { FilterGroup } from "@/config/characterFilters";

export const DEMON_WEDGE_FILTERS: FilterGroup[] = [
  {
    field: "rarity",
    title: "희귀도",
    options: [
      { value: "All", label: "전체" },
      { value: "5", label: "★5" },
      { value: "4", label: "★4" },
      { value: "3", label: "★3" },
      { value: "2", label: "★2" },
    ],
  },
  {
    field: "equipType",
    title: "착용 제한",
    options: [
      { value: "All", label: "전체" },
      { value: "character", label: "캐릭터" },
      { value: "meleeWeapon", label: "근거리 무기" },
      { value: "rangedWeapon", label: "원거리 무기" },
      { value: "consonanceWeapon", label: "동조 무기" },
    ],
  },
  {
    field: "tendency",
    title: "성향",
    options: [
      { value: "All", label: "전체" },
      { value: "triangle", label: "◬" },
      { value: "diamond", label: "◊" },
      { value: "crescent", label: "☽" },
      { value: "circle", label: "⊙" },
    ],
  },
  {
    field: "element",
    title: "속성",
    options: [
      { value: "All", label: "전체" },
      { value: "none", label: "무속성" },
      { value: "pyro", label: "불" },
      { value: "hydro", label: "물" },
      { value: "electro", label: "번개" },
      { value: "anemo", label: "바람" },
      { value: "lumino", label: "빛" },
      { value: "umbro", label: "어둠" },
    ],
  },
];
