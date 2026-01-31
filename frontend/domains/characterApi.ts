export interface CharacterStatsRequest {
  attack: number;
  hp: number;
  defense: number;
  maxMentality: number;
  resolve: number;
  morale: number;
}

export interface ConsonanceWeaponRequest {
  category: string;
  weaponType: string;
  attackType: string;
  attack: number;
  critRate: number;
  critDamage: number;
  attackSpeed: number;
  triggerProbability: number;
}

export interface SkillRequest {
  name: string;
  type: string;
  description: string;
}

export interface IntronRequest {
  stage: number;
  description: string;
}

export interface IntronRequest {
  featureCode: string;
}

export interface PassiveUpgradeRequest {
  upgradeKey: string;
  upgradeType: "STAT" | "ABILITY" | "COOP";
  targetStat?: string;
  value?: number;
  name: string;
  description?: string;
}

export interface CharacterSaveRequest {
  slug: string;
  name: string;
  elementCode: string;
  image: string;
  elementImage: string;
  listImage: string;
  meleeProficiency: string;
  rangedProficiency: string;

  stats?: CharacterStatsRequest;
  consonanceWeapon?: ConsonanceWeaponRequest;

  features?: IntronRequest[];
  skills?: SkillRequest[];
  introns?: IntronRequest[];
  passiveUpgrades?: PassiveUpgradeRequest[];
}
