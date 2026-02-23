import type { DemonWedgeListItem } from "@/domains/demonWedges/type";
import type { CharacterListItem, CharacterPassiveUpgrade } from "@/domains/characters/types";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { BuffFields, BuildState, ActiveTab, EnemyType, ElementCondition } from "./calculatorTypes";
import { emptyBuffFields } from "./calculatorTypes";

// ── 적 종류별 방어력 ──
export const ENEMY_DEF: Record<EnemyType, number> = {
  small: 130,
  large: 200,
  boss: 300,
};

export const ENEMY_TYPE_LABELS: Record<EnemyType, string> = {
  small: "소형",
  large: "대형",
  boss: "보스",
};

// ── 속성 조건별 적 속성 저항 ──
export const ELEMENT_RESIST: Record<ElementCondition, number> = {
  none: 0,      // 무속성
  counter: -400, // 카운터 속성
  other: 50,    // 기타 속성
};

export const ELEMENT_CONDITION_LABELS: Record<ElementCondition, string> = {
  none: "무속성",
  counter: "카운터 속성",
  other: "기타 속성",
};

export const ELEMENT_CONDITION_DESC: Record<ElementCondition, string> = {
  none: "속성 저항 0%",
  counter: "속성 저항 -400%",
  other: "속성 저항 50%",
};

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
  slashAttack_per: "weaponAttackPct",
  smashAttack_per: "weaponAttackPct",
  spikeAttack_per: "weaponAttackPct",
  critRate: "critRatePct",
  critDamage: "critDamagePct",
  attackSpeed: "attackSpeedPct",
  additionalDmg: "extraDamagePct",
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

export function applyPassiveUpgradesToBuff(
  passiveUpgrades: CharacterPassiveUpgrade[],
  upgradeType: "STAT" | "COOP",
): BuffFields {
  const buff = emptyBuffFields();
  for (const pu of passiveUpgrades) {
    if (pu.upgradeType !== upgradeType || !pu.targetStat || pu.value == null) continue;
    const key = STAT_TO_BUFF_FIELD[pu.targetStat];
    if (!key) continue;
    buff[key] += Number(pu.value);
  }
  return buff;
}

