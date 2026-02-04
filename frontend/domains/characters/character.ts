import { ConsonanceWeaponStats, MeleeWeaponType, RangedWeaponType } from "../weapons/type";
import { ElementType, PassiveTargetStat, PassiveUpgradeType } from "./type";

export interface BaseStats {
  attack: number;
  hp: number;
  defense: number;

  maxMentality: number; // 최대 정신력
  resolve: number; // 필사 (%)
  morale: number; // 격양 (%)
}

export interface Skill {
  name: string;
  type: "대미지" | "버프" | "패시브";
  description: string;
}

export interface feature {
  featureCode: string;
  featureName: string;
}

export interface IntronEffect {
  stage: number; // 1~6
  description: string;
}

export interface CharacterPassiveUpgrade {
  upgradeKey: string; // atk_20, afterburn
  upgradeType: PassiveUpgradeType;

  targetStat?: PassiveTargetStat; // STAT, COOP
  value?: number; // % 값

  name: string; // 표시용 이름
  description: string; // 설명
}

export interface CharacterDetail {
  /** 식별자 */
  id?: number; // DB용 (프론트에선 없어도 됨)
  slug: string;

  /** 기본 정보 */
  name: string;
  elementCode: ElementType;
  image: string;
  elementImage: string;
  listImage: string;

  /** 무기 숙련 */
  meleeProficiency: MeleeWeaponType;
  meleeProficiencyLabel: string;
  rangedProficiency: RangedWeaponType;
  rangedProficiencyLabel: string;

  /** 역할 태그 */
  features: feature[];

  /** 기본 스탯 (캐릭터 고정값) */
  stats: BaseStats;

  /** 동조 무기 (없을 수도 있음) */
  consonanceWeapon?: ConsonanceWeaponStats;

  /** 스킬 목록 */
  skills: Skill[];

  /** 패시브 강화 */
  passiveUpgrades: CharacterPassiveUpgrade[];

  /** 근원 */
  introns: IntronEffect[];
}

export interface CharacterListItem {
  id: number;
  slug: string;
  name: string;

  elementCode: ElementType;
  elementName: string;
  listImage: string;
  elementImage: string;

  meleeProficiency: MeleeWeaponType;
  meleeProficiencyLabel: string;
  rangedProficiency: RangedWeaponType;
  rangedProficiencyLabel: string;

  features: {
    featureCode: string;
    featureName: string;
  }[];
}
