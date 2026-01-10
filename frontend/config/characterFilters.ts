export type FilterGroup = {
  key: string;
  options: string[];
};

export const CHARACTER_FILTERS: FilterGroup[] = [
  {
    key: "element",
    options: ["All", "hydro", "pyro", "anemo", "electro", "lumino", "umbro"],
  },
  {
    key: "meleeProficiency",
    options: ["All", "sword", "dualBlades", "greatsword", "polearm"],
  },
  {
    key: "rangedProficiency",
    options: ["All", "pistol", "assaultRifle", "bow", "shotgun"],
  },
  {
    key: "feature",
    options: [
      "All",
      "dps",
      "support",
      "heal",
      "sanityRecovery",
      "consonanceWeapon",
      "weaponDmg",
      "skillDmg",
      "summon",
      "control",
      "shield",
      "maxHp",
      "def",
      "maxSanity",
    ],
  },
];
