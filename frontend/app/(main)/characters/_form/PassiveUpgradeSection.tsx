import type React from "react";

import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import SelectComponent from "@/components/ui/FormSelect";
import { PASSIVE_UPGRADE_TYPE_OPTIONS, TARGET_STAT_OPTIONS } from "@/config/options";

import { numberValue } from "@/lib/utils";
import { CharacterFormState } from "@/domains/characterForm";

type PassiveUpgradeItem = {
  upgradeKey: string;
  upgradeType: "STAT" | "ABILITY" | "COOP";
  targetStat?: string;
  value?: number;
  name: string;
  description: string;
};

type Props = {
  form: CharacterFormState;
  setForm: React.Dispatch<React.SetStateAction<CharacterFormState>>;
};

export default function PassiveUpgradeSection({ form, setForm }: Props) {
  const upgrades = form?.passiveUpgrades ?? [];

  const addUpgrade = () => {
    setForm((prev) => ({
      ...prev,
      passiveUpgrades: [
        ...(prev.passiveUpgrades ?? []),
        {
          upgradeKey: "",
          upgradeType: "STAT",
          name: "",
          description: "",
        },
      ],
    }));
  };

  const updateUpgrade = <K extends keyof PassiveUpgradeItem>(index: number, key: K, value: PassiveUpgradeItem[K]) => {
    setForm((prev) => {
      const next = [...prev.passiveUpgrades];
      next[index] = { ...next[index], [key]: value };

      // ABILITY면 불필요 필드 제거
      if (key === "upgradeType" && value === "ABILITY") {
        delete next[index].targetStat;
        delete next[index].value;
      }

      return { ...prev, passiveUpgrades: next };
    });
  };

  const removeUpgrade = (index: number) => {
    setForm((prev) => ({
      ...prev,
      passiveUpgrades: prev.passiveUpgrades.filter((_, i: number) => i !== index),
    }));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">패시브 업그레이드</h2>
        <button type="button" onClick={addUpgrade} className="text-sm text-indigo-400 hover:text-indigo-300">
          + 패시브 추가
        </button>
      </div>

      <div className="space-y-4">
        {upgrades.map((p, index) => (
          <div key={index} className="rounded-lg border border-white/10 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/60">패시브 {index + 1}</span>
              <button
                type="button"
                onClick={() => removeUpgrade(index)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                삭제
              </button>
            </div>

            {/* upgradeKey */}
            <div className="space-y-1">
              <LabelComponent>업그레이드 키</LabelComponent>
              <InputComponent value={p.upgradeKey} onChange={(v) => updateUpgrade(index, "upgradeKey", v)} />
            </div>

            {/* upgradeType */}
            <div className="space-y-1">
              <LabelComponent>업그레이드 타입</LabelComponent>
              <SelectComponent
                value={p.upgradeType}
                options={PASSIVE_UPGRADE_TYPE_OPTIONS}
                onChange={(v) => updateUpgrade(index, "upgradeType", v as PassiveUpgradeItem["upgradeType"])}
              />
            </div>

            {/* STAT / COOP 전용 */}
            {p.upgradeType !== "ABILITY" && (
              <>
                <div className="space-y-1">
                  <LabelComponent>대상 스탯</LabelComponent>
                  <SelectComponent
                    value={p.targetStat ?? ""}
                    options={TARGET_STAT_OPTIONS}
                    placeholder="스탯 선택"
                    onChange={(v) => updateUpgrade(index, "targetStat", v)}
                  />
                </div>

                <div className="space-y-1">
                  <LabelComponent>수치 (%)</LabelComponent>
                  <InputComponent
                    type="number"
                    value={numberValue(p.value)}
                    onChange={(v) => updateUpgrade(index, "value", Number(v))}
                  />
                </div>
              </>
            )}

            {/* name */}
            <div className="space-y-1">
              <LabelComponent>이름</LabelComponent>
              <InputComponent value={p.name} onChange={(v) => updateUpgrade(index, "name", v)} />
            </div>

            {/* description */}
            <div className="space-y-1">
              <LabelComponent>설명</LabelComponent>
              <InputComponent value={p.description ?? ""} onChange={(v) => updateUpgrade(index, "description", v)} />
            </div>
          </div>
        ))}

        {upgrades.length === 0 && <p className="text-sm text-white/40">등록된 패시브 업그레이드가 없습니다.</p>}
      </div>
    </section>
  );
}
