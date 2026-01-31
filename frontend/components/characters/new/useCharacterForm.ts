import { useState } from "react";
import { CharacterFormState } from "@/domains/characterForm";

const emptyForm: CharacterFormState = {
  slug: "",
  name: "",
  elementCode: "",
  image: "",
  elementImage: "",
  listImage: "",
  meleeProficiency: "",
  rangedProficiency: "",

  stats: {
    attack: 0,
    hp: 0,
    defense: 0,
    maxMentality: 0,
    resolve: 0,
    morale: 0,
  },

  consonanceWeapon: {
    category: "",
    weaponType: "",
    attackType: "",
    attack: 0,
    critRate: 0,
    critDamage: 0,
    attackSpeed: 0,
    triggerProbability: 0,
  },

  features: [],
  skills: [],
  introns: [],
  passiveUpgrades: [],
};

export function useCharacterForm(initial?: Partial<CharacterFormState>) {
  const [form, setForm] = useState<CharacterFormState>({
    ...emptyForm,
    ...initial,
  });

  return { form, setForm };
}
