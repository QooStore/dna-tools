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
