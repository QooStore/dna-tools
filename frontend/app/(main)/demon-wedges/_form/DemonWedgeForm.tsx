"use client";

import BasicSection from "./BasicSection";
import StatsSection from "./StatsSection";
import EffectSection from "./EffectSection";
import { useDemonWedgeForm } from "./useDemonWedgeForm";
import { buildDemonWedgePayload } from "@/domains/demonWedges/buildPayload";
import { DemonWedgeFormState, DemonWedgeSaveRequest } from "@/domains/demonWedgeForm";
import ConditionalEffectsSection from "@/components/ui/ConditionalEffectsSection";

export default function DemonWedgeForm({
  initialData,
  onSubmit,
}: {
  initialData?: Partial<DemonWedgeFormState>;
  onSubmit: (data: DemonWedgeSaveRequest) => void;
}) {
  const { form, setForm } = useDemonWedgeForm(initialData);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const payload = buildDemonWedgePayload(form);
        onSubmit(payload);
      }}
      className="space-y-8"
    >
      <BasicSection form={form} setForm={setForm} />
      <StatsSection form={form} setForm={setForm} />
      <EffectSection form={form} setForm={setForm} />
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
