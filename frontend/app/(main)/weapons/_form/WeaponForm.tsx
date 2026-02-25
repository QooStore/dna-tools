"use client";

import BasicSection from "./BasicSection";
import StatsSection from "./StatsSection";
import SkillSection from "./SkillSection";
import { useWeaponForm } from "./useWeaponForm";
import { buildWeaponPayload } from "@/domains/weapons/buildPayload";
import { WeaponFormState, WeaponSaveRequest } from "@/domains/weaponForm";
import ConditionalEffectsSection from "@/components/ui/ConditionalEffectsSection";

export default function WeaponForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<WeaponFormState>;
  onSubmit: (data: WeaponSaveRequest) => void;
}) {
  const { form, setForm } = useWeaponForm(initialData);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const payload = buildWeaponPayload(form);
        onSubmit(payload);
      }}
      className="space-y-8"
    >
      <BasicSection form={form} setForm={setForm} />
      <StatsSection form={form} setForm={setForm} />
      <SkillSection form={form} setForm={setForm} />
      <ConditionalEffectsSection
        effects={form.conditionalEffects}
        onChange={(effects) => setForm((prev) => ({ ...prev, conditionalEffects: effects }))}
      />

      <button
        type="submit"
        className="px-6 py-2 text-cyan-300
              border border-cyan-400/40
              rounded-lg
              hover:bg-cyan-400/10
              hover:border-cyan-300"
      >
        저장
      </button>
    </form>
  );
}
