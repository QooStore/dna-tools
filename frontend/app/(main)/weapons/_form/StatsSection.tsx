import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import { WEAPON_COMMON_STATS_FIELDS, WEAPON_MELEE_FIELDS, WEAPON_RANGED_FIELDS } from "@/config/fields";
import type { Field } from "@/config/fields";
import { WeaponFormState } from "@/domains/weaponForm";
import { numberValue } from "@/lib/utils";

type Props = {
  form: WeaponFormState;
  setForm: React.Dispatch<React.SetStateAction<WeaponFormState>>;
};

export default function StatsSection({ form, setForm }: Props) {
  const updateNum = (key: string, value: number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const categoryFields =
    form.category === "melee" ? WEAPON_MELEE_FIELDS : form.category === "ranged" ? WEAPON_RANGED_FIELDS : [];

  const allFields: readonly Field[] = [...WEAPON_COMMON_STATS_FIELDS, ...categoryFields];

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">스탯</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allFields.map((f) => (
          <div key={f.key} className="space-y-1">
            <LabelComponent>{f.label}</LabelComponent>
            <InputComponent
              type="number"
              value={numberValue(form[f.key as keyof WeaponFormState] as number)}
              placeholder={f.placeholder ?? f.label}
              onChange={(v) => updateNum(f.key, Number(v))}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
