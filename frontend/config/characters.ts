import { CharacterListItem } from "@/domains/characters/character";

export const CHARACTERS: CharacterListItem[] = [
  {
    id: 1,
    slug: "berenica",
    name: "베레니카",
    listImage: "/images/character_list/berenica.png",
    elementCode: "pyro",
    elementImage: "/images/element_icon/umbro.png",
    features: [{ featureCode: "dmg" }, { featureCode: "weaponDmg" }],
    meleeProficiency: "sword",
    rangedProficiency: "pistol",
  },
  {
    id: 2,
    slug: "fina",
    name: "피나",
    listImage: "/images/character_list/fina.png",
    elementCode: "hydro",
    elementImage: "/images/element_icon/hydro.png",
    features: [{ featureCode: "support" }, { featureCode: "heal" }, { featureCode: "sanityRecovery" }],
    meleeProficiency: "dualBlades",
    rangedProficiency: "bow",
  },
  {
    id: 3,
    slug: "kezhuo",
    name: "커저우",
    listImage: "/images/character_list/tabethe.png",
    elementCode: "electro",
    elementImage: "/images/element_icon/electro.png",
    features: [
      { featureCode: "dps" },
      { featureCode: "skillDmg" },
      { featureCode: "control" },
      { featureCode: "support" },
      { featureCode: "heal" },
      { featureCode: "sanityRecovery" },
    ],
    meleeProficiency: "polearm",
    rangedProficiency: "shotgun",
  },
];
