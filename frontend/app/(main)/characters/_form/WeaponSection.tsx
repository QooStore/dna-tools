import type React from "react";

import FormSectionRenderer from "./FormSectionRenderer";
import { WEAPON_FIELDS } from "@/domains/characters/fields";
import { CharacterFormState } from "@/domains/characterForm";

type Props = {
  form: CharacterFormState;
  setForm: React.Dispatch<React.SetStateAction<CharacterFormState>>;
};

export default function WeaponSection({ form, setForm }: Props) {
  return (
    <FormSectionRenderer
      title="동조 무기"
      fields={WEAPON_FIELDS}
      value={form?.consonanceWeapon}
      onChange={(key, value) =>
        setForm((prev) => ({
          ...prev,
          consonanceWeapon: {
            ...prev.consonanceWeapon,
            [key]: value,
          },
        }))
      }
    />
  );
}
