import type { DemonWedgeListItem } from "@/domains/demonWedges/type";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { CharacterListItem } from "@/domains/characters/types";
import type { BuffFields, BuildState, CalcMode, ActiveTab } from "./calculatorTypes";
import { emptyBuffFields } from "./calculatorTypes";

type WedgeEquipType = DemonWedgeListItem["equipType"]; // string

export const TAB_LABELS: Record<ActiveTab, string> = {
  character: "캐릭터",
  meleeConsonanceWeapon: "근접 동조 무기",
  rangedConsonanceWeapon: "원거리 동조 무기",
  meleeWeapon: "근접 무기",
  rangedWeapon: "원거리 무기",
};

export const tabToEquipType: Record<ActiveTab, WedgeEquipType> = {
  character: "character",
  meleeConsonanceWeapon: "meleeConsonanceWeapon",
  rangedConsonanceWeapon: "rangedConsonanceWeapon",
  meleeWeapon: "meleeWeapon",
  rangedWeapon: "rangedWeapon",
};

// DB statType -> Calculator buff field
const STAT_TO_BUFF_FIELD: Record<string, keyof BuffFields> = {
  attack_per: "characterAttackPct",
  elementAttack_per: "elementAttackPct",
  resolve: "resolvePct",
  morale: "moralePct",
  skillIntensity: "skillPowerPct",
  skillDmg: "skillDamagePct",
  damage: "damagePct",
  weaponDmg: "weaponDamagePct",
  weaponAttack_per: "weaponAttackPct",
  critRate: "critRatePct",
  critDamage: "critDamagePct",
  attackSpeed: "attackSpeedPct",
  // NOTE: extraDamagePct는 현재 DB statType에 직접 매핑되는 항목이 없어 수동 입력만 지원
};

export function applyWedgesToBuff(
  allWedges: DemonWedgeListItem[],
  wedgeSlugs: string[],
): { buff: BuffFields; unsupported: { statType: string; value: number; wedgeName: string }[] } {
  const buff = emptyBuffFields();
  const unsupported: { statType: string; value: number; wedgeName: string }[] = [];

  const wedgeMap = new Map(allWedges.map((w) => [w.slug, w]));
  for (const slug of wedgeSlugs.filter(Boolean)) {
    const w = wedgeMap.get(slug);
    if (!w) continue;
    for (const st of w.stats) {
      const key = STAT_TO_BUFF_FIELD[st.statType];
      if (!key) {
        unsupported.push({ statType: st.statType, value: st.value, wedgeName: w.name });
        continue;
      }
      // 대부분이 %이지만 일부는 "값"이 섞여있을 수 있음. 계산기는 일단 %로 취급.
      // (필요하면 statType별 스케일링 로직 추가)
      buff[key] += Number(st.value);
    }
  }
  return { buff, unsupported };
}

export function sumBuffs(sections: BuffFields[]): BuffFields {
  const out = emptyBuffFields();
  for (const b of sections) {
    (Object.keys(out) as (keyof BuffFields)[]).forEach((k) => {
      out[k] += b[k] || 0;
    });
  }
  return out;
}

