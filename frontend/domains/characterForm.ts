export interface CharacterStatsForm {
  attack: number;
  hp: number;
  defense: number;
  maxMentality: number;
  resolve: number;
  morale: number;
}

export interface ConsonanceWeaponForm {
  category: string;
  weaponType: string;
  attackType: string;
  attack: number;
  critRate: number;
  critDamage: number;
  attackSpeed: number;
  triggerProbability: number;
  multishot?: number;
}

export interface SkillForm {
  name: string;
  type: string;
  description: string;
}

export interface IntronForm {
  stage: number;
  description: string;
}

export interface FeatureForm {
  featureCode: string;
}

export interface PassiveUpgradeForm {
  upgradeKey: string;
  upgradeType: "STAT" | "ABILITY" | "COOP";
  targetStat?: string;
  value?: number;
  name: string;
  description?: string;
}

export interface CharacterFormState {
  slug: string;
  name: string;
  elementCode: string;
  image: string;
  elementImage: string;
  listImage: string;
  meleeProficiency: string;
  rangedProficiency: string;

  stats: CharacterStatsForm;
  consonanceWeapon: ConsonanceWeaponForm;

  features: FeatureForm[];
  skills: SkillForm[];
  introns: IntronForm[];
  passiveUpgrades: PassiveUpgradeForm[];
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

  stats?: CharacterStatsForm;
  consonanceWeapon?: ConsonanceWeaponForm;

  features?: FeatureForm[];
  skills?: SkillForm[];
  introns?: IntronForm[];
  passiveUpgrades?: PassiveUpgradeForm[];
}
