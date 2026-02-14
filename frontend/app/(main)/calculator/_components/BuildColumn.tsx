"use client";

import { useState } from "react";
import { BuildState, SlotCategory, WedgeTab, BuildStats } from "@/domains/calculator/types";
import { CharacterDetail } from "@/domains/characters/types";
import ItemSlot from "./ItemSlot";
import WedgeTabPanel from "./WedgeTabPanel";
import StatsForm from "./StatsForm";

const STAT_LABELS: Record<string, string> = {
  ATK: "공격력",
  HP: "체력",
  DEF: "방어력",
  SKILL_EFFICIENCY: "스킬 효율",
  atk: "공격력",
  hp: "체력",
  def: "방어력",
};

type Props = {
  label: string;
  accent: "cyan" | "amber";
  build: BuildState;
  stats: BuildStats;
  onStatsChange: (stats: BuildStats) => void;
  currentHpPercent: number;
  onOpenModal: (cat: SlotCategory, index?: number) => void;
  onClear: (cat: SlotCategory, index?: number) => void;
};

export default function BuildColumn({ label, accent, build, stats, onStatsChange, currentHpPercent, onOpenModal, onClear }: Props) {
  const [activeTab, setActiveTab] = useState<WedgeTab>("character");
  const borderColor = accent === "cyan" ? "border-cyan-400/20" : "border-amber-400/20";
  const titleColor = accent === "cyan" ? "text-cyan-300" : "text-amber-300";

  const weaponSub = (w: typeof build.meleeWeapon) =>
    w ? `ATK ${w.attack} · 치확 ${w.critRate}% · 치피 ${w.critDamage}%` : undefined;

  return (
    <div className={`rounded-2xl border ${borderColor} bg-white/[0.02] p-5 space-y-5`}>
      {/* 헤더 */}
      <h3 className={`text-center text-lg font-bold ${titleColor}`}>{label}</h3>

      {/* 캐릭터 + 무기 */}
      <section className="space-y-3">
        <ItemSlot
          label="캐릭터 선택"
          image={build.character?.image}
          name={build.character?.name}
          subtitle={
            build.character
              ? `ATK ${build.character.stats.attack} · HP ${build.character.stats.hp} · DEF ${build.character.stats.defense}`
              : undefined
          }
          accent={accent}
          onSelect={() => onOpenModal("character")}
          onClear={() => onClear("character")}
        />

        <div className="grid grid-cols-2 gap-3">
          <ItemSlot
            label="근거리 무기"
            image={build.meleeWeapon?.image}
            name={build.meleeWeapon?.name}
            subtitle={weaponSub(build.meleeWeapon)}
            accent={accent}
            onSelect={() => onOpenModal("meleeWeapon")}
            onClear={() => onClear("meleeWeapon")}
          />
          <ItemSlot
            label="원거리 무기"
            image={build.rangedWeapon?.image}
            name={build.rangedWeapon?.name}
            subtitle={weaponSub(build.rangedWeapon)}
            accent={accent}
            onSelect={() => onOpenModal("rangedWeapon")}
            onClear={() => onClear("rangedWeapon")}
          />
        </div>
      </section>

      {/* 협력 동료 */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider">협력 동료 (Allies)</h4>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <ItemSlot
              label="협력 동료 1"
              image={build.ally1?.image}
              name={build.ally1?.name}
              subtitle={getCoopSummary(build.ally1)}
              accent={accent}
              onSelect={() => onOpenModal("ally1")}
              onClear={() => onClear("ally1")}
            />
            {build.ally1 && <CoopBadges character={build.ally1} />}
          </div>

          <div className="space-y-1.5">
            <ItemSlot
              label="협력 동료 2"
              image={build.ally2?.image}
              name={build.ally2?.name}
              subtitle={getCoopSummary(build.ally2)}
              accent={accent}
              onSelect={() => onOpenModal("ally2")}
              onClear={() => onClear("ally2")}
            />
            {build.ally2 && <CoopBadges character={build.ally2} />}
          </div>
        </div>
      </section>

      {/* 악마의 쐐기 탭 패널 */}
      <section>
        <WedgeTabPanel
          activeTab={activeTab}
          onTabChange={setActiveTab}
          characterWedges={build.characterWedges}
          meleeWedges={build.meleeWedges}
          rangedWedges={build.rangedWedges}
          consonanceWedges={build.consonanceWedges}
          onOpenModal={onOpenModal}
          onClear={onClear}
        />
      </section>

      {/* 스탯 입력 폼 */}
      <section>
        <StatsForm
          activeTab={activeTab}
          stats={stats}
          onChange={onStatsChange}
          currentHpPercent={currentHpPercent}
        />
      </section>
    </div>
  );
}

/* 협력 동료 COOP 패시브 요약 텍스트 */
function getCoopSummary(char: CharacterDetail | null): string | undefined {
  if (!char) return undefined;
  const coops = char.passiveUpgrades.filter((p) => p.upgradeType === "COOP");
  if (coops.length === 0) return "COOP 없음";
  return coops.map((c) => `${STAT_LABELS[c.targetStat ?? ""] ?? c.targetStat} +${c.value}%`).join(", ");
}

/* 협력 동료 COOP 버프 배지 */
function CoopBadges({ character }: { character: CharacterDetail }) {
  const coops = character.passiveUpgrades.filter((p) => p.upgradeType === "COOP");
  if (coops.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {coops.map((c, i) => (
        <span
          key={i}
          className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300"
          title={c.description}
        >
          {STAT_LABELS[c.targetStat ?? ""] ?? c.targetStat} +{c.value}%
        </span>
      ))}
    </div>
  );
}
