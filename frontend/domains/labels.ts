export const STAT_LABELS: Record<string, string> = {
  attack: "공격력",
  hp: "체력",
  defense: "방어력",
  maxMentality: "최대 정신력",
  resolve: "필사",
  morale: "격양",
};

export const WEAPON_LABELS: Record<string, string> = {
  category: "카테고리",
  type: "무기 타입",
  attackType: "공격 타입",
  attack: "공격력",
  critRate: "치명타 확률",
  critDamage: "치명타 피해",
  attackSpeed: "공격 속도",
  triggerProbability: "발동 확률",
};

export const ATTACK_TYPE_LABELS: Record<string, string> = {
  slash: "베기",
  spike: "관통",
  smash: "진동",
};

export const ELEMENT_LABELS: Record<string, string> = {
  umbro: "어둠",
  hydro: "물",
  anemo: "바람",
  lumino: "빛",
  pyro: "불",
  electro: "번개",
};

export const WEAPON_CATEGORY_LABELS: Record<string, string> = {
  sword: "한손검",
  katana: "대도",
  dualBlades: "쌍도",
  greatsword: "대검",
  polearm: "장병기",
  whipsword: "칼날 채찍",
  pistol: "권총",
  assaultRifle: "돌격소총",
  bow: "활",
  shotgun: "산탄총",
  grenadeLauncher: "핸드 캐논",
  dualPistols: "쌍권총",
};

export const FEATURE_LABELS: Record<string, string> = {
  dps: "딜러",
  support: "서포터",
  heal: "치료",
  sanityRecovery: "정신력 회복",
  consonanceWeapon: "동조 무기",
  weaponDmg: "무기 대미지",
  skillDmg: "스킬 대미지",
  summon: "소환물",
  control: "제어",
  shield: "실드",
  maxHp: "최대 HP",
  def: "방어",
  maxSanity: "최대 정신력",
};

export const WORD_LABELS: Record<string, string> = {
  element: "속성",
  meleeProficiency: "근거리 무기 마스터리",
  rangedProficiency: "원거리 무기 마스터리",
  feature: "특성",
};

export const LABELS = {
  stat: STAT_LABELS,
  weapon: WEAPON_LABELS,
  element: ELEMENT_LABELS,
  weaponCategory: WEAPON_CATEGORY_LABELS,
  feature: FEATURE_LABELS,
  word: WORD_LABELS,
};
