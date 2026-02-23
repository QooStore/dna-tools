"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MutableRefObject, Dispatch, SetStateAction } from "react";

import type { CharacterListItem } from "@/domains/characters/types";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { DemonWedgeListItem } from "@/domains/demonWedges/type";

import FormInput from "@/components/ui/FormInput";
import ContentSection from "@/components/ui/ContentSection";

import SlotCard from "./SlotCard";
import PickerModal from "./PickerModal";
import WedgeHoverCard from "./WedgeHoverCard";
import WeaponHoverCard from "./WeaponHoverCard";

import type { CharacterDetail } from "@/domains/characters/types";
import { fetchCharacterDetailClient, prefetchCharacterDetail } from "@/api/characters.client";

import { CHARACTER_MODAL_FILTERS } from "@/config/characterFilters";
import { WEAPON_FILTERS } from "@/config/weaponFilters";
import { DEMON_WEDGE_FILTERS } from "@/config/demonWedgeFilters";

import { ActiveTab, BuildId, BuildState, emptyBuildState, BuffFields, emptyBuffFields, EnemyInputs, EnemyType, ElementCondition } from "./calculatorTypes";
import {
  TAB_LABELS,
  applyWedgesToBuff,
  applyPassiveUpgradesToBuff,
  applyWeaponPassiveToBuff,
  sumBuffs,
  tabToEquipType,
  computeOutputs,
  RESONANCE_OPTIONS,
  getResonanceBonus,
  ENEMY_DEF,
  ENEMY_TYPE_LABELS,
  ELEMENT_CONDITION_LABELS,
  ELEMENT_CONDITION_DESC,
  enemyDmgTakenCoeff,
  type OutputKey,
} from "./calculatorLogic";

type Props = {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
  wedges: DemonWedgeListItem[];
};

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function applyCharacterDetail(prev: BuildState, detail: CharacterDetail): BuildState {
  const nextAttack = detail?.stats?.attack ?? 0;
  const nextResolve = detail?.stats?.resolve ?? 0;
  const nextMorale = detail?.stats?.morale ?? 0;

  const consonance = detail?.consonanceWeapon;

  return {
    ...prev,
    consonanceCategory: consonance?.category ?? null,
    base: {
      ...prev.base,
      character: {
        ...prev.base.character,
        baseAttack: nextAttack,
        resolvePct: nextResolve,
        moralePct: nextMorale,
      },
      consonanceWeapon: {
        ...prev.base.consonanceWeapon,
        attack: consonance?.attack ?? 0,
        critRatePct: consonance?.critRate ?? 0,
        critDamagePct: consonance?.critDamage ?? 0,
        attackSpeed: consonance?.attackSpeed ?? 1,
      },
    },
  };
}

type PassiveContrib = {
  main: BuffFields;
  ally1: BuffFields;
  ally2: BuffFields;
  meleeWeapon: BuffFields;
  rangedWeapon: BuffFields;
};
const emptyPassiveContrib = (): PassiveContrib => ({
  main: emptyBuffFields(),
  ally1: emptyBuffFields(),
  ally2: emptyBuffFields(),
  meleeWeapon: emptyBuffFields(),
  rangedWeapon: emptyBuffFields(),
});

