import { useState } from "react";
import { DemonWedgeFormState } from "@/domains/demonWedgeForm";

const emptyForm: DemonWedgeFormState = {
  slug: "",
  name: "",
  image: "",
  rarity: 3,
  resistance: 0,
  tendency: "",
  equipType: "",
  element: "",
  isKukulkan: false,
  effectDescription: "",
  stats: [],
  conditionalEffects: [],
};

export function useDemonWedgeForm(initial?: Partial<DemonWedgeFormState>) {
  const [form, setForm] = useState<DemonWedgeFormState>({
    ...emptyForm,
    ...initial,
  });

  return { form, setForm };
}
