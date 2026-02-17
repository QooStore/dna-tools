"use client";

import { useMemo, useState } from "react";

import type { CharacterListItem } from "@/domains/characters/types";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { DemonWedgeListItem } from "@/domains/demonWedges/type";

import FormInput from "@/components/ui/FormInput";
import ContentSection from "@/components/ui/ContentSection";

import SlotCard from "./SlotCard";
import PickerModal from "./PickerModal";
import WedgeHoverCard from "./WedgeHoverCard";

import { CHARACTER_MODAL_FILTERS } from "@/config/characterFilters";
import { WEAPON_FILTERS } from "@/config/weaponFilters";
import { DEMON_WEDGE_FILTERS } from "@/config/demonWedgeFilters";

import { ActiveTab, BuildId, BuildState, emptyBuildState, BuffFields, emptyBuffFields } from "./calculatorTypes";
import { TAB_LABELS, applyWedgesToBuff, compute, sumBuffs, tabToEquipType } from "./calculatorLogic";

type Props = {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
  wedges: DemonWedgeListItem[];
};

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function format(n: number): string {
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

const BUFF_FIELD_META: { key: keyof BuffFields; label: string }[] = [
  { key: "characterAttackPct", label: "캐릭터 공격%" },
  { key: "elementAttackPct", label: "속성 공격%" },
  { key: "resolvePct", label: "필사%" },
  { key: "moralePct", label: "격양%" },
  { key: "skillPowerPct", label: "스킬 위력%" },
  { key: "skillDamagePct", label: "스킬 대미지%" },
  { key: "damagePct", label: "대미지%" },
  { key: "weaponDamagePct", label: "무기 대미지%" },
  { key: "weaponAttackPct", label: "무기 공격%" },
  { key: "critRatePct", label: "치명타 확률%" },
  { key: "critDamagePct", label: "치명타 피해%" },
  { key: "attackSpeedPct", label: "공격 속도%" },
  { key: "extraDamagePct", label: "추가 대미지%" },
];

const BUFF_SECTIONS: { key: keyof BuildState["buffs"]; label: string }[] = [
  { key: "passive", label: "패시브 버프" },
  { key: "characterWedge", label: "캐릭터 악마의 쐐기" },
  { key: "meleeWeaponWedge", label: "근접 무기 악마의 쐐기" },
  { key: "rangedWeaponWedge", label: "원거리 무기 악마의 쐐기" },
  { key: "meleeConsonanceWedge", label: "근접 동조 무기 악마의 쐐기" },
  { key: "rangedConsonanceWedge", label: "원거리 동조 무기 악마의 쐐기" },
];

function sectionKeyForTab(tab: ActiveTab): keyof BuildState["buffs"] {
  switch (tab) {
    case "character":
      return "characterWedge";
    case "meleeWeapon":
      return "meleeWeaponWedge";
    case "rangedWeapon":
      return "rangedWeaponWedge";
    case "meleeConsonanceWeapon":
      return "meleeConsonanceWedge";
    case "rangedConsonanceWeapon":
      return "rangedConsonanceWedge";
  }
}

export default function CalculatorClient({ characters, weapons, wedges }: Props) {
  const [activeBuild, setActiveBuild] = useState<BuildId>("A");

  const [buildA, setBuildA] = useState<BuildState>(() => emptyBuildState());
  const [buildB, setBuildB] = useState<BuildState>(() => emptyBuildState());

  const build = activeBuild === "A" ? buildA : buildB;
  const setBuild = activeBuild === "A" ? setBuildA : setBuildB;

  const meleeWeapons = useMemo(() => weapons.filter((w) => w.category === "melee"), [weapons]);
  const rangedWeapons = useMemo(() => weapons.filter((w) => w.category === "ranged"), [weapons]);

  const [picker, setPicker] = useState<
    | null
    | { type: "character"; target: "main" | "ally1" | "ally2" }
    | { type: "weapon"; target: "melee" | "ranged" }
    | { type: "wedge"; tab: ActiveTab; slotIndex: number }
  >(null);

  const bySlug = <T extends { slug: string }>(list: T[], slug: string | "") =>
    slug ? list.find((x) => x.slug === slug) : undefined;

  const selectedMain = useMemo(
    () => bySlug(characters, build.selections.characterSlug),
    [characters, build.selections.characterSlug],
  );
  const selectedAlly1 = useMemo(
    () => bySlug(characters, build.selections.ally1Slug),
    [characters, build.selections.ally1Slug],
  );
  const selectedAlly2 = useMemo(
    () => bySlug(characters, build.selections.ally2Slug),
    [characters, build.selections.ally2Slug],
  );
  const selectedMeleeWeapon = useMemo(
    () => bySlug(weapons, build.selections.meleeWeaponSlug),
    [weapons, build.selections.meleeWeaponSlug],
  );
  const selectedRangedWeapon = useMemo(
    () => bySlug(weapons, build.selections.rangedWeaponSlug),
    [weapons, build.selections.rangedWeaponSlug],
  );

  const wedgeOptionsForTab = useMemo(() => {
    const equipType = tabToEquipType[build.activeTab];
    return wedges.filter((w) => w.equipType === equipType);
  }, [wedges, build.activeTab]);

  const wedgeSlotItems = useMemo(() => {
    const slotSlugs = build.wedgeSlots[build.activeTab];
    return slotSlugs.map((s) => bySlug(wedges, s));
  }, [build.wedgeSlots, build.activeTab, wedges]);

  // 자동 반영(쐐기 스탯 합산) + 현재 build.buffs 해당 섹션에 덮어쓰기
  const syncWedgeBuff = (tab: ActiveTab, wedgeSlugs: string[]) => {
    const { buff, unsupported } = applyWedgesToBuff(wedges, wedgeSlugs);
    const sectionKey = sectionKeyForTab(tab);
    setBuild((prev) => ({
      ...prev,
      buffs: {
        ...prev.buffs,
        [sectionKey]: { ...buff, extraDamagePct: prev.buffs[sectionKey].extraDamagePct || 0 },
      },
    }));

    // 미지원 statType이 있으면 콘솔에만 찍어둠 (UI 경고는 다음 단계에서 붙이기)
    if (unsupported.length) {
      // eslint-disable-next-line no-console
      console.warn("[Calculator] Unsupported wedge stat types:", unsupported);
    }
  };

  const buildSelectButton = (id: BuildId) => (
    <button
      key={id}
      onClick={() => setActiveBuild(id)}
      className={`px-3 py-2 rounded-lg text-sm border transition ${
        activeBuild === id
          ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
          : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
      }`}
    >
      빌드 {id}
    </button>
  );

  return (
    <div className="space-y-8">
      {/* 상단 컨트롤 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {buildSelectButton("A")}
          {buildSelectButton("B")}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const from = activeBuild === "A" ? buildA : buildB;
              const toSetter = activeBuild === "A" ? setBuildB : setBuildA;
              toSetter(structuredClone(from));
            }}
            className="ml-2 px-3 py-2 rounded-lg text-sm border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
            title="현재 Build를 반대쪽으로 복사"
          >
            A↔B 복사
          </button>
        </div>
      </div>

      {/* 1) 상단 배치 영역 */}
      <ContentSection title="캐릭터 / 무기 선택">
        {/* 슬롯 카드 클릭 → 모달 선택 */}
        <div className="flex flex-col items-center gap-10">
          <div className="text-center">
            <div className="text-xl font-bold text-white/90">빌드 {activeBuild}</div>
            <div className="mt-4">
              <SlotCard
                label="출전 캐릭터"
                item={selectedMain}
                onClick={() => setPicker({ type: "character", target: "main" })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10">
            <SlotCard
              label="근접 무기"
              item={selectedMeleeWeapon}
              onClick={() => setPicker({ type: "weapon", target: "melee" })}
            />
            <SlotCard
              label="원거리 무기"
              item={selectedRangedWeapon}
              onClick={() => setPicker({ type: "weapon", target: "ranged" })}
            />
          </div>

          <div className="text-center">
            <div className="text-xl font-bold text-white/90">협력 동료</div>
            <div className="mt-6 grid grid-cols-2 gap-10">
              <SlotCard
                label="협력 동료 1"
                item={selectedAlly1}
                onClick={() => setPicker({ type: "character", target: "ally1" })}
              />
              <SlotCard
                label="협력 동료 2"
                item={selectedAlly2}
                onClick={() => setPicker({ type: "character", target: "ally2" })}
              />
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 2) 악마의 쐐기 탭 + 슬롯 선택 */}
      <ContentSection title="악마의 쐐기 세팅">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TAB_LABELS) as ActiveTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setBuild((prev) => ({ ...prev, activeTab: tab }))}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                build.activeTab === tab
                  ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
                  : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              {TAB_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* boarhat 스타일 슬롯 배치 */}
        <div className="mt-6">
          {build.activeTab === "character" ? (
            <div className="grid grid-cols-4 gap-8 justify-items-center">
              {wedgeSlotItems.slice(0, 4).map((it, i) => (
                <SlotCard
                  key={i}
                  size="sm"
                  label={`Slot ${i + 1}`}
                  item={it}
                  onClick={() => setPicker({ type: "wedge", tab: build.activeTab, slotIndex: i })}
                />
              ))}
              <div className="col-span-4 flex justify-center py-4">
                <SlotCard
                  size="sm"
                  label="Slot 9"
                  item={wedgeSlotItems[8]}
                  onClick={() => setPicker({ type: "wedge", tab: build.activeTab, slotIndex: 8 })}
                />
              </div>
              {wedgeSlotItems.slice(4, 8).map((it, i) => (
                <SlotCard
                  key={i + 4}
                  size="sm"
                  label={`Slot ${i + 5}`}
                  item={it}
                  onClick={() => setPicker({ type: "wedge", tab: build.activeTab, slotIndex: i + 4 })}
                />
              ))}
            </div>
          ) : build.activeTab === "meleeConsonanceWeapon" || build.activeTab === "rangedConsonanceWeapon" ? (
            <div className="grid grid-cols-4 gap-8 justify-items-center">
              {wedgeSlotItems.map((it, i) => (
                <SlotCard
                  key={i}
                  size="sm"
                  label={`Slot ${i + 1}`}
                  item={it}
                  onClick={() => setPicker({ type: "wedge", tab: build.activeTab, slotIndex: i })}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-8 justify-items-center">
              {wedgeSlotItems.slice(0, 4).map((it, i) => (
                <SlotCard
                  key={i}
                  size="sm"
                  label={`Slot ${i + 1}`}
                  item={it}
                  onClick={() => setPicker({ type: "wedge", tab: build.activeTab, slotIndex: i })}
                />
              ))}
              {wedgeSlotItems.slice(4, 8).map((it, i) => (
                <SlotCard
                  key={i + 4}
                  size="sm"
                  label={`Slot ${i + 5}`}
                  item={it}
                  onClick={() => setPicker({ type: "wedge", tab: build.activeTab, slotIndex: i + 4 })}
                />
              ))}
            </div>
          )}
        </div>
      </ContentSection>

      {/* 캐릭터 선택 모달 */}
      <PickerModal
        open={picker?.type === "character"}
        title={picker?.type === "character" && picker.target === "main" ? "Select Main Character" : "Select Ally"}
        items={characters as any}
        selectedSlug={
          picker?.type === "character"
            ? picker.target === "main"
              ? build.selections.characterSlug
              : picker.target === "ally1"
                ? build.selections.ally1Slug
                : build.selections.ally2Slug
            : undefined
        }
        filters={CHARACTER_MODAL_FILTERS.map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "character") return;
          setBuild((prev) => ({
            ...prev,
            selections: {
              ...prev.selections,
              characterSlug: picker.target === "main" ? slug : prev.selections.characterSlug,
              ally1Slug: picker.target === "ally1" ? slug : prev.selections.ally1Slug,
              ally2Slug: picker.target === "ally2" ? slug : prev.selections.ally2Slug,
            },
          }));
        }}
      />

      {/* 무기 선택 모달 */}
      <PickerModal
        open={picker?.type === "weapon"}
        title={picker?.type === "weapon" && picker.target === "melee" ? "Select Melee Weapon" : "Select Ranged Weapon"}
        items={(picker?.type === "weapon" && picker.target === "melee" ? meleeWeapons : rangedWeapons) as any}
        selectedSlug={
          picker?.type === "weapon"
            ? picker.target === "melee"
              ? build.selections.meleeWeaponSlug
              : build.selections.rangedWeaponSlug
            : undefined
        }
        filters={WEAPON_FILTERS.filter((f) => f.field === "weaponType").map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "weapon") return;
          setBuild((prev) => ({
            ...prev,
            selections: {
              ...prev.selections,
              meleeWeaponSlug: picker.target === "melee" ? slug : prev.selections.meleeWeaponSlug,
              rangedWeaponSlug: picker.target === "ranged" ? slug : prev.selections.rangedWeaponSlug,
            },
          }));
        }}
      />

      {/* 쐐기 선택 모달 */}
      <PickerModal
        open={picker?.type === "wedge"}
        title="Select Demon Wedge"
        items={wedgeOptionsForTab as any}
        selectedSlug={picker?.type === "wedge" ? build.wedgeSlots[picker.tab][picker.slotIndex] : undefined}
        filters={DEMON_WEDGE_FILTERS.filter((f) => f.field !== "equipType" && f.field !== "element").map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        grid="lg"
        renderHoverCard={(it: any) => <WedgeHoverCard wedge={it} />}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "wedge") return;
          const tab = picker.tab;
          const idx = picker.slotIndex;
          const next = [...build.wedgeSlots[tab]];
          next[idx] = slug;
          setBuild((prev) => ({
            ...prev,
            wedgeSlots: { ...prev.wedgeSlots, [tab]: next },
          }));
          syncWedgeBuff(tab, next);
        }}
      />

      {/* 3) 입력폼: 기본 스탯 */}
      <ContentSection title="기본 스탯">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 캐릭터 */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 text-sm font-semibold text-white/80">캐릭터</div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledNumberInput
                label="현재 HP%"
                value={build.base.character.currentHpPct}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, currentHpPct: n } } }))
                }
              />
              <LabeledNumberInput
                label="캐릭터 기본 공격력"
                value={build.base.character.baseAttack}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, baseAttack: n } } }))
                }
              />
              <LabeledNumberInput
                label="필사(%)"
                value={build.base.character.resolvePct}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, resolvePct: n } } }))
                }
              />
              <LabeledNumberInput
                label="격양(%)"
                value={build.base.character.moralePct}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, moralePct: n } } }))
                }
              />
            </div>
          </div>

          {/* 동조 무기 */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 text-sm font-semibold text-white/80">동조 무기(캐릭터 귀속)</div>
            <BaseWeaponForm
              value={build.base.consonanceWeapon}
              onChange={(next) => setBuild((p) => ({ ...p, base: { ...p.base, consonanceWeapon: next } }))}
            />
          </div>

          {/* 근접 */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 text-sm font-semibold text-white/80">근접 무기</div>
            <BaseWeaponForm
              value={build.base.meleeWeapon}
              onChange={(next) => setBuild((p) => ({ ...p, base: { ...p.base, meleeWeapon: next } }))}
            />
          </div>

          {/* 원거리 */}
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="mb-4 text-sm font-semibold text-white/80">원거리 무기</div>
            <BaseWeaponForm
              value={build.base.rangedWeapon}
              onChange={(next) => setBuild((p) => ({ ...p, base: { ...p.base, rangedWeapon: next } }))}
            />
          </div>
        </div>
      </ContentSection>

      {/* 4) Buff 섹션 */}
      <ContentSection title="버프">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {BUFF_SECTIONS.map((s) => (
            <BuffSectionForm
              key={s.key}
              title={s.label}
              value={build.buffs[s.key]}
              onChange={(next) => setBuild((p) => ({ ...p, buffs: { ...p.buffs, [s.key]: next } }))}
            />
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={() => {
              // 패시브만 남기고 나머지 버프 섹션 초기화
              setBuild((p) => ({
                ...p,
                buffs: {
                  ...p.buffs,
                  characterWedge: emptyBuffFields(),
                  meleeWeaponWedge: emptyBuffFields(),
                  rangedWeaponWedge: emptyBuffFields(),
                  meleeConsonanceWedge: emptyBuffFields(),
                  rangedConsonanceWedge: emptyBuffFields(),
                },
              }));
            }}
            className="px-3 py-2 rounded-lg text-sm border border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
          >
            쐐기 버프 초기화
          </button>
        </div>
      </ContentSection>

      {/* 5) 결과 비교 */}
      <ContentSection title="결과 비교">결과 비교</ContentSection>
    </div>
  );
}

function LabeledNumberInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-sm text-white/70">{label}</div>
      <FormInput value={String(value)} onChange={(v) => onChange(num(v))} type="number" />
    </div>
  );
}

function BaseWeaponForm({
  value,
  onChange,
}: {
  value: { attack: number; critRatePct: number; critDamagePct: number; attackSpeed: number };
  onChange: (v: { attack: number; critRatePct: number; critDamagePct: number; attackSpeed: number }) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <LabeledNumberInput
        label="기본 공격력"
        value={value.attack}
        onChange={(n) => onChange({ ...value, attack: n })}
      />
      <LabeledNumberInput
        label="치명타 확률(%)"
        value={value.critRatePct}
        onChange={(n) => onChange({ ...value, critRatePct: n })}
      />
      <LabeledNumberInput
        label="치명타 피해(%)"
        value={value.critDamagePct}
        onChange={(n) => onChange({ ...value, critDamagePct: n })}
      />
      <LabeledNumberInput
        label="공격 속도"
        value={value.attackSpeed}
        onChange={(n) => onChange({ ...value, attackSpeed: n })}
      />
    </div>
  );
}

function BuffSectionForm({
  title,
  value,
  onChange,
}: {
  title: string;
  value: BuffFields;
  onChange: (v: BuffFields) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 text-sm font-semibold text-white/80">{title}</div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {BUFF_FIELD_META.map((f) => (
          <LabeledNumberInput
            key={String(f.key)}
            label={f.label}
            value={value[f.key]}
            onChange={(n) => onChange({ ...value, [f.key]: n })}
          />
        ))}
      </div>
    </div>
  );
}

