export interface WeaponFormState {
  slug: string;
  name: string;
  image: string;

  // 분류
  category: string;
  weaponType: string;
  attackType: string;
  element: string;

  // 공통 스탯
  attack: number;
  critRate: number;
  critDamage: number;
  attackSpeed: number;
  triggerProbability: number;

  // 근접 전용
  chargeAttackSpeed: number;
  fallAttackSpeed: number;

  // 원거리 전용
  multishot: number;
  maxAmmo: number;
  magCapacity: number;
  ammoConversionRate: number;

  // 패시브 스킬
  passiveStat: string;
  passiveValue: number;

  // 액티브 스킬
  activeSkillDescription: string;
}

export interface WeaponSaveRequest {
  slug: string;
  name: string;
  image: string;

  category: string;
  weaponType: string;
  attackType: string;
  element?: string;

  attack: number;
  critRate: number;
  critDamage: number;
  attackSpeed: number;
  triggerProbability: number;

  chargeAttackSpeed?: number;
  fallAttackSpeed?: number;

  multishot?: number;
  maxAmmo?: number;
  magCapacity?: number;
  ammoConversionRate?: number;

  passiveStat?: string;
  passiveValue?: number;

  activeSkillDescription?: string;
}
