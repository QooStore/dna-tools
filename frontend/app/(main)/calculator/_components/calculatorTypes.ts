import type { CharacterListItem } from "@/domains/characters/types";
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
  resolvePct: number; // 필사%
  moralePct: number; // 격양%
  skillPowerPct: number; // 스킬 위력%
  skillDamagePct: number; // 스킬 대미지%
  damagePct: number; // 대미지%
  weaponDamagePct: number; // 무기 대미지%
  weaponAttackPct: number; // 무기 공격%
  critRatePct: number; // 치명타 확률%
  critDamagePct: number; // 치명타 피해%
  attackSpeedPct: number; // 공격 속도% (DB/쐐기에는 존재하지만, 필요 시 사용)
  extraDamagePct: number; // 추가 대미지%
};

export type BaseCharacterInputs = {
  currentHpPct: number;
  baseAttack: number;
  resolvePct: number;
  moralePct: number;
};

export type BaseWeaponInputs = {
  attack: number;
  critRatePct: number;
  critDamagePct: number;
  attackSpeed: number;
};

export type BuildSelections = {
  characterSlug: string | "";
  meleeWeaponSlug: string | "";
  rangedWeaponSlug: string | "";
  ally1Slug: string | "";
  ally2Slug: string | "";
};

export type WedgeSlots = Record<ActiveTab, string[]>; // wedge slugs

export type ConsonanceCategory = "melee" | "ranged" | null;

export type BuildState = {
  selections: BuildSelections;
  activeTab: ActiveTab;
  wedgeSlots: WedgeSlots;
  resistanceLimits: Record<ActiveTab, number>;
  consonanceCategory: ConsonanceCategory;
  resonanceLevel: number; // 수련 레벨 (0~65)

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
};

export type StaticData = {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
  wedges: DemonWedgeListItem[];
};

export const emptyBuffFields = (): BuffFields => ({
  characterAttackPct: 0,
  elementAttackPct: 0,
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
  consonanceCategory: null,
  resonanceLevel: 65,
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
    character: { currentHpPct: 100, baseAttack: 0, resolvePct: 0, moralePct: 0 },
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
});
