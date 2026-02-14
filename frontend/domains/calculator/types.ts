import { CharacterDetail, CharacterListItem } from "@/domains/characters/types";
import { WeaponListItem } from "@/domains/weapons/type";
import { DemonWedgeListItem } from "@/domains/demonWedges/type";

// --- 쐐기 탭 ---

export type WedgeTab = "character" | "consonance" | "melee" | "ranged";

// --- 빌드 상태 ---

export interface BuildState {
  character: CharacterDetail | null;
  meleeWeapon: WeaponListItem | null;
  rangedWeapon: WeaponListItem | null;
  ally1: CharacterDetail | null;
  ally2: CharacterDetail | null;
  characterWedges: (DemonWedgeListItem | null)[]; // 9 (index 8 = 쿠쿨칸)
  meleeWedges: (DemonWedgeListItem | null)[]; // 8
  rangedWedges: (DemonWedgeListItem | null)[]; // 8
  consonanceWedges: (DemonWedgeListItem | null)[]; // 4
}

export const EMPTY_BUILD: BuildState = {
  character: null,
  meleeWeapon: null,
  rangedWeapon: null,
  ally1: null,
  ally2: null,
  characterWedges: Array(9).fill(null),
  meleeWedges: Array(8).fill(null),
  rangedWedges: Array(8).fill(null),
  consonanceWedges: Array(4).fill(null),
};

// --- 공유 설정 ---

export interface SharedSettings {
  currentHpPercent: number; // 0 ~ 100
}

// --- 스탯 입력 (3열: base / wedge / buff) ---

export interface StatField {
  base: number; // 기본 스탯 (캐릭터/무기 선택 시 자동)
  wedge: number; // 쐐기/무기 (쐐기 선택 시 자동)
  buff: number; // 버프 (수동 입력)
}

const defaultField = (): StatField => ({ base: 0, wedge: 0, buff: 0 });

/** 기본 공격력 (상단 공유 영역) */
export interface BaseAttacks {
  characterAtk: number;
  meleeWeaponAtk: number;
  rangedWeaponAtk: number;
  consonanceWeaponAtk: number;
}

/** 공통 필드 (모든 탭에서 사용) */
export interface CommonStats {
  attackPercent: StatField; // 공격력(%)
  elementAttack: StatField; // 속성 공격(%)
  damage: StatField; // 대미지(%)
  additionalDamage: StatField; // 추가 대미지(%)
  morale: StatField; // 격양(%)
  resolve: StatField; // 필사(%)
}

/** Character 탭 전용 */
export interface CharacterTabStats {
  skillIntensity: StatField; // 스킬 위력 증가(%)
  skillDamage: StatField; // 스킬 대미지(%)
}

/** Melee / Ranged 탭 전용 */
export interface WeaponTabStats {
  weaponDamage: StatField; // 무기 대미지(%)
  attackSpeed: StatField; // 공격속도(%)
  critRate: StatField; // 크리티컬 확률(%)
  critDamage: StatField; // 크리티컬 대미지(%)
}

/** Consonance 탭 전용 */
export interface ConsonanceTabStats {
  skillIntensity: StatField; // 스킬 위력 증가(%)
  weaponDamage: StatField; // 무기 대미지(%)
  attackSpeed: StatField; // 공격속도(%)
  critRate: StatField; // 크리티컬 확률(%)
  critDamage: StatField; // 크리티컬 대미지(%)
}

/** 빌드 전체 스탯 */
export interface BuildStats {
  baseAttacks: BaseAttacks;
  common: CommonStats;
  character: CharacterTabStats;
  melee: WeaponTabStats;
  ranged: WeaponTabStats;
  consonance: ConsonanceTabStats;
}

export const EMPTY_BUILD_STATS: BuildStats = {
  baseAttacks: {
    characterAtk: 0,
    meleeWeaponAtk: 0,
    rangedWeaponAtk: 0,
    consonanceWeaponAtk: 0,
  },
  common: {
    attackPercent: defaultField(),
    elementAttack: defaultField(),
    damage: defaultField(),
    additionalDamage: defaultField(),
    morale: defaultField(),
    resolve: defaultField(),
  },
  character: {
    skillIntensity: defaultField(),
    skillDamage: defaultField(),
  },
  melee: {
    weaponDamage: defaultField(),
    attackSpeed: defaultField(),
    critRate: defaultField(),
    critDamage: defaultField(),
  },
  ranged: {
    weaponDamage: defaultField(),
    attackSpeed: defaultField(),
    critRate: defaultField(),
    critDamage: defaultField(),
  },
  consonance: {
    skillIntensity: defaultField(),
    weaponDamage: defaultField(),
    attackSpeed: defaultField(),
    critRate: defaultField(),
    critDamage: defaultField(),
  },
};

// --- 모달 ---

export type SlotCategory =
  | "character"
  | "meleeWeapon"
  | "rangedWeapon"
  | "ally1"
  | "ally2"
  | "characterWedge"
  | "meleeWedge"
  | "rangedWedge"
  | "consonanceWedge"
  | "kukulkanWedge";

export interface ModalTarget {
  build: "A" | "B";
  slotCategory: SlotCategory;
  slotIndex?: number;
}

// --- 참조 데이터 ---

export interface ReferenceData {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
  demonWedges: DemonWedgeListItem[];
}