function setPassiveContribAndApply(
  contribRef: MutableRefObject<PassiveContrib>,
  key: keyof PassiveContrib,
  buff: BuffFields,
  setBuildFn: Dispatch<SetStateAction<BuildState>>,
) {
  contribRef.current[key] = buff;
  const combined = sumBuffs([
    contribRef.current.main,
    contribRef.current.ally1,
    contribRef.current.ally2,
    contribRef.current.meleeWeapon,
    contribRef.current.rangedWeapon,
  ]);
  setBuildFn((prev) => ({ ...prev, buffs: { ...prev.buffs, passive: combined } }));
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

  const [toast, setToast] = useState<string | null>(null);
  const [phaseShiftMode, setPhaseShiftMode] = useState(false);
  const [dmgReductionModalOpen, setDmgReductionModalOpen] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  // 패시브 기여분 (메인 STAT + 협력 동료 COOP) 을 ref로 관리
  const passiveContribA = useRef<PassiveContrib>(emptyPassiveContrib());
  const passiveContribB = useRef<PassiveContrib>(emptyPassiveContrib());

  // 메인 캐릭터 detail fetch → base stats + 패시브(STAT)
  // 리셋은 onSelect 이벤트 핸들러에서 처리 (동기 setState in effect 방지)
  useEffect(() => {
    const slug = buildA.selections.characterSlug;
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCharacterDetailClient(slug);
        if (cancelled) return;
        setBuildA((prev) => applyCharacterDetail(prev, detail));
        setPassiveContribAndApply(
          passiveContribA,
          "main",
          applyPassiveUpgradesToBuff(detail.passiveUpgrades ?? [], "STAT"),
          setBuildA,
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildA.selections.characterSlug]);

  useEffect(() => {
    const slug = buildB.selections.characterSlug;
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCharacterDetailClient(slug);
        if (cancelled) return;
        setBuildB((prev) => applyCharacterDetail(prev, detail));
        setPassiveContribAndApply(
          passiveContribB,
          "main",
          applyPassiveUpgradesToBuff(detail.passiveUpgrades ?? [], "STAT"),
          setBuildB,
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildB.selections.characterSlug]);

  // 협력 동료 detail fetch → 패시브(COOP)
  useEffect(() => {
    const slug = buildA.selections.ally1Slug;
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCharacterDetailClient(slug);
        if (cancelled) return;
        setPassiveContribAndApply(
          passiveContribA,
          "ally1",
          applyPassiveUpgradesToBuff(detail.passiveUpgrades ?? [], "COOP"),
          setBuildA,
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildA.selections.ally1Slug]);

  useEffect(() => {
    const slug = buildA.selections.ally2Slug;
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCharacterDetailClient(slug);
        if (cancelled) return;
        setPassiveContribAndApply(
          passiveContribA,
          "ally2",
          applyPassiveUpgradesToBuff(detail.passiveUpgrades ?? [], "COOP"),
          setBuildA,
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildA.selections.ally2Slug]);

  useEffect(() => {
    const slug = buildB.selections.ally1Slug;
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCharacterDetailClient(slug);
        if (cancelled) return;
        setPassiveContribAndApply(
          passiveContribB,
          "ally1",
          applyPassiveUpgradesToBuff(detail.passiveUpgrades ?? [], "COOP"),
          setBuildB,
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildB.selections.ally1Slug]);

  useEffect(() => {
    const slug = buildB.selections.ally2Slug;
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const detail = await fetchCharacterDetailClient(slug);
        if (cancelled) return;
        setPassiveContribAndApply(
          passiveContribB,
          "ally2",
          applyPassiveUpgradesToBuff(detail.passiveUpgrades ?? [], "COOP"),
          setBuildB,
        );
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [buildB.selections.ally2Slug]);

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

  // 탭별 내성 합계 (페이즈 시프트 슬롯은 올림(ceil) 절반 적용)
  const resistanceUsed = useMemo(() => {
    const result = {} as Record<ActiveTab, number>;
    for (const tab of Object.keys(build.wedgeSlots) as ActiveTab[]) {
      result[tab] = build.wedgeSlots[tab].reduce((sum, slug, i) => {
        if (!slug) return sum;
        const w = wedges.find((x) => x.slug === slug);
        if (!w) return sum;
        const res = w.resistance ?? 0;
        const isPS = build.phaseShiftSlots[tab]?.[i] ?? false;
        return sum + (isPS ? Math.ceil(res / 2) : res);
      }, 0);
    }
    return result;
  }, [build.wedgeSlots, build.phaseShiftSlots, wedges]);

  const wedgeOptionsForTab = useMemo(() => {
    const equipType = tabToEquipType[build.activeTab];
    const isKukulkanSlot = build.activeTab === "character" && picker?.type === "wedge" && picker.slotIndex === 8;
    const charElement = selectedMain?.elementCode ?? null;
    return wedges.filter((w) => {
      if (w.equipType !== equipType) return false;
      if (isKukulkanSlot && !w.isKukulkan) return false;
      if (!isKukulkanSlot && build.activeTab === "character" && w.isKukulkan) return false;
      // 캐릭터 쐐기: element가 있는 쐐기는 캐릭터 속성과 일치해야 함
      if (build.activeTab === "character" && w.element && charElement && w.element !== charElement) return false;
      return true;
    });
  }, [wedges, build.activeTab, picker, selectedMain?.elementCode]);

  const wedgeSlotItems = useMemo(() => {
    const slotSlugs = build.wedgeSlots[build.activeTab];
    return slotSlugs.map((s) => bySlug(wedges, s));
  }, [build.wedgeSlots, build.activeTab, wedges]);

  // 자동 반영(쐐기 스탯 합산) + 현재 build.buffs 해당 섹션에 덮어쓰기
  const syncWedgeBuff = (tab: ActiveTab, wedgeSlugs: string[]) => {
    const { buff, unsupported } = applyWedgesToBuff(wedges, wedgeSlugs);
    const sectionKey = sectionKeyForTab(tab);
    setBuild((prev) => {
      console.log("prev ==> ", prev);
      return {
        ...prev,
        buffs: {
          ...prev.buffs,
          [sectionKey]: { ...buff, extraDamagePct: prev.buffs[sectionKey].extraDamagePct || 0 },
        },
      };
    });

    // 미지원 statType이 있으면 콘솔에만 찍어둠 (UI 경고는 다음 단계에서 붙이기)
    if (unsupported.length) {
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

  const computeData = useMemo(() => ({ characters, weapons }), [characters, weapons]);
  const resultA = useMemo(() => computeOutputs(buildA, computeData), [buildA, computeData]);
  const resultB = useMemo(() => computeOutputs(buildB, computeData), [buildB, computeData]);

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
              const fromContrib = activeBuild === "A" ? passiveContribA : passiveContribB;
              const toContrib = activeBuild === "A" ? passiveContribB : passiveContribA;
              toSetter(structuredClone(from));
              toContrib.current = structuredClone(fromContrib.current);
              const target = activeBuild === "A" ? "B" : "A";
              setToast(`빌드 ${activeBuild} → 빌드 ${target} 복사 완료`);
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
        {/* 레조넌스 레벨 */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm font-semibold text-white/80">수련 레벨</label>
          <select
            value={build.resonanceLevel}
            onChange={(e) => setBuild((p) => ({ ...p, resonanceLevel: Number(e.target.value) }))}
            className="h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
          >
            {RESONANCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="text-black">
                {o.label}
              </option>
            ))}
          </select>
          {(() => {
            const b = getResonanceBonus(build.resonanceLevel);
            const parts = [
              b.atk > 0 && `공격 +${b.atk}%`,
              b.def > 0 && `방어 +${b.def}%`,
              b.hp > 0 && `HP +${b.hp}%`,
              b.shield > 0 && `실드 +${b.shield}%`,
            ].filter(Boolean);
            return parts.length > 0 ? <span className="text-sm text-green-400">{parts.join(", ")}</span> : null;
          })()}
        </div>

        {/* 슬롯 카드 클릭 → 모달 선택 */}
        <div className="flex flex-wrap justify-center items-end gap-8">
          {/* 출전 캐릭터 */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-xl font-bold text-white/90">빌드 {activeBuild}</div>
            <SlotCard
              label="출전 캐릭터"
              item={selectedMain}
              onClick={() => setPicker({ type: "character", target: "main" })}
            />
          </div>

          {/* 근접 / 원거리 무기 */}
          <SlotCard
            label="근접 무기"
            item={selectedMeleeWeapon}
            onClick={() => setPicker({ type: "weapon", target: "melee" })}
            disabled={!build.selections.characterSlug}
          />
          <SlotCard
            label="원거리 무기"
            item={selectedRangedWeapon}
            onClick={() => setPicker({ type: "weapon", target: "ranged" })}
            disabled={!build.selections.characterSlug}
          />

          {/* 협력 동료 */}
          <div className="flex flex-col items-center gap-3">
            <div className="text-xl font-bold text-white/90">협력 동료</div>
            <div className="flex gap-8">
              <SlotCard
                label="협력 동료 1"
                item={selectedAlly1}
                onClick={() => setPicker({ type: "character", target: "ally1" })}
                disabled={!build.selections.characterSlug}
              />
              <SlotCard
                label="협력 동료 2"
                item={selectedAlly2}
                onClick={() => setPicker({ type: "character", target: "ally2" })}
                disabled={!build.selections.characterSlug}
              />
            </div>
          </div>
        </div>
      </ContentSection>

      {/* 2) 악마의 쐐기 탭 + 슬롯 선택 */}
      {!build.selections.characterSlug ? (
        <ContentSection title="악마의 쐐기 세팅">
          <div className="py-8 text-center text-white/40">캐릭터를 먼저 선택해주세요</div>
        </ContentSection>
      ) : (
        <ContentSection title="악마의 쐐기 세팅">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setPhaseShiftMode((p) => !p)}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                phaseShiftMode
                  ? "border-violet-400/60 bg-violet-400/15 text-violet-300"
                  : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              페이즈 시프트 모듈{phaseShiftMode ? " (슬롯 클릭으로 적용/해제)" : ""}
            </button>
            <div className="h-5 w-px bg-white/15" />
            {(Object.keys(TAB_LABELS) as ActiveTab[])
              .filter((tab) => {
                if (tab === "meleeConsonanceWeapon") return build.consonanceCategory === "melee";
                if (tab === "rangedConsonanceWeapon") return build.consonanceCategory === "ranged";
                return true;
              })
              .map((tab) => {
                const used = resistanceUsed[tab] ?? 0;
                const limit = build.resistanceLimits[tab] ?? 0;
                return (
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
                    <span className="ml-1.5 text-xs text-white/40">
                      {used}/{limit}
                    </span>
                  </button>
                );
              })}
          </div>

          {/* 현재 탭 내성 입력 + 상태 + 초기화 */}
          {(() => {
            const tab = build.activeTab;
            const used = resistanceUsed[tab] ?? 0;
            const limit = build.resistanceLimits[tab] ?? 0;
            return (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-white/60">내성 한도</span>
                <input
                  type="number"
                  min={0}
                  value={limit}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setBuild((prev) => ({
                      ...prev,
                      resistanceLimits: { ...prev.resistanceLimits, [prev.activeTab]: v >= 0 ? v : 0 },
                    }));
                  }}
                  className="w-20 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 text-center"
                />
                <span className="text-sm font-semibold text-white/50">
                  사용 {used} / {limit}
                </span>
                <button
                  onClick={() => {
                    const slotCount = build.wedgeSlots[tab].length;
                    const emptySlugs = Array(slotCount).fill("");
                    setBuild((prev) => ({
                      ...prev,
                      wedgeSlots: { ...prev.wedgeSlots, [tab]: emptySlugs },
                    }));
                    syncWedgeBuff(tab, emptySlugs);
                  }}
                  className="ml-auto px-3 py-1.5 rounded-lg text-xs border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                >
                  쐐기 초기화
                </button>
              </div>
            );
          })()}

          {/* boarhat 스타일 슬롯 배치 */}
          {(() => {
            const tab = build.activeTab;
            const wedgeSlotCard = (it: DemonWedgeListItem | undefined, i: number, label: string) => {
              const isPS = build.phaseShiftSlots[tab]?.[i] ?? false;
              const handleClick = () => {
                if (phaseShiftMode) {
                  setBuild((prev) => {
                    const next = [...(prev.phaseShiftSlots[tab] ?? [])];
                    next[i] = !next[i];
                    return { ...prev, phaseShiftSlots: { ...prev.phaseShiftSlots, [tab]: next } };
                  });
                } else {
                  setPicker({ type: "wedge", tab, slotIndex: i });
                }
              };
              return (
                <div key={i} className={`rounded-2xl transition ${isPS ? "ring-1 ring-violet-400/70" : ""}`}>
                  <SlotCard size="sm" label={label} item={it} onClick={handleClick} />
                </div>
              );
            };

            return (
              <div className="mt-6">
                {build.activeTab === "character" ? (
                  <div className="grid grid-cols-4 gap-8 justify-items-center">
                    {wedgeSlotItems.slice(0, 4).map((it, i) => wedgeSlotCard(it, i, `Slot ${i + 1}`))}
                    <div className="col-span-4 flex justify-center py-4">
                      {wedgeSlotCard(wedgeSlotItems[8], 8, "Slot 9")}
                    </div>
                    {wedgeSlotItems.slice(4, 8).map((it, i) => wedgeSlotCard(it, i + 4, `Slot ${i + 5}`))}
                  </div>
                ) : build.activeTab === "meleeConsonanceWeapon" || build.activeTab === "rangedConsonanceWeapon" ? (
                  <div className="grid grid-cols-4 gap-8 justify-items-center">
                    {wedgeSlotItems.map((it, i) => wedgeSlotCard(it, i, `Slot ${i + 1}`))}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-8 justify-items-center">
                    {wedgeSlotItems.slice(0, 4).map((it, i) => wedgeSlotCard(it, i, `Slot ${i + 1}`))}
                    {wedgeSlotItems.slice(4, 8).map((it, i) => wedgeSlotCard(it, i + 4, `Slot ${i + 5}`))}
                  </div>
                )}
              </div>
            );
          })()}
        </ContentSection>
      )}

      {/* 캐릭터 선택 모달 */}
      <PickerModal
        open={picker?.type === "character"}
        title={picker?.type === "character" && picker.target === "main" ? "메인 캐릭터 선택" : "협력 동료 선택"}
        items={characters}
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
        onItemHover={(it) => {
          // 캐릭터 카드 hover 시 detail을 미리 받아서 선택 시 즉시 반영되게 함
          if (picker?.type !== "character") return;
          prefetchCharacterDetail(it.slug);
        }}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "character") return;
          if (picker.target === "main") {
            const contribRef = activeBuild === "A" ? passiveContribA : passiveContribB;
            // 같은 캐릭터 재선택 시 무시
            if (build.selections.characterSlug === slug) return;
            // 캐릭터 변경 → 무기·동료·쐐기 전부 초기화
            contribRef.current = emptyPassiveContrib();
            setBuild((prev) => {
              const empty = emptyBuildState();
              return {
                ...empty,
                selections: { ...empty.selections, characterSlug: slug },
                activeTab: prev.activeTab,
                enemy: prev.enemy,
              };
            });
          } else {
            // 같은 동료 재선택 시 무시
            const currentSlug = picker.target === "ally1" ? build.selections.ally1Slug : build.selections.ally2Slug;
            if (currentSlug === slug) return;
            // 동료 변경 시 이전 COOP 기여분 즉시 초기화 (새 값은 effect에서 비동기 적용)
            const allyKey = picker.target === "ally1" ? "ally1" : "ally2";
            const contribRef = activeBuild === "A" ? passiveContribA : passiveContribB;
            contribRef.current[allyKey] = emptyBuffFields();
            const combinedPassive = sumBuffs([
              contribRef.current.main,
              contribRef.current.ally1,
              contribRef.current.ally2,
              contribRef.current.meleeWeapon,
              contribRef.current.rangedWeapon,
            ]);
            setBuild((prev) => ({
              ...prev,
              selections: {
                ...prev.selections,
                ally1Slug: picker.target === "ally1" ? slug : prev.selections.ally1Slug,
                ally2Slug: picker.target === "ally2" ? slug : prev.selections.ally2Slug,
              },
              buffs: { ...prev.buffs, passive: combinedPassive },
            }));
          }
        }}
      />

      {/* 무기 선택 모달 */}
      <PickerModal
        open={picker?.type === "weapon"}
        title={picker?.type === "weapon" && picker.target === "melee" ? "근접 무기 선택" : "원거리 무기 선택"}
        items={picker?.type === "weapon" && picker.target === "melee" ? meleeWeapons : rangedWeapons}
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
        renderHoverCard={(it) => <WeaponHoverCard weapon={it as unknown as WeaponListItem} />}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "weapon") return;
          // 같은 무기 재선택 시 무시
          const currentSlug =
            picker.target === "melee" ? build.selections.meleeWeaponSlug : build.selections.rangedWeaponSlug;
          if (currentSlug === slug) return;

          const w = weapons.find((x) => x.slug === slug);
          const baseWeapon = w
            ? { attack: w.attack, critRatePct: w.critRate, critDamagePct: w.critDamage, attackSpeed: w.attackSpeed }
            : { attack: 0, critRatePct: 0, critDamagePct: 0, attackSpeed: 1 };
          const weaponKey = picker.target === "melee" ? "meleeWeapon" : "rangedWeapon";
          const contribRef = activeBuild === "A" ? passiveContribA : passiveContribB;
          contribRef.current[weaponKey] = w
            ? applyWeaponPassiveToBuff(w.passiveStat, w.passiveValue)
            : emptyBuffFields();
          const combinedPassive = sumBuffs([
            contribRef.current.main,
            contribRef.current.ally1,
            contribRef.current.ally2,
            contribRef.current.meleeWeapon,
            contribRef.current.rangedWeapon,
          ]);
          setBuild((prev) => ({
            ...prev,
            selections: {
              ...prev.selections,
              meleeWeaponSlug: picker.target === "melee" ? slug : prev.selections.meleeWeaponSlug,
              rangedWeaponSlug: picker.target === "ranged" ? slug : prev.selections.rangedWeaponSlug,
            },
            base: { ...prev.base, [weaponKey]: baseWeapon },
            buffs: { ...prev.buffs, passive: combinedPassive },
          }));
        }}
      />

      {/* 쐐기 선택 모달 */}
      <PickerModal
        open={picker?.type === "wedge"}
        title="악마의 쐐기 선택"
        items={wedgeOptionsForTab}
        selectedSlug={picker?.type === "wedge" ? build.wedgeSlots[picker.tab][picker.slotIndex] : undefined}
        filters={DEMON_WEDGE_FILTERS.filter((f) => f.field !== "equipType" && f.field !== "element").map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        grid="lg"
        renderHoverCard={(it) => <WedgeHoverCard wedge={it as unknown as DemonWedgeListItem} />}
        itemClassName={(it) => {
          const r = it.rarity as number;
          const colors: Record<number, string> = {
            5: "border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-transparent hover:from-amber-400/30",
            4: "border-purple-400/30 bg-gradient-to-b from-purple-400/15 to-transparent hover:from-purple-400/25",
            3: "border-blue-400/20 bg-gradient-to-b from-blue-400/10 to-transparent hover:from-blue-400/20",
            2: "border-green-400/20 bg-gradient-to-b from-green-400/10 to-transparent hover:from-green-400/20",
          };
          return colors[r] ?? "border-white/10 bg-white/5 hover:bg-white/10";
        }}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "wedge") return;
          const tab = picker.tab;
          const idx = picker.slotIndex;

          // 내성 사전 계산 (해당 슬롯에 페이즈 시프트 적용 여부 반영)
          const limit = build.resistanceLimits[tab] ?? 0;
          const isPS = build.phaseShiftSlots[tab]?.[idx] ?? false;
          const currentSlug = build.wedgeSlots[tab][idx];
          const rawCurrent = currentSlug ? (wedges.find((w) => w.slug === currentSlug)?.resistance ?? 0) : 0;
          const currentResistance = isPS ? Math.ceil(rawCurrent / 2) : rawCurrent;
          const rawNew = wedges.find((w) => w.slug === slug)?.resistance ?? 0;
          const newResistance = isPS ? Math.ceil(rawNew / 2) : rawNew;
          const newTotal = (resistanceUsed[tab] ?? 0) - currentResistance + newResistance;
          if (newTotal > limit) {
            setToast(`내성 초과! 배치 취소 (${newTotal} / ${limit})`);
            setPicker(null);
            return;
          }

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
                label="캐릭터 레벨"
                value={build.base.character.characterLevel}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, characterLevel: n } } }))
                }
              />
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
              <LabeledNumberInput
                label="방어 무시(%)"
                value={build.base.character.defPenetrationPct}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, defPenetrationPct: n } } }))
                }
              />
              <LabeledNumberInput
                label="속성 관통(%)"
                value={build.base.character.elementPenetrationPct}
                onChange={(n) =>
                  setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, elementPenetrationPct: n } } }))
                }
              />
            </div>
          </div>

          {/* 동조 무기 */}
          {build.consonanceCategory && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="mb-4 text-sm font-semibold text-white/80">
                동조 무기({build.consonanceCategory === "melee" ? "근접" : "원거리"})
              </div>
              <BaseWeaponForm
                value={build.base.consonanceWeapon}
                onChange={(next) => setBuild((p) => ({ ...p, base: { ...p.base, consonanceWeapon: next } }))}
              />
            </div>
          )}

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

      {/* 4) 적 정보 */}
      <ContentSection title="적 정보">
        <EnemyForm
          value={build.enemy}
          onChange={(next) => setBuild((p) => ({ ...p, enemy: next }))}
          onOpenReductionModal={() => setDmgReductionModalOpen(true)}
        />
      </ContentSection>

      <DmgReductionModal
        open={dmgReductionModalOpen}
        reductions={build.enemy.enemyDmgReductions}
        onClose={() => setDmgReductionModalOpen(false)}
        onChange={(reductions) => setBuild((p) => ({ ...p, enemy: { ...p.enemy, enemyDmgReductions: reductions } }))}
      />

      {/* 5) Buff 섹션 */}
      <ContentSection title="버프">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {BUFF_SECTIONS.filter((s) => {
            if (s.key === "meleeConsonanceWedge") return build.consonanceCategory === "melee";
            if (s.key === "rangedConsonanceWedge") return build.consonanceCategory === "ranged";
            return true;
          }).map((s) => (
            <BuffSectionForm
              key={s.key}
              title={s.label}
              value={build.buffs[s.key]}
              onChange={(next) => setBuild((p) => ({ ...p, buffs: { ...p.buffs, [s.key]: next } }))}
            />
          ))}
        </div>
      </ContentSection>

      {/* 6) 결과 비교 */}
      <ContentSection title="결과 비교">
        <ResultCompare a={resultA} b={resultB} />
      </ContentSection>

      {/* 토스트 알림 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="rounded-xl border border-cyan-400/30 bg-[#0b1020]/90 backdrop-blur px-5 py-3 text-sm text-cyan-200 shadow-lg shadow-cyan-500/10">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

const OUTPUT_META: { key: OutputKey; label: string }[] = [
  { key: "skillDamage", label: "스킬 대미지" },
  { key: "meleeWeaponDamage", label: "근접 무기 대미지" },
  { key: "rangedWeaponDamage", label: "원거리 무기 대미지" },
  { key: "meleeConsonanceWeaponDamage", label: "근접 동조 무기 대미지" },
  { key: "rangedConsonanceWeaponDamage", label: "원거리 동조 무기 대미지" },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "0";
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
  if (abs >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function ResultCompare({ a, b }: { a: Record<OutputKey, number>; b: Record<OutputKey, number> }) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-[760px] w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-white/80">항목</th>
              <th className="px-4 py-3 text-right font-semibold text-white/80">빌드 A</th>
              <th className="px-4 py-3 text-right font-semibold text-white/80">빌드 B</th>
              <th className="px-4 py-3 text-right font-semibold text-white/80">차이</th>
              <th className="px-4 py-3 text-center font-semibold text-white/80">+</th>
            </tr>
          </thead>
          <tbody>
            {OUTPUT_META.map((m) => {
              const av = a[m.key] ?? 0;
              const bv = b[m.key] ?? 0;
              const high = Math.max(av, bv);
              const low = Math.min(av, bv);
              const winner: "A" | "B" | "=" = av === bv ? "=" : av > bv ? "A" : "B";
              const winClass = winner === "A" ? "text-cyan-200" : winner === "B" ? "text-fuchsia-200" : "text-white/60";

              return (
                <tr key={m.key} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white/80">{m.label}</td>
                  <td className={`px-4 py-3 text-right ${winner === "A" ? "text-cyan-200" : "text-white/70"}`}>
                    {fmt(av)}
                  </td>
                  <td className={`px-4 py-3 text-right ${winner === "B" ? "text-fuchsia-200" : "text-white/70"}`}>
                    {fmt(bv)}
                  </td>
                  <td className="px-4 py-3 text-right text-white/70">{fmt(high - low)}</td>
                  <td className={`px-4 py-3 text-center font-semibold ${winClass}`}>{winner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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

function EnemyForm({
  value,
  onChange,
  onOpenReductionModal,
}: {
  value: EnemyInputs;
  onChange: (v: EnemyInputs) => void;
  onOpenReductionModal: () => void;
}) {
  const enemyTypes: EnemyType[] = ["small", "large", "boss"];
  const elementConditions: ElementCondition[] = ["none", "counter", "other"];

  const finalDmgTakenCoeff = enemyDmgTakenCoeff(value.enemyDmgReductions, value.enemyDmgIncreasePct);

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* 적 종류 */}
        <div>
          <div className="mb-3 text-sm text-white/70">적 종류</div>
          <div className="flex gap-2">
            {enemyTypes.map((t) => (
              <button
                key={t}
                onClick={() => onChange({ ...value, enemyType: t })}
                className={`flex-1 py-2 rounded-lg text-sm border transition ${
                  value.enemyType === t
                    ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <div>{ENEMY_TYPE_LABELS[t]}</div>
                <div className="text-xs text-white/40">방어력 {ENEMY_DEF[t]}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 적 레벨 */}
        <div>
          <LabeledNumberInput
            label="적 레벨"
            value={value.enemyLevel}
            onChange={(n) => onChange({ ...value, enemyLevel: n })}
          />
        </div>

        {/* 속성 조건 */}
        <div>
          <div className="mb-3 text-sm text-white/70">속성 조건</div>
          <div className="flex flex-col gap-2">
            {elementConditions.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ ...value, elementCondition: c })}
                className={`py-1.5 rounded-lg text-sm border transition text-left px-3 ${
                  value.elementCondition === c
                    ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
                    : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                <span>{ELEMENT_CONDITION_LABELS[c]}</span>
                <span className="ml-1.5 text-xs opacity-50">{ELEMENT_CONDITION_DESC[c]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 받는 대미지 계수 */}
        <div className="flex flex-col gap-3">
          <LabeledNumberInput
            label="받는 대미지 증가(%)"
            value={value.enemyDmgIncreasePct}
            onChange={(n) => onChange({ ...value, enemyDmgIncreasePct: n })}
          />
          <div>
            <div className="mb-2 text-sm text-white/70">받는 대미지 감소</div>
            <button
              onClick={onOpenReductionModal}
              className="w-full py-2 rounded-lg text-sm border border-white/15 bg-white/5 text-white/70 hover:bg-white/10 transition"
            >
              {value.enemyDmgReductions.length === 0
                ? "감소 없음"
                : `${value.enemyDmgReductions.length}개 적용 (계수 ${(finalDmgTakenCoeff * 100).toFixed(1)}%)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DmgReductionModal({
  open,
  reductions,
  onClose,
  onChange,
}: {
  open: boolean;
  reductions: number[];
  onClose: () => void;
  onChange: (v: number[]) => void;
}) {
  if (!open) return null;
  return <DmgReductionModalContent reductions={reductions} onClose={onClose} onChange={onChange} />;
}

function DmgReductionModalContent({
  reductions,
  onClose,
  onChange,
}: {
  reductions: number[];
  onClose: () => void;
  onChange: (v: number[]) => void;
}) {
  const [local, setLocal] = useState<number[]>([...reductions]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const finalMult = local.reduce((acc, r) => acc * (1 - r / 100), 1);

  const handleAdd = () => {
    const newLocal = [...local, 0];
    setLocal(newLocal);
    setTimeout(() => {
      const last = inputRefs.current[newLocal.length - 1];
      last?.focus();
      last?.select();
    }, 0);
  };

  const handleConfirm = () => {
    onChange(local.filter((r) => r !== 0));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b1020] p-6 shadow-xl">
        <div className="mb-4 text-base font-semibold text-white/90">받는 대미지 감소 설정</div>
        <p className="mb-4 text-xs text-white/40">항목마다 개별 곱연산으로 적용됩니다.</p>

        <div className="mb-4 space-y-2 max-h-60 overflow-y-auto">
          {local.length === 0 && (
            <div className="py-4 text-center text-sm text-white/30">항목 없음</div>
          )}
          {local.map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                ref={(el) => { inputRefs.current[i] = el; }}
                type="number"
                min={0}
                max={100}
                value={r}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const next = [...local];
                  next[i] = Number(e.target.value);
                  setLocal(next);
                }}
                className="w-full h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 text-center"
              />
              <span className="text-sm text-white/50 shrink-0">%</span>
              <button
                onClick={() => setLocal(local.filter((_, j) => j !== i))}
                className="shrink-0 px-2 h-8 rounded-lg border border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition text-xs"
              >
                삭제
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAdd}
          className="mb-4 w-full py-2 rounded-lg border border-dashed border-white/20 text-sm text-white/50 hover:bg-white/5 hover:text-white/70 transition"
        >
          + 감소 추가
        </button>

        <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
          최종 감소 계수:{" "}
          <span className={finalMult < 1 ? "text-red-300" : "text-white/90"}>
            {(finalMult * 100).toFixed(2)}%
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-white/15 bg-white/5 text-sm text-white/60 hover:bg-white/10 transition text-center"
          >
            취소
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2 rounded-lg border border-cyan-300/40 bg-cyan-400/10 text-sm text-cyan-200 hover:bg-cyan-400/20 transition text-center"
          >
            확인
          </button>
        </div>
      </div>
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