export function clamp(n: number, min: number, max: number): number {
  if (Number.isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

export function findWeapon(weapons: WeaponListItem[], slug: string | "") {
  if (!slug) return null;
  return weapons.find((w) => w.slug === slug) ?? null;
}

export function findCharacter(characters: CharacterListItem[], slug: string | "") {
  if (!slug) return null;
  return characters.find((c) => c.slug === slug) ?? null;
}

export type CalcResult = {
  mode: CalcMode;
  // Inputs
  baseCharAttack: number;
  weaponAttack: number;
  consonanceAttack: number;
  totalBuff: BuffFields;
  // Derived
  finalCharAttack: number;
  finalWeaponAttack: number;
  finalAttackTotal: number;
  critRatePct: number;
  critDamagePct: number;
  expectedCritMultiplier: number;
  attackSpeed: number;
  damageMultiplier: number;
  estimatedDps: number;
};

/**
 * 현재 프로젝트 DB/데이터만으로는 "정식 공식"을 100% 보장하기 어려워서,
 * 계산기는 아래의 "단순화된" 공식으로 1차 결과를 제공합니다.
 *
 * - 캐릭터 공격%는 캐릭터 기본 공격력에만 적용
 * - 무기 공격%는 무기(선택한 모드의 무기 + 동조무기)의 공격력에만 적용
 * - 대미지/스킬 위력/스킬 대미지는 전부 곱연산
 * - 치명 기대값: 1 + (치확 * 치피)
 * - 공격 속도: (기본 공격 속도) * (1 + 공격속도 버프%)
 */
export function compute(build: BuildState, data: { weapons: WeaponListItem[] }, mode: CalcMode): CalcResult {
  const wMelee = findWeapon(data.weapons, build.selections.meleeWeaponSlug);
  const wRanged = findWeapon(data.weapons, build.selections.rangedWeaponSlug);

  const baseCharAttack = Number(build.base.character.baseAttack) || 0;
  const consonanceAttack = Number(build.base.consonanceWeapon.attack) || 0;

  const weaponAttack =
    mode === "melee"
      ? Number(build.base.meleeWeapon.attack) || wMelee?.attack || 0
      : Number(build.base.rangedWeapon.attack) || wRanged?.attack || 0;

  const totalBuff = sumBuffs([
    build.buffs.passive,
    build.buffs.characterWedge,
    build.buffs.meleeWeaponWedge,
    build.buffs.rangedWeaponWedge,
    build.buffs.meleeConsonanceWedge,
    build.buffs.rangedConsonanceWedge,
  ]);

  const charAtkMult = 1 + (totalBuff.characterAttackPct || 0) / 100;
  const weaponAtkMult = 1 + (totalBuff.weaponAttackPct || 0) / 100;
  const elementMult = 1 + (totalBuff.elementAttackPct || 0) / 100;
  const dmgMult = 1 + (totalBuff.damagePct || 0) / 100;
  const skillPowerMult = 1 + (totalBuff.skillPowerPct || 0) / 100;
  const skillDmgMult = 1 + (totalBuff.skillDamagePct || 0) / 100;
  const weaponDmgMult = 1 + (totalBuff.weaponDamagePct || 0) / 100;
  const extraDmgMult = 1 + (totalBuff.extraDamagePct || 0) / 100;

  const finalCharAttack = baseCharAttack * charAtkMult;
  const finalWeaponAttack = (weaponAttack + consonanceAttack) * weaponAtkMult;
  const finalAttackTotal = (finalCharAttack + finalWeaponAttack) * elementMult;

  // 치명/공속은 "선택 모드"의 무기 + 동조무기를 더한 뒤 버프 적용
  const baseCritRate =
    mode === "melee"
      ? Number(build.base.meleeWeapon.critRatePct) || wMelee?.critRate || 0
      : Number(build.base.rangedWeapon.critRatePct) || wRanged?.critRate || 0;
  const baseCritDamage =
    mode === "melee"
      ? Number(build.base.meleeWeapon.critDamagePct) || wMelee?.critDamage || 0
      : Number(build.base.rangedWeapon.critDamagePct) || wRanged?.critDamage || 0;
  const baseAttackSpeed =
    mode === "melee"
      ? Number(build.base.meleeWeapon.attackSpeed) || wMelee?.attackSpeed || 1
      : Number(build.base.rangedWeapon.attackSpeed) || wRanged?.attackSpeed || 1;

  const critRatePct = clamp(baseCritRate + (totalBuff.critRatePct || 0), 0, 100);
  const critDamagePct = Math.max(0, baseCritDamage + (totalBuff.critDamagePct || 0));
  const expectedCritMultiplier = 1 + (critRatePct / 100) * (critDamagePct / 100);

  const attackSpeed = Math.max(0.1, baseAttackSpeed * (1 + (totalBuff.attackSpeedPct ?? 0) / 100));
  const damageMultiplier = dmgMult * skillPowerMult * skillDmgMult * weaponDmgMult * extraDmgMult;

  const estimatedDps = finalAttackTotal * expectedCritMultiplier * damageMultiplier * attackSpeed;

  return {
    mode,
    baseCharAttack,
    weaponAttack,
    consonanceAttack,
    totalBuff,
    finalCharAttack,
    finalWeaponAttack,
    finalAttackTotal,
    critRatePct,
    critDamagePct,
    expectedCritMultiplier,
    attackSpeed,
    damageMultiplier,
    estimatedDps,
  };
}
