import { WEAPON_LABELS } from "../labels";

export type WeaponCategory = "근접" | "원거리";

export type MeleeWeaponType = "대검" | "한손검" | "쌍도" | "대도" | "장병기" | "칼날 채찍";

export type RangedWeaponType = "활" | "핸드 캐논" | "쌍권총" | "돌격소총" | "권총" | "산탄총";

export type WeaponStatKey = keyof typeof WEAPON_LABELS;

export type ConsonanceWeaponStats =
  | {
      category: "근접";
      type: MeleeWeaponType;
      attackType: "베기" | "관통" | "진동";

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
    }
  | {
      category: "원거리";
      type: RangedWeaponType;
      attackType: "베기" | "관통" | "진동";

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
    };
