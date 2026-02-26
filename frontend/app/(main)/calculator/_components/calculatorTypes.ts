import type { CharacterListItem, ConditionalEffectResponse } from "@/domains/characters/types";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { DemonWedgeListItem } from "@/domains/demonWedges/type";

export type BuildId = "A" | "B";

export type ActiveTab =
  | "character"
  | "meleeConsonanceWeapon"
  | "rangedConsonanceWeapon"
  | "meleeWeapon"
  | "rangedWeapon";

export type CalcMode = "melee" | "ranged";

export type BuffFields = {
  characterAttackPct: number; // 캐릭터 공격%
  elementAttackPct: number; // 속성 공격%
  independentAttack: number; // 독립 공격력 (고정값)
  resolvePct: number; // 필사%
  moralePct: number; // 격양%
  skillPowerPct: number; // 스킬 위력%
  skillDamagePct: number; // 스킬 대미지%
  damagePct: number; // 대미지%
  weaponDamagePct: number; // 무기 대미지%
  weaponAttackPct: number; // 무기 공격%
  critRatePct: number; // 치명타 확률%
  critDamagePct: number; // 치명타 피해%
  attackSpeedPct: number; // 공격 속도%
  extraDamagePct: number; // 추가 대미지%
  defPenetrationPct: number; // 방어 무시%
  elementPenetrationPct: number; // 속성 관통%
  hpPct: number; // HP% (HP 계수 캐릭터용)
  defensePct: number; // 방어% (방어 계수 캐릭터용)
};

export type BaseCharacterInputs = {
  characterLevel: number;          // 캐릭터 레벨
  currentHpPct: number;
  baseAttack: number;
  independentAttack: number;       // 독립 공격력 (attack% 미적용)
  hp: number;                      // 기본 HP (HP 계수 캐릭터용)
  defense: number;                 // 기본 방어 (방어 계수 캐릭터용)
  skillMultiplierPct: number;      // 스킬 배율%
  resolvePct: number;
  moralePct: number;
  defPenetrationPct: number;       // 방어 무시%
  elementPenetrationPct: number;   // 속성 관통%
};

export type BaseWeaponInputs = {
  attack: number;
  critRatePct: number;
  critDamagePct: number;
  attackSpeed: number;
};

export type EnemyType = "small" | "large" | "boss";
export type ElementCondition = "none" | "counter" | "other";

export type EnemyInputs = {
  enemyType: EnemyType;                  // 적 종류 → 방어력 자동 결정
  enemyLevel: number;                    // 적 레벨
  elementCondition: ElementCondition;    // 속성 조건 → 속성 저항 자동 결정
  enemyDmgIncreasePct: number;           // 받는 대미지 증가%
  enemyDmgReductions: number[];          // 받는 대미지 감소% 목록 (개별 곱연산)
};

export type BuildSelections = {
  characterSlug: string | "";
  meleeWeaponSlug: string | "";
  rangedWeaponSlug: string | "";
  ally1Slug: string | "";
  ally2Slug: string | "";
};

export type AllyState = {
  weaponSlug: string;
  wedgeSlotsCharacter: string[]; // 9 slots (캐릭터 쐐기)
  wedgeSlotsWeapon: string[];    // 8 slots (무기 쐐기, 동조 없음)
  phaseShiftSlotsCharacter: boolean[]; // 9 slots
  phaseShiftSlotsWeapon: boolean[];    // 8 slots
  characterConditionalEffects: ConditionalEffectResponse[];
  resistanceLimits: { character: number; weapon: number };
};

export const emptyAllyState = (): AllyState => ({
  weaponSlug: "",
  wedgeSlotsCharacter: Array(9).fill(""),
  wedgeSlotsWeapon: Array(8).fill(""),
  phaseShiftSlotsCharacter: Array(9).fill(false),
  phaseShiftSlotsWeapon: Array(8).fill(false),
  characterConditionalEffects: [],
  resistanceLimits: { character: 100, weapon: 100 },
});

export type WedgeSlots = Record<ActiveTab, string[]>; // wedge slugs

export type ConsonanceCategory = "melee" | "ranged" | null;

