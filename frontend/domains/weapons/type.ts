export type WeaponCategory = "melee" | "ranged";

export type MeleeWeaponType = "greatsword" | "sword" | "dualBlades" | "katana" | "polearm" | "whipsword";

export type RangedWeaponType = "bow" | "grenadeLauncher" | "dualPistols" | "assaultRifle" | "pistol" | "shotgun";

export type ConsonanceWeaponStats =
  | {
      category: "melee";
      categoryLabel: string;
      weaponType: MeleeWeaponType;
      weaponTypeLabel: string;
      attackType: "slash" | "spike" | "smash";
      attackTypeLabel: string;

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
      itemCode: string | null;
    }
  | {
      category: "ranged";
      categoryLabel: string;
      weaponType: RangedWeaponType;
      weaponTypeLabel: string;
      attackType: "slash" | "spike" | "smash";
      attackTypeLabel: string;

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
      multishot: number;
      magCapacity: number;
      itemCode: string | null;
    };

export interface WeaponConditionalEffect {
  id: number;
  statType: string;
  value: number;
}

// --- 무기 목록 ---
export interface WeaponListItem {
  id: number;
  slug: string;
  name: string;
  image: string | null;

  // 분류
  category: WeaponCategory;
  categoryLabel: string;
  weaponType: string;
  weaponTypeLabel: string;
  attackType: string;
  attackTypeLabel: string;
  element: string | null;
  elementLabel: string | null;

  // 공통 스탯
  attack: number;
  critRate: number;
  critDamage: number;
  attackSpeed: number;
  triggerProbability: number;

  // 근접 전용
  chargeAttackSpeed: number | null;
  fallAttackSpeed: number | null;

  // 원거리 전용
  multishot: number | null;
  maxAmmo: number | null;
  magCapacity: number | null;
  ammoConversionRate: number | null;

  // 패시브
  passiveStat: string | null;
  passiveStatLabel: string | null;
  passiveValue: number | null;

  // 액티브
  activeSkillDescription: string | null;

  // 아이템 코드
  itemCode: string | null;

  // 조건부 효과
  conditionalEffects: WeaponConditionalEffect[];
}

// --- 무기 상세 (수정 폼용) ---
export interface WeaponDetail {
  id: number;
  slug: string;
  name: string;
  image: string | null;

  category: string;
  weaponType: string;
  attackType: string;
  element: string | null;

  attack: number;
  critRate: number;
  critDamage: number;
  attackSpeed: number;
  triggerProbability: number;

  chargeAttackSpeed: number | null;
  fallAttackSpeed: number | null;

  multishot: number | null;
  maxAmmo: number | null;
  magCapacity: number | null;
  ammoConversionRate: number | null;

  passiveStat: string | null;
  passiveValue: number | null;

  activeSkillDescription: string | null;
}
