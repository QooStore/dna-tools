import FormSectionRenderer from "@/components/characters/new/FormSectionRenderer";
import { WEAPON_FIELDS } from "@/domains/fields/weaponFields";
import type React from "react";

type Props = {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function WeaponSection({ form, setForm }: Props) {
  return (
    <FormSectionRenderer
      title="동조 무기"
      fields={WEAPON_FIELDS}
      value={form?.consonanceWeapon}
      onChange={(key, value) =>
        setForm((prev: any) => ({
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
