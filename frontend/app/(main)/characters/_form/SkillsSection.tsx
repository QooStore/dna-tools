import type React from "react";

import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import SelectComponent from "@/components/ui/FormSelect";
import { SKILL_TYPE_OPTIONS } from "@/config/options";
import { CharacterFormState, SkillForm } from "@/domains/characterForm";

type SkillItem = {
  name: string;
  type: string;
  description: string;
};

type Props = {
  form: CharacterFormState;
  setForm: React.Dispatch<React.SetStateAction<CharacterFormState>>;
};

export default function SkillSection({ form, setForm }: Props) {
  const skills: SkillItem[] = form?.skills ?? [];

  const addSkill = () => {
    setForm((prev) => ({
      ...prev,
      skills: [...(prev.skills ?? []), { name: "", type: "buff", description: "" }],
    }));
  };

  const updateSkill = <K extends keyof SkillForm>(index: number, key: K, value: SkillForm[K]) => {
    setForm((prev) => {
      const next = [...prev.skills];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, skills: next };
    });
  };

  const removeSkill = (index: number) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i: number) => i !== index),
    }));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">스킬</h2>
        <button type="button" onClick={addSkill} className="text-sm text-indigo-400 hover:text-indigo-300">
          + 스킬 추가
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div key={index} className="rounded-lg border border-white/10 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">스킬 {index + 1}</span>
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                삭제
              </button>
            </div>

            {/* name */}
            <div className="space-y-1">
              <LabelComponent>스킬 이름</LabelComponent>
              <InputComponent
                value={skill.name}
                placeholder="스킬 이름"
                onChange={(v) => updateSkill(index, "name", v)}
              />
            </div>

            {/* type */}
            <div className="space-y-1">
              <LabelComponent>스킬 타입</LabelComponent>
              <SelectComponent
                value={skill.type}
                options={SKILL_TYPE_OPTIONS}
                placeholder="스킬 타입 선택"
                onChange={(v) => updateSkill(index, "type", v)}
              />
            </div>

            {/* description */}
            <div className="space-y-1">
              <LabelComponent>설명</LabelComponent>
              <InputComponent
                value={skill.description}
                placeholder="스킬 설명"
                onChange={(v) => updateSkill(index, "description", v)}
              />
            </div>
          </div>
        ))}

        {skills.length === 0 && <p className="text-sm text-white/40">등록된 스킬이 없습니다.</p>}
      </div>
    </section>
  );
}