function ResultCard({ title, result }: { title: string; result: ReturnType<typeof compute> }) {
  const totalBuff = result.totalBuff;
  const totalBuffSimple = sumBuffs([totalBuff]);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="mb-2 text-sm font-semibold text-white/80">{title}</div>
      <div className="text-2xl font-bold">
        {format(result.estimatedDps)}
        <span className="ml-2 text-sm font-medium text-white/60">DPS</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <KeyValue k="최종 공격합" v={format(result.finalAttackTotal)} />
        <KeyValue k="치확" v={`${format(result.critRatePct)}%`} />
        <KeyValue k="치피" v={`${format(result.critDamagePct)}%`} />
        <KeyValue k="치명 기대값" v={format(result.expectedCritMultiplier)} />
        <KeyValue k="공격 속도" v={format(result.attackSpeed)} />
        <KeyValue k="대미지 배수" v={format(result.damageMultiplier)} />
      </div>

      <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/55">
        <div className="mb-2 font-semibold text-white/70">합산 버프(요약)</div>
        <div className="grid grid-cols-2 gap-2">
          <KeyValue k="캐릭터 공격%" v={`${format(totalBuffSimple.characterAttackPct)}%`} />
          <KeyValue k="무기 공격%" v={`${format(totalBuffSimple.weaponAttackPct)}%`} />
          <KeyValue k="속성 공격%" v={`${format(totalBuffSimple.elementAttackPct)}%`} />
          <KeyValue k="대미지%" v={`${format(totalBuffSimple.damagePct)}%`} />
          <KeyValue k="스킬 위력%" v={`${format(totalBuffSimple.skillPowerPct)}%`} />
          <KeyValue k="스킬 대미지%" v={`${format(totalBuffSimple.skillDamagePct)}%`} />
          <KeyValue k="치확%" v={`${format(totalBuffSimple.critRatePct)}%`} />
          <KeyValue k="치피%" v={`${format(totalBuffSimple.critDamagePct)}%`} />
        </div>
      </div>
    </div>
  );
}

function KeyValue({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1 border border-white/10">
      <div className="text-white/60">{k}</div>
      <div className="font-medium text-white/90">{v}</div>
    </div>
  );
}
