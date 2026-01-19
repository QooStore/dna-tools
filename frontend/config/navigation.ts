export const NAV_ITEMS = [
  { label: "캐릭터", href: "/characters", image: "/images/home/character_icon.png", section: "database" },
  { label: "무기", href: "/weapons", image: "/images/home/weapons_icon.png", section: "database" },
  { label: "악마의 쐐기", href: "/demon-wedges", image: "/images/home/demonWedges_icon.png", section: "database" },
  {
    label: "데미지 계산기",
    href: "/calculator",
    image: "/images/home/calculator_icon.png",
    section: "tools",
    highlight: true,
  },
];

export const ELEMENT_OPTIONS = [
  { value: "pyro", label: "불" },
  { value: "hydro", label: "물" },
  { value: "electro", label: "번개" },
  { value: "anemo", label: "바람" },
  { value: "lumino", label: "빛" },
  { value: "umbro", label: "어둠" },
];

export const MELEE_PROFICIENCY_OPTIONS = [
  { value: "dualBlades", label: "쌍도" },
  { value: "greatsword", label: "대검" },
  { value: "katana", label: "대도" },
  { value: "polearm", label: "장병기" },
  { value: "sword", label: "한손검" },
  { value: "whipsword", label: "칼날 채찍" },
];

export const RANGED_PROFICIENCY_OPTIONS = [
  { value: "assaultRifle", label: "돌격소총" },
  { value: "bow", label: "활" },
  { value: "dualPistols", label: "쌍권총" },
  { value: "grenadeLauncher", label: "핸드 캐논" },
  { value: "pistol", label: "권총" },
  { value: "shotgun", label: "산탄총" },
];
