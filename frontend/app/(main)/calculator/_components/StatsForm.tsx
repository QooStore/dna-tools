"use client";

import { WedgeTab, BuildStats, StatField } from "@/domains/calculator/types";

type Props = {
  activeTab: WedgeTab;
  stats: BuildStats;
  onChange: (stats: BuildStats) => void;
  currentHpPercent: number;
};

// --- 필드 정의 ---

interface FieldDef {
  key: string;
  label: string;
  path: string[]; // e.g. ["common", "attackPercent"] or ["melee", "critRate"]
  columns: ("base" | "wedge" | "buff")[]; // 어떤 열을 표시할지
}

const BASE_ATTACK_FIELDS: { key: string; label: string; statsKey: keyof BuildStats["baseAttacks"] }[] = [
  { key: "characterAtk", label: "캐릭터 공격력", statsKey: "characterAtk" },
  { key: "meleeWeaponAtk", label: "근거리 무기 공격력", statsKey: "meleeWeaponAtk" },
  { key: "rangedWeaponAtk", label: "원거리 무기 공격력", statsKey: "rangedWeaponAtk" },
  { key: "consonanceWeaponAtk", label: "동조 무기 공격력", statsKey: "consonanceWeaponAtk" },
];

const COMMON_FIELDS: FieldDef[] = [
  { key: "attackPercent", label: "공격력(%)", path: ["common", "attackPercent"], columns: ["base", "wedge", "buff"] },
  { key: "elementAttack", label: "속성 공격(%)", path: ["common", "elementAttack"], columns: ["wedge", "buff"] },
  { key: "damage", label: "대미지(%)", path: ["common", "damage"], columns: ["wedge", "buff"] },
  { key: "additionalDamage", label: "추가 대미지(%)", path: ["common", "additionalDamage"], columns: ["wedge", "buff"] },
  { key: "morale", label: "격양(%)", path: ["common", "morale"], columns: ["base", "wedge", "buff"] },
  { key: "resolve", label: "필사(%)", path: ["common", "resolve"], columns: ["base", "wedge", "buff"] },
];

const CHARACTER_FIELDS: FieldDef[] = [
  { key: "skillIntensity", label: "스킬 위력(%)", path: ["character", "skillIntensity"], columns: ["wedge", "buff"] },
  { key: "skillDamage", label: "스킬 대미지(%)", path: ["character", "skillDamage"], columns: ["wedge", "buff"] },
];

const WEAPON_FIELDS: FieldDef[] = [
  { key: "weaponDamage", label: "무기 대미지(%)", path: ["melee", "weaponDamage"], columns: ["wedge", "buff"] },
  { key: "attackSpeed", label: "공격속도(%)", path: ["melee", "attackSpeed"], columns: ["wedge", "buff"] },
  { key: "critRate", label: "크리티컬 확률(%)", path: ["melee", "critRate"], columns: ["base", "wedge", "buff"] },
  { key: "critDamage", label: "크리티컬 대미지(%)", path: ["melee", "critDamage"], columns: ["base", "wedge", "buff"] },
];

const CONSONANCE_FIELDS: FieldDef[] = [
  { key: "skillIntensity", label: "스킬 위력(%)", path: ["consonance", "skillIntensity"], columns: ["wedge", "buff"] },
  { key: "weaponDamage", label: "무기 대미지(%)", path: ["consonance", "weaponDamage"], columns: ["wedge", "buff"] },
  { key: "attackSpeed", label: "공격속도(%)", path: ["consonance", "attackSpeed"], columns: ["wedge", "buff"] },
  { key: "critRate", label: "크리티컬 확률(%)", path: ["consonance", "critRate"], columns: ["base", "wedge", "buff"] },
  { key: "critDamage", label: "크리티컬 대미지(%)", path: ["consonance", "critDamage"], columns: ["base", "wedge", "buff"] },
];

function getTabFields(tab: WedgeTab): FieldDef[] {
  switch (tab) {
    case "character":
      return CHARACTER_FIELDS;
    case "melee":
      return WEAPON_FIELDS;
    case "ranged":
      return WEAPON_FIELDS.map((f) => ({ ...f, path: ["ranged", f.path[1]] }));
    case "consonance":
      return CONSONANCE_FIELDS;
  }
}

function getTabLabel(tab: WedgeTab): string {
  switch (tab) {
    case "character": return "스킬 대미지";
    case "melee": return "근거리 무기 대미지";
    case "ranged": return "원거리 무기 대미지";
    case "consonance": return "동조 무기 대미지";
  }
}

