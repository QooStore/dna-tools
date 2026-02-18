const PERCENT_KEYS = new Set(["critRate", "critDamage", "triggerProbability"]);

const MULTIPLIER_KEYS = new Set(["attackSpeed"]);

export function formatWeaponStat(key: string, value: string | number): string | number {
  if (typeof value !== "number") return value;

  if (MULTIPLIER_KEYS.has(key)) {
    return `${value * 100}%`;
  }

  if (PERCENT_KEYS.has(key)) {
    return `${value}%`;
  }

  return value;
}

/** 검색어 만들기 */
export function buildSearchableText(values: (string | undefined)[]) {
  return values.filter(Boolean).join(" ").toLowerCase();
}

/** form number 빈 값 String으로 전환한다. */
export const numberValue = (v?: number) => (v === null || v === undefined ? "" : String(v));
