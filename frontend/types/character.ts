export type ElementType = "불" | "물" | "번개" | "바람" | "빛" | "어둠";

export type WeaponCategory = "근접" | "원거리";

export type MeleeWeaponType = "대검" | "한손검" | "쌍도" | "대도" | "장병기" | "칼날 채찍";

export type RangedWeaponType = "활" | "핸드 캐논" | "쌍권총" | "돌격소총" | "권총" | "산탄총";

export type ConsonanceWeaponStats =
  | {
      category: "근접";
      type: MeleeWeaponType;
      attackType: "베기" | "관통" | "진동";

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
    }
  | {
      category: "원거리";
      type: RangedWeaponType;
      attackType: "베기" | "관통" | "진동";

      attack: number;
      critRate: number;
      critDamage: number;
      attackSpeed: number;
      triggerProbability: number;
    };

export type PassiveUpgradeType = "STAT" | "ABILITY" | "COOP";

export type PassiveTargetStat = "ATK" | "SKILL_EFFICIENCY";

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

export interface IntronEffect {
  stage: number; // 1~6
  description: string;
}

export interface CharacterPassiveUpgrade {
  upgradeKey: string; // atk_20, afterburn
  upgradeType: PassiveUpgradeType;

  targetStat?: PassiveTargetStat; // STAT일 때만
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
  element: ElementType;
  image: string;
  element_image: string;

  /** 무기 숙련 */
  meleeProficiency: MeleeWeaponType;
  rangedProficiency: RangedWeaponType;

  /** 역할 태그 */
  features: string[];

  /** 기본 스탯 (캐릭터 고정값) */
  baseStats: BaseStats;

  /** 동조 무기 (없을 수도 있음) */
  consonanceWeapon?: ConsonanceWeaponStats;

  /** 스킬 목록 */
  skills: Skill[];

  /** 패시브 강화 */
  passiveUpgrade: CharacterPassiveUpgrade[];

  /** 근원 */
  intron: IntronEffect[];
}
