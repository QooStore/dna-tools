import { WeaponStatKey } from "@/domains/weapons/type";

const PERCENT_KEYS: WeaponStatKey[] = ["critRate", "critDamage", "triggerProbability"] as const;

const MULTIPLIER_KEYS: WeaponStatKey[] = ["attackSpeed"] as const;

export function formatWeaponStat(key: WeaponStatKey, value: string | number): string | number {
  if (typeof value !== "number") return value;

  if (MULTIPLIER_KEYS.includes(key)) {
    return `${value * 100}%`;
  }

  if (PERCENT_KEYS.includes(key)) {
    return `${value}%`;
  }

  return value;
}
