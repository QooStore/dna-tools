// fields.ts에서 정적으로 사용하는 옵션 (게임 데이터로 안정적)
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

// 하드코딩 유지 (DB 이관 제외)
export const EQUIP_TYPE_OPTIONS = [
  { value: "character", label: "캐릭터" },
  { value: "meleeWeapon", label: "근거리 무기" },
  { value: "rangedWeapon", label: "원거리 무기" },
  { value: "meleeConsonanceWeapon", label: "근거리 동조 무기" },
  { value: "rangedConsonanceWeapon", label: "원거리 동조 무기" },
] as const;
