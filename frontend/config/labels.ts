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
  weaponType: "무기 타입",
  attackType: "공격 타입",
  attack: "공격력",
  critRate: "치명타 확률",
  critDamage: "치명타 피해",
  attackSpeed: "공격 속도",
  triggerProbability: "발동 확률",
  chargeAttackSpeed: "차지 공격 속도",
  fallAttackSpeed: "낙하 공격 속도",
  multiShot: "다중 사격",
  maxAmmo: "최대 탄약",
  ammoConversionRate: "탄약 전환율",
};

export const LABELS = {
  stat: STAT_LABELS,
  weapon: WEAPON_LABELS,
};
