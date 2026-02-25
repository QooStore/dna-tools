"use client";

import type React from "react";

import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import SelectComponent from "@/components/ui/FormSelect";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { numberValue } from "@/lib/utils";

export type ConditionalEffectItem = {
  sourceType?: string | null;
  intronStage?: number | null;
  statType: string;
  value: number;
};

const SOURCE_TYPE_OPTIONS = [
  { value: "SKILL", label: "스킬 버프" },
  { value: "PASSIVE", label: "패시브" },
  { value: "INTRON", label: "근원" },
];

const INTRON_STAGE_OPTIONS = [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: `${n}단계` }));

type Props = {
  effects: ConditionalEffectItem[];
  onChange: (effects: ConditionalEffectItem[]) => void;
  withSourceType?: boolean;
};

export default function ConditionalEffectsSection({ effects, onChange, withSourceType = false }: Props) {
  const statOptions = useCodeOptions("STAT");

  const add = () => {
    onChange([
      ...effects,
      {
        ...(withSourceType ? { sourceType: "SKILL" } : {}),
        statType: "",
        value: 0,
      },
    ]);
  };

  const update = <K extends keyof ConditionalEffectItem>(index: number, key: K, value: ConditionalEffectItem[K]) => {
    const next = [...effects];
    next[index] = { ...next[index], [key]: value };
    if (key === "sourceType" && value !== "INTRON") {
      delete next[index].intronStage;
    }
    onChange(next);
  };

  const remove = (index: number) => {
    onChange(effects.filter((_, i) => i !== index));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">조건부 효과 (계산기 토글)</h2>
        <button type="button" onClick={add} className="text-sm text-indigo-400 hover:text-indigo-300">
          + 효과 추가
        </button>
      </div>

      <div className="space-y-4">
        {effects.map((effect, index) => (
          <div key={index} className="rounded-lg border border-white/10 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">효과 {index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                삭제
              </button>
            </div>

            {/* sourceType (캐릭터 전용) */}
            {withSourceType && (
              <div className="space-y-1">
                <LabelComponent>출처</LabelComponent>
                <SelectComponent
                  value={effect.sourceType ?? "SKILL"}
                  options={SOURCE_TYPE_OPTIONS}
                  onChange={(v) => update(index, "sourceType", v)}
                />
              </div>
            )}

            {/* intronStage (INTRON일 때만) */}
            {withSourceType && effect.sourceType === "INTRON" && (
              <div className="space-y-1">
                <LabelComponent>근원 단계</LabelComponent>
                <SelectComponent
                  value={String(effect.intronStage ?? "")}
                  options={INTRON_STAGE_OPTIONS}
                  placeholder="단계 선택"
                  onChange={(v) => update(index, "intronStage", Number(v))}
                />
              </div>
            )}

            {/* statType */}
            <div className="space-y-1">
              <LabelComponent>스탯 종류</LabelComponent>
              <SelectComponent
                value={effect.statType}
                options={statOptions}
                placeholder="스탯 선택"
                onChange={(v) => update(index, "statType", v)}
              />
            </div>

            {/* value */}
            <div className="space-y-1">
              <LabelComponent>수치</LabelComponent>
              <InputComponent
                type="number"
                value={numberValue(effect.value)}
                placeholder="수치"
                onChange={(v) => update(index, "value", Number(v))}
              />
            </div>


          </div>
        ))}

        {effects.length === 0 && <p className="text-sm text-white/40">등록된 조건부 효과가 없습니다.</p>}
      </div>
    </section>
  );
}
