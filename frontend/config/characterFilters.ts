export type FilterGroup = {
  field: string;
  title: string;
  options: {
    value: string;
    label: string;
  }[];
};

export const CHARACTER_FILTERS: FilterGroup[] = [
  {
    field: "element",
    title: "속성",
    options: [
      { value: "All", label: "전체" },
      { value: "hydro", label: "물" },
      { value: "pyro", label: "불" },
      { value: "anemo", label: "전체" },
      { value: "electro", label: "번개" },
      { value: "lumino", label: "빛" },
      { value: "umbro", label: "어둠" },
    ],
  },
  {
    field: "meleeProficiency",
    title: "근거리 무기 마스터리",
    options: [
      { value: "All", label: "전체" },
      { value: "sword", label: "한손검" },
      { value: "dualBlades", label: "쌍도" },
      { value: "greatsword", label: "대검" },
      { value: "polearm", label: "장병기" },
      { value: "katana", label: "대도" },
      { value: "whipsword", label: "칼날 채찍" },
    ],
  },
  {
    field: "rangedProficiency",
    title: "원거리 무기 마스터리",
    options: [
      { value: "All", label: "전체" },
      { value: "pistol", label: "권총" },
      { value: "assaultRifle", label: "돌격소총" },
      { value: "bow", label: "활" },
      { value: "shotgun", label: "산탄총" },
      { value: "dualPistols", label: "쌍권총" },
      { value: "grenadeLauncher", label: "핸드 캐논" },
    ],
  },
  {
    field: "feature",
    title: "특성",
    options: [
      { value: "All", label: "전체" },
      { value: "dps", label: "딜러" },
      { value: "support", label: "서포터" },
      { value: "heal", label: "치료" },
      { value: "sanityRecovery", label: "정신력 회복" },
      { value: "consonanceWeapon", label: "동조 무기" },
      { value: "weaponDmg", label: "무기 대미지" },
      { value: "skillDmg", label: "스킬 대미지" },
      { value: "summon", label: "소환물" },
      { value: "control", label: "제어" },
      { value: "shield", label: "실드" },
      { value: "maxHp", label: "최대 HP" },
      { value: "def", label: "방어" },
      { value: "maxSanity", label: "최대 정신력" },
    ],
  },
];
