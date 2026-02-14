export const CHARACTER_STATS_OPTIONS = [
  { value: "attack", label: "공격력" },
  { value: "hp", label: "체력" },
  { value: "defense", label: "방어력" },
  { value: "maxMentality", label: "마나" },
  { value: "resolve", label: "필사" },
  { value: "morale", label: "격양" },
] as const;

export const ELEMENT_OPTIONS = [
  { value: "pyro", label: "불" },
  { value: "hydro", label: "물" },
  { value: "electro", label: "번개" },
  { value: "anemo", label: "바람" },
  { value: "lumino", label: "빛" },
  { value: "umbro", label: "어둠" },
] as const;

export const MELEE_PROFICIENCY_OPTIONS = [
  { value: "dualBlades", label: "쌍도" },
  { value: "greatsword", label: "대검" },
  { value: "katana", label: "대도" },
  { value: "polearm", label: "장병기" },
  { value: "sword", label: "한손검" },
  { value: "whipsword", label: "칼날 채찍" },
] as const;

export const RANGED_PROFICIENCY_OPTIONS = [
  { value: "assaultRifle", label: "돌격소총" },
  { value: "bow", label: "활" },
  { value: "dualPistols", label: "쌍권총" },
  { value: "grenadeLauncher", label: "핸드 캐논" },
  { value: "pistol", label: "권총" },
  { value: "shotgun", label: "산탄총" },
] as const;

export const WEAPON_PROFICIENCY_OPTIONS = [...MELEE_PROFICIENCY_OPTIONS, ...RANGED_PROFICIENCY_OPTIONS] as const;

export const ATTACK_TYPE_OPTIONS = [
  { value: "slash", label: "베기" },
  { value: "smash", label: "진동" },
  { value: "spike", label: "관통" },
] as const;

export const WEAPON_TYPE_OPTIONS = [
  { value: "melee", label: "근거리" },
  { value: "ranged", label: "원거리" },
] as const;

export const FEATURE_OPTIONS = [
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
];

export const SKILL_TYPE_OPTIONS = [
  { value: "damage", label: "대미지" },
  { value: "buff", label: "버프" },
  { value: "passive", label: "패시브" },
  { value: "heal", label: "치료" },
];

export const PASSIVE_UPGRADE_TYPE_OPTIONS = [
  { value: "STAT", label: "스탯 강화" },
  { value: "ABILITY", label: "능력" },
  { value: "COOP", label: "협력 동료" },
] as const;

export const TARGET_STAT_OPTIONS = [
  { value: "attack_per", label: "공격력%" },
  { value: "skillEfficiency", label: "스킬 효율" },
  { value: "skillDuration", label: "스킬 지속" },
  { value: "skillRange", label: "스킬 범위" },
  { value: "skillDmg", label: "스킬 대미지" },
  { value: "weaponDmg", label: "무기 대미지" },
  { value: "attackSpeed", label: "공격 속도" },
  { value: "skillIntensity", label: "스킬 위력" },
] as const;

export const EQUIP_TYPE_OPTIONS = [
  { value: "character", label: "캐릭터" },
  { value: "meleeWeapon", label: "근거리 무기" },
  { value: "rangedWeapon", label: "원거리 무기" },
  { value: "consonanceWeapon", label: "동조 무기" },
] as const;

export const TENDENCY_OPTIONS = [
  { value: "triangle", label: "◬" },
  { value: "diamond", label: "◊" },
  { value: "crescent", label: "☽" },
  { value: "circle", label: "⊙" },
] as const;

export const RARITY_OPTIONS = [
  { value: "2", label: "★2" },
  { value: "3", label: "★3" },
  { value: "4", label: "★4" },
  { value: "5", label: "★5" },
] as const;
