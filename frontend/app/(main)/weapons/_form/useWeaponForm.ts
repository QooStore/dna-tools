import { useState } from "react";
import { WeaponFormState } from "@/domains/weaponForm";

const emptyForm: WeaponFormState = {
  slug: "",
  name: "",
  image: "",

  category: "",
  weaponType: "",
  attackType: "",
  element: "",

  attack: 0,
  critRate: 0,
  critDamage: 0,
  attackSpeed: 0,
  triggerProbability: 0,

  chargeAttackSpeed: 0,
  fallAttackSpeed: 0,

  multishot: 0,
  magCapacity: 0,
  maxAmmo: 0,
  ammoConversionRate: 0,

  passiveStat: "",
  passiveValue: 0,

  activeSkillDescription: "",
};

export function useWeaponForm(initial?: Partial<WeaponFormState>) {
  const [form, setForm] = useState<WeaponFormState>({
    ...emptyForm,
    ...initial,
  });

  return { form, setForm };
}
