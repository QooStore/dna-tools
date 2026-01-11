import { WEAPON_LABELS } from "../labels";

export type WeaponCategory = "melee" | "ranged";

export type MeleeWeaponType = "greatsword" | "sword" | "dualBlades" | "katana" | "polearm" | "whipsword";

export type RangedWeaponType = "bow" | "grenadeLauncher" | "dualPistols" | "assaultRifle" | "pistol" | "shotgun";

export type WeaponStatKey = keyof typeof WEAPON_LABELS;

export type ConsonanceWeaponStats =
  | {
      category: "melee";
      type: MeleeWeaponType;
      attackType: "slash" | "spike" | "smash";

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
    }
  | {
      category: "ranged";
      type: RangedWeaponType;
      attackType: "slash" | "spike" | "smash";

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
    };