export function applyWeaponPassiveToBuff(passiveStat: string | null, passiveValue: number | null): BuffFields {
  const buff = emptyBuffFields();
  if (!passiveStat || passiveValue == null) return buff;
  const key = STAT_TO_BUFF_FIELD[passiveStat];
  if (key) buff[key] += Number(passiveValue);
  return buff;
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

// ── 레조넌스(수련) 보너스 테이블 ──
export type ResonanceBonus = { atk: number; def: number; hp: number; shield: number };

const RESONANCE_TABLE: { maxLevel: number; bonus: ResonanceBonus }[] = [
  { maxLevel: 14, bonus: { shield: 0, def: 0, hp: 0, atk: 0 } },
  { maxLevel: 19, bonus: { shield: 10, def: 0, hp: 0, atk: 0 } },
  { maxLevel: 24, bonus: { shield: 15, def: 0, hp: 0, atk: 0 } },
  { maxLevel: 29, bonus: { shield: 20, def: 20, hp: 0, atk: 0 } },
  { maxLevel: 34, bonus: { shield: 25, def: 25, hp: 0, atk: 0 } },
  { maxLevel: 39, bonus: { shield: 30, def: 30, hp: 30, atk: 0 } },
  { maxLevel: 44, bonus: { shield: 40, def: 40, hp: 40, atk: 0 } },
  { maxLevel: 49, bonus: { shield: 50, def: 50, hp: 50, atk: 50 } },
  { maxLevel: 54, bonus: { shield: 75, def: 75, hp: 75, atk: 75 } },
  { maxLevel: 59, bonus: { shield: 100, def: 100, hp: 100, atk: 100 } },
  { maxLevel: 61, bonus: { shield: 150, def: 150, hp: 150, atk: 150 } },
  { maxLevel: 63, bonus: { shield: 200, def: 200, hp: 200, atk: 200 } },
  { maxLevel: 64, bonus: { shield: 250, def: 250, hp: 250, atk: 250 } },
  { maxLevel: 65, bonus: { shield: 300, def: 300, hp: 300, atk: 300 } },
];

export function getResonanceBonus(level: number): ResonanceBonus {
  for (const entry of RESONANCE_TABLE) {
    if (level <= entry.maxLevel) return entry.bonus;
  }
  return { shield: 300, def: 300, hp: 300, atk: 300 };
}

// 레조넌스 레벨 선택지
export const RESONANCE_OPTIONS = [
  { value: 15, label: "Lv. 15–19" },
  { value: 20, label: "Lv. 20–24" },
  { value: 25, label: "Lv. 25–29" },
  { value: 30, label: "Lv. 30–34" },
  { value: 35, label: "Lv. 35–39" },
  { value: 40, label: "Lv. 40–44" },
  { value: 45, label: "Lv. 45–49" },
  { value: 50, label: "Lv. 50–54" },
  { value: 55, label: "Lv. 55–59" },
  { value: 60, label: "Lv. 60–61" },
  { value: 62, label: "Lv. 62–63" },
  { value: 64, label: "Lv. 64" },
  { value: 65, label: "Lv. 65" },
];

// ── 버프 합산 (모든 섹션을 하나로) ──
function totalBuffs(build: BuildState): BuffFields {
  return sumBuffs([
    build.buffs.passive,
    build.buffs.characterWedge,
    build.buffs.meleeWeaponWedge,
    build.buffs.rangedWeaponWedge,
    build.buffs.meleeConsonanceWedge,
    build.buffs.rangedConsonanceWedge,
  ]);
}

// ── 필사 계수 ──
// 필사 값 계수 = 필사% × 2 × ((1 - HP%) × 2 + 1) × (1 - HP%)
// 필사 계수 = 1 + 필사 값 계수
// HP 25% 이하는 동일 (clamp)
function resolveCoeff(resolvePct: number, currentHpPct: number): number {
  const hp = Math.max(25, currentHpPct) / 100; // 25% 이하는 25%로 취급
  const lost = 1 - hp;
  const valueCoeff = (resolvePct / 100) * 2 * (lost * 2 + 1) * lost;
  return 1 + valueCoeff;
}

// ── 격양 계수 ──
// 격양 1% = 현재 HP 1%당 0.01% 증가
// 격양 계수 = 1 + 격양% × 현재HP% / 10000
function moraleCoeff(moralePct: number, currentHpPct: number): number {
  return 1 + (moralePct * currentHpPct) / 10000;
}

// ── 크리티컬 계수 (기대값) ──
// 크리티컬 레벨: <200% → 1, 200~299% → 2, ≥300% → 3
// 크리티컬 발동 시: 1 + critLevel × (critDamage%/100 - 1)
// 기대값 = (1 - critProb) × 1 + critProb × 발동 시 계수
function critCoeff(critRatePct: number, critDamagePct: number): number {
  const critProb = Math.min(critRatePct, 100) / 100;
  const critLevel = critRatePct < 200 ? 1 : critRatePct < 300 ? 2 : 3;
  const onCrit = 1 + critLevel * (critDamagePct / 100 - 1);
  return (1 - critProb) * 1 + critProb * onCrit;
}

// ── 적 방어 계수 ──
// (300 + 레벨 차이 계수) / (300 + 레벨 차이 계수 + 적 방어력 × (1 - 방어 무시%))
// 레벨 차이 계수 = clamp(캐릭터 레벨 - 적 레벨, -20, 0)
function enemyDefCoeff(
  characterLevel: number,
  enemyLevel: number,
  enemyDef: number,
  defPenetrationPct: number,
): number {
  const levelDiff = Math.max(-20, Math.min(0, characterLevel - enemyLevel));
  const numer = 300 + levelDiff;
  const denom = numer + enemyDef * (1 - defPenetrationPct / 100);
  if (denom <= 0) return 1;
  return numer / denom;
}

// ── 적 속성 저항 계수 ──
// (1 - 적 속성 저항%) × (1 + 속성 관통%)
function enemyElementResistCoeff(enemyElementResistPct: number, elementPenetrationPct: number): number {
  return (1 - enemyElementResistPct / 100) * (1 + elementPenetrationPct / 100);
}

// ── 적 받는 대미지 계수 ──
// 감소: 개별 곱연산 / 증가: 합연산
// (1 - 감소1%) × (1 - 감소2%) × ... × (1 + 증가%)
export function enemyDmgTakenCoeff(reductions: number[], increasePct: number): number {
  const reductionMult = reductions.reduce((acc, r) => acc * (1 - r / 100), 1);
  return reductionMult * (1 + increasePct / 100);
}

// ── 마스터리 ──
// 캐릭터 숙련 무기 타입이 맞으면 120%, 아니면 100%
// 각주(kezhou)는 모든 무기 120%
function mastery(charSlug: string, charProficiency: string, weaponType: string): number {
  if (charSlug === "kezhou") return 1.2;
  return charProficiency === weaponType ? 1.2 : 1;
}

// ── 무기별 버프 합산 ──
// 근접 무기: passive + characterWedge + meleeWeaponWedge
// 원거리 무기: passive + characterWedge + rangedWeaponWedge
// 근접 동조: passive + characterWedge + meleeConsonanceWedge
// 원거리 동조: passive + characterWedge + rangedConsonanceWedge
function weaponBuffs(build: BuildState, type: "melee" | "ranged" | "meleeConsonance" | "rangedConsonance"): BuffFields {
  const wedgeKey = {
    melee: "meleeWeaponWedge",
    ranged: "rangedWeaponWedge",
    meleeConsonance: "meleeConsonanceWedge",
    rangedConsonance: "rangedConsonanceWedge",
  }[type] as keyof BuildState["buffs"];

  return sumBuffs([build.buffs.passive, build.buffs.characterWedge, build.buffs[wedgeKey]]);
}

// ── 결과 타입 ──
export type OutputKey =
  | "skillDamage"
  | "meleeWeaponDamage"
  | "rangedWeaponDamage"
  | "meleeConsonanceWeaponDamage"
  | "rangedConsonanceWeaponDamage";

export type OutputResult = Record<OutputKey, number>;

type ComputeData = {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
};

// ── 무기 대미지 계산 ──
// 최종 무기 대미지 = 기본 무기 대미지 × 크리티컬 계수 × 추가 대미지 계수 × 무기 대미지 증감 계수 × 필사 계수 × 격양 계수
//
// 기본 무기 대미지 = [캐릭터 최종 스탯 + (무기 기본 공격 × (1 + 무기 공격%) × 마스터리)]
// 캐릭터 최종 스탯 = 캐릭터 기본 공격 × (1 + 공격%) × (1 + 속성 공격%)
// 추가 대미지 계수 = 1 + 추가 대미지% / 100
// 무기 대미지 증감 계수 = 1 + (대미지% + 무기 대미지%) / 100
function computeWeaponDamage(
  build: BuildState,
  buff: BuffFields,
  weaponAttack: number,
  critRate: number,
  critDamage: number,
  masteryMult: number,
  currentHpPct: number,
  totalResolvePct: number,
  totalMoralePct: number,
  isConsonance: boolean = false,
  enemyMult: number = 1,
): number {
  const baseAttack = Number(build.base.character.baseAttack) || 0;

  // 캐릭터 최종 스탯
  const charFinalStat = baseAttack * (1 + buff.characterAttackPct / 100) * (1 + buff.elementAttackPct / 100);

  // 무기 최종 공격
  const weaponFinalAttack = weaponAttack * (1 + buff.weaponAttackPct / 100) * masteryMult;

  // 기본 무기 대미지 (동조 무기는 스킬 위력 적용)
  const baseWeaponDamage = (charFinalStat + weaponFinalAttack) * (isConsonance ? 1 + buff.skillPowerPct / 100 : 1);

  // 계수들
  // 크리 스탯은 무기 기본값에 버프가 곱 적용 (20% 기본 × 100% 버프 = 40%)
  const totalCritRate = critRate * (1 + buff.critRatePct / 100);
  const totalCritDamage = critDamage * (1 + buff.critDamagePct / 100);
  const crit = critCoeff(totalCritRate, totalCritDamage);
  const extraDamage = 1 + buff.extraDamagePct / 100;
  const weaponDamageCoeff = 1 + (buff.damagePct + buff.weaponDamagePct) / 100;
  const resolve = resolveCoeff(totalResolvePct, currentHpPct);
  const morale = moraleCoeff(totalMoralePct, currentHpPct);

  return baseWeaponDamage * crit * extraDamage * weaponDamageCoeff * resolve * morale * enemyMult;
}

// ── 스킬 대미지 계산 ──
// 최종 스킬 대미지 = 기본 스킬 대미지 × 필사 계수 × 격양 계수 × 스킬 대미지 증감 계수
// 기본 스킬 대미지 = 캐릭터 최종 스탯 × (배율 100% × (1 + 스킬 위력%/100))
// 스킬 대미지 증감 계수 = 1 + (대미지% + 스킬 대미지%) / 100

export function computeOutputs(build: BuildState, data: ComputeData): OutputResult {
  const allBuff = totalBuffs(build);
  // 레조넌스 ATK% → 캐릭터 공격%에 합산
  allBuff.characterAttackPct += getResonanceBonus(build.resonanceLevel).atk;

  const baseAttack = Number(build.base.character.baseAttack) || 0;
  const currentHpPct = Number(build.base.character.currentHpPct) || 100;

  // 필사/격양: 캐릭터 기본값 + 전체 버프 합산
  const totalResolvePct = (Number(build.base.character.resolvePct) || 0) + allBuff.resolvePct;
  const totalMoralePct = (Number(build.base.character.moralePct) || 0) + allBuff.moralePct;

  // ── 적 계수 ──
  const e = build.enemy;
  const charBase = build.base.character;
  const defCoeff = enemyDefCoeff(
    charBase.characterLevel,
    e.enemyLevel,
    ENEMY_DEF[e.enemyType],
    charBase.defPenetrationPct,
  );
  const elementResistCoeff = enemyElementResistCoeff(
    ELEMENT_RESIST[e.elementCondition],
    charBase.elementPenetrationPct,
  );
  const dmgTakenCoeff = enemyDmgTakenCoeff(e.enemyDmgReductions, e.enemyDmgIncreasePct);
  const enemyMult = defCoeff * elementResistCoeff * dmgTakenCoeff;

  // ── 스킬 대미지 ──
  const finalStat = baseAttack * (1 + allBuff.characterAttackPct / 100) * (1 + allBuff.elementAttackPct / 100);
  const baseSkillDamage = finalStat * (1 + allBuff.skillPowerPct / 100);
  const skillDamageCoeff = 1 + (allBuff.damagePct + allBuff.skillDamagePct) / 100;
  const skillDamage =
    baseSkillDamage *
    resolveCoeff(totalResolvePct, currentHpPct) *
    moraleCoeff(totalMoralePct, currentHpPct) *
    skillDamageCoeff *
    enemyMult;

  // ── 마스터리 판정 ──
  const charSlug = build.selections.characterSlug;
  const char = charSlug ? data.characters.find((c) => c.slug === charSlug) : undefined;
  const meleeWeapon = build.selections.meleeWeaponSlug
    ? data.weapons.find((w) => w.slug === build.selections.meleeWeaponSlug)
    : undefined;
  const rangedWeapon = build.selections.rangedWeaponSlug
    ? data.weapons.find((w) => w.slug === build.selections.rangedWeaponSlug)
    : undefined;

  const meleeMastery = char && meleeWeapon ? mastery(char.slug, char.meleeProficiency, meleeWeapon.weaponType) : 1;
  const rangedMastery = char && rangedWeapon ? mastery(char.slug, char.rangedProficiency, rangedWeapon.weaponType) : 1;

  // ── 근접 무기 대미지 ──
  const meleeBuff = weaponBuffs(build, "melee");
  const meleeWeaponDamage = computeWeaponDamage(
    build,
    meleeBuff,
    Number(build.base.meleeWeapon.attack) || 0,
    Number(build.base.meleeWeapon.critRatePct) || 0,
    Number(build.base.meleeWeapon.critDamagePct) || 0,
    meleeMastery,
    currentHpPct,
    totalResolvePct,
    totalMoralePct,
    false,
    enemyMult,
  );

  // ── 원거리 무기 대미지 ──
  const rangedBuff = weaponBuffs(build, "ranged");
  const rangedWeaponDamage = computeWeaponDamage(
    build,
    rangedBuff,
    Number(build.base.rangedWeapon.attack) || 0,
    Number(build.base.rangedWeapon.critRatePct) || 0,
    Number(build.base.rangedWeapon.critDamagePct) || 0,
    rangedMastery,
    currentHpPct,
    totalResolvePct,
    totalMoralePct,
    false,
    enemyMult,
  );

  // ── 근접 동조 무기 대미지 ──
  const meleeConsBuff = weaponBuffs(build, "meleeConsonance");
  const meleeConsonanceWeaponDamage = computeWeaponDamage(
    build,
    meleeConsBuff,
    Number(build.base.consonanceWeapon.attack) || 0,
    Number(build.base.consonanceWeapon.critRatePct) || 0,
    Number(build.base.consonanceWeapon.critDamagePct) || 0,
    1.2, // 동조 무기는 마스터리 120%
    currentHpPct,
    totalResolvePct,
    totalMoralePct,
    true, // 동조 무기: 스킬 위력 적용
    enemyMult,
  );

  // ── 원거리 동조 무기 대미지 ──
  const rangedConsBuff = weaponBuffs(build, "rangedConsonance");
  const rangedConsonanceWeaponDamage = computeWeaponDamage(
    build,
    rangedConsBuff,
    Number(build.base.consonanceWeapon.attack) || 0,
    Number(build.base.consonanceWeapon.critRatePct) || 0,
    Number(build.base.consonanceWeapon.critDamagePct) || 0,
    1.2,
    currentHpPct,
    totalResolvePct,
    totalMoralePct,
    true, // 동조 무기: 스킬 위력 적용
    enemyMult,
  );

  return {
    skillDamage,
    meleeWeaponDamage,
    rangedWeaponDamage,
    meleeConsonanceWeaponDamage,
    rangedConsonanceWeaponDamage,
  };
}
