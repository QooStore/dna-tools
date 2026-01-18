"use client";

import BasicSection from "./BasicSection";
import FeaturesSection from "./FeaturesSection";
import IntronsSection from "./IntronsSection";
import PassiveSection from "./PassiveSection";
import SkillsSection from "./SkillsSection";
import StatsSection from "./StatsSection";
import WeaponSection from "./WeaponSection";
import { useCharacterForm } from "./useCharacterForm";

export default function CharacterForm({ initialData, onSubmit }: { initialData?: any; onSubmit: (data: any) => void }) {
  const { form, setForm } = useCharacterForm(initialData);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-8"
    >
      <BasicSection form={form} setForm={setForm} />
      <StatsSection form={form} setForm={setForm} />
      <WeaponSection form={form} setForm={setForm} />
      <FeaturesSection form={form} setForm={setForm} />
      <SkillsSection form={form} setForm={setForm} />
      <IntronsSection form={form} setForm={setForm} />
      <PassiveSection form={form} setForm={setForm} />

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