export type BuildState = {
  selections: BuildSelections;
  activeTab: ActiveTab;
  wedgeSlots: WedgeSlots;
  resistanceLimits: Record<ActiveTab, number>;
  phaseShiftSlots: Record<ActiveTab, boolean[]>; // 페이즈 시프트 모듈 적용 슬롯
  consonanceCategory: ConsonanceCategory;
  resonanceLevel: number; // 수련 레벨 (0~65)
  enemy: EnemyInputs;

  // "자동으로 불러온 값"을 사용자가 수정할 수 있게 하기 위해, 저장은 항상 이 입력값을 기준으로.
  base: {
    character: BaseCharacterInputs;
    consonanceWeapon: BaseWeaponInputs;
    meleeWeapon: BaseWeaponInputs;
    rangedWeapon: BaseWeaponInputs;
  };

  // 버프: 섹션 6개
  buffs: {
    passive: BuffFields;
    characterWedge: BuffFields;
    meleeWeaponWedge: BuffFields;
    rangedWeaponWedge: BuffFields;
    meleeConsonanceWedge: BuffFields;
    rangedConsonanceWedge: BuffFields;
  };

  // 조건부 효과 (토글)
  conditionalEffects: {
    characterEffects: ConditionalEffectResponse[];
    disabledKeys: string[]; // 명시적으로 끈 키 (기본값은 켜진 상태)
  };

  // 협력 동료 장비 (쐐기, 무기) — 조건부 효과만 메인 캐릭터에 적용
  allies: [AllyState, AllyState];
};

export type StaticData = {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
  wedges: DemonWedgeListItem[];
};

export const emptyBuffFields = (): BuffFields => ({
  characterAttackPct: 0,
  elementAttackPct: 0,
  independentAttack: 0,
  resolvePct: 0,
  moralePct: 0,
  skillPowerPct: 0,
  skillDamagePct: 0,
  damagePct: 0,
  weaponDamagePct: 0,
  weaponAttackPct: 0,
  critRatePct: 0,
  critDamagePct: 0,
  attackSpeedPct: 0,
  extraDamagePct: 0,
  defPenetrationPct: 0,
  elementPenetrationPct: 0,
  hpPct: 0,
  defensePct: 0,
});

export const emptyBuildState = (): BuildState => ({
  selections: {
    characterSlug: "",
    meleeWeaponSlug: "",
    rangedWeaponSlug: "",
    ally1Slug: "",
    ally2Slug: "",
  },
  activeTab: "character",
  resistanceLimits: {
    character: 100,
    meleeConsonanceWeapon: 100,
    rangedConsonanceWeapon: 100,
    meleeWeapon: 100,
    rangedWeapon: 100,
  },
  phaseShiftSlots: {
    character: Array(9).fill(false),
    meleeConsonanceWeapon: Array(4).fill(false),
    rangedConsonanceWeapon: Array(4).fill(false),
    meleeWeapon: Array(8).fill(false),
    rangedWeapon: Array(8).fill(false),
  },
  consonanceCategory: null,
  resonanceLevel: 65,
  enemy: {
    enemyType: "boss",
    enemyLevel: 100,
    elementCondition: "none",
    enemyDmgIncreasePct: 0,
    enemyDmgReductions: [],
  },
  wedgeSlots: {
    // boarhat.gg 스타일 슬롯 수
    // - Character: 9 (4 + center + 4)
    // - Consonance: 4
    // - Melee/Ranged: 8 (4 + 4)
    character: Array(9).fill(""),
    meleeConsonanceWeapon: Array(4).fill(""),
    rangedConsonanceWeapon: Array(4).fill(""),
    meleeWeapon: Array(8).fill(""),
    rangedWeapon: Array(8).fill(""),
  },
  base: {
    character: {
      characterLevel: 80,
      currentHpPct: 100,
      baseAttack: 0,
      independentAttack: 0,
      hp: 0,
      defense: 0,
      skillMultiplierPct: 100,
      resolvePct: 0,
      moralePct: 0,
      defPenetrationPct: 0,
      elementPenetrationPct: 0,
    },
    consonanceWeapon: { attack: 0, critRatePct: 0, critDamagePct: 0, attackSpeed: 1 },
    meleeWeapon: { attack: 0, critRatePct: 0, critDamagePct: 0, attackSpeed: 1 },
    rangedWeapon: { attack: 0, critRatePct: 0, critDamagePct: 0, attackSpeed: 1 },
  },
  buffs: {
    passive: emptyBuffFields(),
    characterWedge: emptyBuffFields(),
    meleeWeaponWedge: emptyBuffFields(),
    rangedWeaponWedge: emptyBuffFields(),
    meleeConsonanceWedge: emptyBuffFields(),
    rangedConsonanceWedge: emptyBuffFields(),
  },
  conditionalEffects: {
    characterEffects: [],
    disabledKeys: [],
  },
  allies: [emptyAllyState(), emptyAllyState()],
});