// --- 값 접근 헬퍼 ---

function getField(stats: BuildStats, path: string[]): StatField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = stats;
  for (const p of path) obj = obj[p];
  return obj as StatField;
}

function setField(stats: BuildStats, path: string[], col: keyof StatField, value: number): BuildStats {
  const clone = JSON.parse(JSON.stringify(stats)) as BuildStats;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let obj: any = clone;
  for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
  obj[path[path.length - 1]][col] = value;
  return clone;
}

// --- 컴포넌트 ---

export default function StatsForm({ activeTab, stats, onChange, currentHpPercent }: Props) {
  const tabFields = getTabFields(activeTab);

  const handleBaseAttack = (key: keyof BuildStats["baseAttacks"], val: number) => {
    onChange({
      ...stats,
      baseAttacks: { ...stats.baseAttacks, [key]: val },
    });
  };

  const handleField = (path: string[], col: keyof StatField, val: number) => {
    onChange(setField(stats, path, col, val));
  };

  return (
    <div className="space-y-4">
      {/* 기본 공격력 + HP */}
      <Section title="기본 공격력">
        <div className="grid grid-cols-2 gap-2">
          {BASE_ATTACK_FIELDS.map((f) => (
            <div key={f.key} className="flex items-center gap-2">
              <label className="text-[11px] text-white/40 w-28 flex-shrink-0">{f.label}</label>
              <NumberInput
                value={stats.baseAttacks[f.statsKey]}
                onChange={(v) => handleBaseAttack(f.statsKey, v)}
              />
            </div>
          ))}
        </div>

        {/* HP 표시 */}
        <div className="mt-2 flex items-center gap-2">
          <label className="text-[11px] text-white/40 w-28 flex-shrink-0">현재 HP</label>
          <div className="flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-sm tabular-nums text-white/60">
            {currentHpPercent}%
          </div>
        </div>
      </Section>

      {/* 공통 필드 */}
      <Section title="공통 스탯">
        <FieldHeader />
        {COMMON_FIELDS.map((f) => (
          <FieldRow
            key={f.key}
            def={f}
            field={getField(stats, f.path)}
            onChange={(col, val) => handleField(f.path, col, val)}
          />
        ))}
      </Section>

      {/* 탭별 필드 */}
      <Section title={getTabLabel(activeTab)}>
        <FieldHeader />
        {tabFields.map((f) => (
          <FieldRow
            key={`${activeTab}-${f.key}`}
            def={f}
            field={getField(stats, f.path)}
            onChange={(col, val) => handleField(f.path, col, val)}
          />
        ))}
      </Section>
    </div>
  );
}

// --- 하위 컴포넌트 ---

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <h4 className="mb-2 text-[11px] font-semibold text-white/40 uppercase tracking-wider">{title}</h4>
      {children}
    </div>
  );
}

function FieldHeader() {
  return (
    <div className="grid grid-cols-[1fr_80px_80px_80px] gap-1.5 mb-1 px-1">
      <span />
      <span className="text-[10px] text-white/30 text-center">기본 스탯</span>
      <span className="text-[10px] text-white/30 text-center">쐐기/무기</span>
      <span className="text-[10px] text-white/30 text-center">버프</span>
    </div>
  );
}

function FieldRow({
  def,
  field,
  onChange,
}: {
  def: FieldDef;
  field: StatField;
  onChange: (col: keyof StatField, val: number) => void;
}) {
  const cols: (keyof StatField)[] = ["base", "wedge", "buff"];

  return (
    <div className="grid grid-cols-[1fr_80px_80px_80px] gap-1.5 items-center py-0.5 px-1">
      <span className="text-xs text-white/60">{def.label}</span>
      {cols.map((col) => {
        const enabled = def.columns.includes(col);
        return (
          <div key={col}>
            {enabled ? (
              <NumberInput value={field[col]} onChange={(v) => onChange(col, v)} />
            ) : (
              <div className="h-7 rounded bg-white/[0.02]" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NumberInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <input
      type="number"
      value={value || ""}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className="
        h-7 w-full rounded-md
        bg-white/5 px-2
        text-center text-xs tabular-nums text-white/80
        outline-none ring-1 ring-white/10
        focus:ring-cyan-400/50 focus:bg-white/[0.08]
        placeholder:text-white/20
        [appearance:textfield]
        [&::-webkit-outer-spin-button]:appearance-none
        [&::-webkit-inner-spin-button]:appearance-none
      "
      placeholder="0"
    />
  );
}
