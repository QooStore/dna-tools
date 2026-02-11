"use client";

import { SharedSettings, DamageType, ScalingType } from "@/domains/calculator/types";

type Props = {
  settings: SharedSettings;
  onChange: (s: SharedSettings) => void;
};

const DAMAGE_TYPES: { value: DamageType; label: string }[] = [
  { value: "weapon", label: "무기" },
  { value: "skill", label: "스킬" },
  { value: "consonanceWeapon", label: "동조 무기" },
];

const SCALING_TYPES: { value: ScalingType; label: string }[] = [
  { value: "ATK", label: "공격력" },
  { value: "HP", label: "체력" },
  { value: "DEF", label: "방어력" },
];

export default function SharedSettingsBar({ settings, onChange }: Props) {
  const update = <K extends keyof SharedSettings>(key: K, val: SharedSettings[K]) => {
    onChange({ ...settings, [key]: val });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <h2 className="mb-4 text-sm font-semibold text-white/50 uppercase tracking-wider">공유 설정</h2>

      <div className="flex flex-wrap items-center gap-6">
        {/* 대미지 타입 */}
        <div className="space-y-1.5">
          <label className="text-xs text-white/40">대미지 타입</label>
          <div className="flex gap-1">
            {DAMAGE_TYPES.map((dt) => (
              <button
                key={dt.value}
                onClick={() => update("damageType", dt.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  settings.damageType === dt.value
                    ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {dt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 스케일링 타입 */}
        <div className="space-y-1.5">
          <label className="text-xs text-white/40">스케일링 스탯</label>
          <div className="flex gap-1">
            {SCALING_TYPES.map((st) => (
              <button
                key={st.value}
                onClick={() => update("scalingType", st.value)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  settings.scalingType === st.value
                    ? "bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/40"
                    : "bg-white/5 text-white/50 hover:bg-white/10"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* 현재 HP */}
        <div className="flex-1 min-w-[200px] space-y-1.5">
          <label className="text-xs text-white/40">
            현재 HP: <span className="font-semibold text-white/70">{settings.currentHpPercent}%</span>
          </label>
          <input
            type="range"
            min={1}
            max={100}
            value={settings.currentHpPercent}
            onChange={(e) => update("currentHpPercent", Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}
