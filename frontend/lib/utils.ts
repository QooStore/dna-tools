import { WeaponStatKey } from "@/domains/weapons/type";
import { LABELS } from "@/domains/labels";

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

/** code값들의 한글 반환 */
function collectLabels(codes: (string | undefined)[]) {
  return codes
    .filter(Boolean)
    .map(String)
    .flatMap((v) => {
      return Object.values(LABELS)
        .map((group) => group[v])
        .filter(Boolean);
    });
}

/** 코드와 라벨, text를 검색용 문자열 배열로 합친다 */
export function buildSearchableText(texts: string[], codes: string[]) {
  const labelTexts = collectLabels(codes);

  return [...texts, ...codes, ...labelTexts].filter(Boolean).join(" ").toLowerCase();
}
