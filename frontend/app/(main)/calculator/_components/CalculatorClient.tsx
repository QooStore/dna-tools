"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

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

import {
  ActiveTab,
  BuildId,
  BuildState,
  emptyBuildState,
  BuffFields,
  emptyBuffFields,
  AllyState,
  emptyAllyState,
} from "./calculatorTypes";
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
  HP_BASED_SLUGS,
  DEF_BASED_SLUGS,
  generateWedgeCode,
  parseWedgeCode,
} from "./calculatorLogic";
import { ConditionalEffectsToggle } from "./ConditionalEffectsToggle";
import { ResultCompare } from "./ResultCompare";
import { EnemyForm, DmgReductionModal } from "./EnemyForm";

type Props = {
  characters: CharacterListItem[];
  weapons: WeaponListItem[];
  wedges: DemonWedgeListItem[];
};

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

const WEDGE_RARITY_COLORS: Record<number, string> = {
  5: "border-amber-400/40 bg-gradient-to-b from-amber-400/20 to-transparent hover:from-amber-400/30",
  4: "border-purple-400/30 bg-gradient-to-b from-purple-400/15 to-transparent hover:from-purple-400/25",
  3: "border-blue-400/20 bg-gradient-to-b from-blue-400/10 to-transparent hover:from-blue-400/20",
  2: "border-green-400/20 bg-gradient-to-b from-green-400/10 to-transparent hover:from-green-400/20",
};

function applyCharacterDetail(prev: BuildState, detail: CharacterDetail): BuildState {
  const nextAttack = detail?.stats?.attack ?? 0;
  const nextHp = detail?.stats?.hp ?? 0;
  const nextDefense = detail?.stats?.defense ?? 0;
  const nextResolve = detail?.stats?.resolve ?? 0;
  const nextMorale = detail?.stats?.morale ?? 0;

  const consonance = detail?.consonanceWeapon;

  return {
    ...prev,
    consonanceCategory: consonance?.category ?? null,
    consonanceItemCode: consonance?.itemCode ?? null,
    base: {
      ...prev.base,
      character: {
        ...prev.base.character,
        baseAttack: nextAttack,
        hp: nextHp,
        defense: nextDefense,
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
    conditionalEffects: {
      ...prev.conditionalEffects,
      characterEffects: detail.conditionalEffects ?? [],
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
  contribRef: RefObject<PassiveContrib>,
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
  { key: "hpPct", label: "HP%" },
  { key: "defensePct", label: "방어%" },
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
  const [wedgeTooltip, setWedgeTooltip] = useState<{
    item: DemonWedgeListItem;
    x: number;
    y: number;
    below: boolean;
  } | null>(null);
  const handleWedgeMouseEnter = (e: React.MouseEvent, it: DemonWedgeListItem | undefined) => {
    if (!it) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const below = rect.top < 350;
    setWedgeTooltip({ item: it, x: rect.left + rect.width / 2, y: below ? rect.bottom : rect.top, below });
  };
  const handleWedgeMouseLeave = () => setWedgeTooltip(null);
  const [dmgReductionModalOpen, setDmgReductionModalOpen] = useState(false);
  const [wedgeCodeModal, setWedgeCodeModal] = useState<ActiveTab | null>(null);
  const [wedgeCopyConfirm, setWedgeCopyConfirm] = useState<{ code: string } | null>(null);
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
        setBuildA((prev) => ({
          ...prev,
          allies: [{ ...prev.allies[0], characterConditionalEffects: detail.conditionalEffects ?? [] }, prev.allies[1]],
        }));
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
        setBuildA((prev) => ({
          ...prev,
          allies: [prev.allies[0], { ...prev.allies[1], characterConditionalEffects: detail.conditionalEffects ?? [] }],
        }));
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
        setBuildB((prev) => ({
          ...prev,
          allies: [{ ...prev.allies[0], characterConditionalEffects: detail.conditionalEffects ?? [] }, prev.allies[1]],
        }));
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
        setBuildB((prev) => ({
          ...prev,
          allies: [prev.allies[0], { ...prev.allies[1], characterConditionalEffects: detail.conditionalEffects ?? [] }],
        }));
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
    | { type: "ally-weapon"; allyIndex: 0 | 1 }
    | { type: "ally-wedge"; allyIndex: 0 | 1; allyTab: "character" | "weapon"; slotIndex: number }
  >(null);

  type DisplayTab =
    | { kind: "main"; tab: ActiveTab }
    | { kind: "ally"; allyIndex: 0 | 1; allyTab: "character" | "weapon" };
  const [displayTab, setDisplayTab] = useState<DisplayTab>({ kind: "main", tab: "character" });

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
  const selectedAllyWeapon1 = useMemo(() => bySlug(weapons, build.allies[0].weaponSlug), [weapons, build.allies]);
  const selectedAllyWeapon2 = useMemo(() => bySlug(weapons, build.allies[1].weaponSlug), [weapons, build.allies]);

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

  // 동료별 탭별 내성 합계 (페이즈 시프트 슬롯은 올림(ceil) 절반 적용)
  const allyResistanceUsed = useMemo(() => {
    return build.allies.map((ally) => ({
      character: ally.wedgeSlotsCharacter.reduce((sum, slug, i) => {
        if (!slug) return sum;
        const w = wedges.find((x) => x.slug === slug);
        if (!w) return sum;
        const res = w.resistance ?? 0;
        const isPS = ally.phaseShiftSlotsCharacter[i] ?? false;
        return sum + (isPS ? Math.ceil(res / 2) : res);
      }, 0),
      weapon: ally.wedgeSlotsWeapon.reduce((sum, slug, i) => {
        if (!slug) return sum;
        const w = wedges.find((x) => x.slug === slug);
        if (!w) return sum;
        const res = w.resistance ?? 0;
        const isPS = ally.phaseShiftSlotsWeapon[i] ?? false;
        return sum + (isPS ? Math.ceil(res / 2) : res);
      }, 0),
    }));
  }, [build.allies, wedges]);

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

  const allyWedgeOptions = useMemo(() => {
    if (picker?.type !== "ally-wedge") return [];
    const { allyIndex, allyTab, slotIndex } = picker;
    const allySlug = allyIndex === 0 ? build.selections.ally1Slug : build.selections.ally2Slug;
    const allyChar = characters.find((c) => c.slug === allySlug);
    const charElement = allyChar?.elementCode ?? null;

    if (allyTab === "character") {
      const isKukulkanSlot = slotIndex === 8;
      return wedges.filter((w) => {
        if (w.equipType !== "character") return false;
        if (isKukulkanSlot && !w.isKukulkan) return false;
        if (!isKukulkanSlot && w.isKukulkan) return false;
        if (w.element && charElement && w.element !== charElement) return false;
        return true;
      });
    } else {
      const allyWeaponSlug = build.allies[allyIndex].weaponSlug;
      const allyWeapon = allyWeaponSlug ? weapons.find((w) => w.slug === allyWeaponSlug) : undefined;
      const targetEquipType =
        allyWeapon?.category === "melee" ? "meleeWeapon" : allyWeapon?.category === "ranged" ? "rangedWeapon" : null;
      return wedges.filter((w) => {
        if (targetEquipType) return w.equipType === targetEquipType;
        return w.equipType === "meleeWeapon" || w.equipType === "rangedWeapon";
      });
    }
  }, [picker, wedges, characters, weapons, build.selections, build.allies]);

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

  const computeData = useMemo(() => ({ characters, weapons, wedges }), [characters, weapons, wedges]);
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
            <div className="flex gap-8 items-start">
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
              <SlotCard
                label="동료 1 무기"
                item={selectedAllyWeapon1}
                onClick={() => setPicker({ type: "ally-weapon", allyIndex: 0 })}
                disabled={!build.selections.ally1Slug}
              />
              <SlotCard
                label="동료 2 무기"
                item={selectedAllyWeapon2}
                onClick={() => setPicker({ type: "ally-weapon", allyIndex: 1 })}
                disabled={!build.selections.ally2Slug}
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
          {/* 탭 바 */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 페이즈 시프트 버튼 */}
            <button
              onClick={() => setPhaseShiftMode((p) => !p)}
              className={`px-3 py-2 rounded-lg text-sm border transition ${
                phaseShiftMode
                  ? "border-violet-400/60 bg-violet-400/15 text-violet-300"
                  : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
              }`}
            >
              페이즈 시프트 모듈
            </button>
            <div className="h-5 w-px bg-white/15" />

            {/* 메인 탭 버튼 */}
            {(Object.keys(TAB_LABELS) as ActiveTab[])
              .filter((tab) => {
                if (tab === "meleeConsonanceWeapon") return build.consonanceCategory === "melee";
                if (tab === "rangedConsonanceWeapon") return build.consonanceCategory === "ranged";
                return true;
              })
              .map((tab) => {
                const used = resistanceUsed[tab] ?? 0;
                const limit = build.resistanceLimits[tab] ?? 0;
                const isActive = displayTab.kind === "main" && displayTab.tab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setBuild((prev) => ({ ...prev, activeTab: tab }));
                      setDisplayTab({ kind: "main", tab });
                    }}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      isActive
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

            {/* 동료 쐐기 탭 (동료가 선택된 경우에만) */}
            {(build.selections.ally1Slug || build.selections.ally2Slug) && (
              <>
                <div className="h-5 w-px bg-white/15" />
                {([0, 1] as const)
                  .filter((i) => (i === 0 ? !!build.selections.ally1Slug : !!build.selections.ally2Slug))
                  .flatMap((allyIdx) => {
                    return (["character", "weapon"] as const).map((allyTab) => {
                      const isActive =
                        displayTab.kind === "ally" &&
                        displayTab.allyIndex === allyIdx &&
                        displayTab.allyTab === allyTab;
                      return (
                        <button
                          key={`ally${allyIdx}-${allyTab}`}
                          onClick={() => setDisplayTab({ kind: "ally", allyIndex: allyIdx, allyTab })}
                          className={`px-3 py-2 rounded-lg text-sm border transition ${
                            isActive
                              ? "border-amber-300/60 bg-amber-400/10 text-amber-200"
                              : "border-white/15 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                        >
                          {allyTab === "character" ? `협력동료${allyIdx + 1}` : `협력동료${allyIdx + 1} 무기`}
                        </button>
                      );
                    });
                  })}
              </>
            )}
          </div>
          {phaseShiftMode && (
            <p className="text-xs text-violet-300/70 mt-1">슬롯을 클릭하면 페이즈 시프트 모듈 적용/해제</p>
          )}

          {/* 메인 탭: 내성 입력 + 초기화 + 슬롯 */}
          {displayTab.kind === "main" &&
            (() => {
              const tab = displayTab.tab;
              const used = resistanceUsed[tab] ?? 0;
              const limit = build.resistanceLimits[tab] ?? 0;
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
                  <div
                    key={i}
                    className={`rounded-2xl transition ${isPS ? "ring-1 ring-violet-400/70" : ""}`}
                    onMouseEnter={(e) => handleWedgeMouseEnter(e, it)}
                    onMouseLeave={handleWedgeMouseLeave}
                  >
                    <SlotCard size="sm" label={label} item={it} onClick={handleClick} />
                  </div>
                );
              };
              return (
                <>
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
                          resistanceLimits: { ...prev.resistanceLimits, [tab]: v >= 0 ? v : 0 },
                        }));
                      }}
                      className="w-20 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 text-center"
                    />
                    <span className="text-sm font-semibold text-white/50">
                      사용 {used} / {limit}
                    </span>
                    <button
                      onClick={() => {
                        const emptySlugs = Array(build.wedgeSlots[tab].length).fill("");
                        setBuild((prev) => ({ ...prev, wedgeSlots: { ...prev.wedgeSlots, [tab]: emptySlugs } }));
                        syncWedgeBuff(tab, emptySlugs);
                      }}
                      className="ml-auto px-3 py-1.5 rounded-lg text-xs border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      쐐기 초기화
                    </button>
                    <button
                      onClick={() => {
                        const entityCode =
                          tab === "character"
                            ? (selectedMain?.itemCode ?? null)
                            : tab === "meleeWeapon"
                              ? (selectedMeleeWeapon?.itemCode ?? null)
                              : tab === "rangedWeapon"
                                ? (selectedRangedWeapon?.itemCode ?? null)
                                : build.consonanceItemCode;
                        if (!entityCode) {
                          setToast("아이템 코드가 없습니다");
                          return;
                        }
                        const code = generateWedgeCode(tab, build.wedgeSlots[tab], wedges, entityCode);
                        setWedgeCopyConfirm({ code });
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      쐐기 코드 복사
                    </button>
                    <button
                      onClick={() => setWedgeCodeModal(tab)}
                      className="px-3 py-1.5 rounded-lg text-xs border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      쐐기 코드 적용
                    </button>
                  </div>
                  <div className="mt-6">
                    {tab === "character" ? (
                      <div className="grid grid-cols-4 gap-8 justify-items-center">
                        {wedgeSlotItems.slice(0, 4).map((it, i) => wedgeSlotCard(it, i, `Slot ${i + 1}`))}
                        <div className="col-span-4 flex justify-center py-4">
                          {wedgeSlotCard(wedgeSlotItems[8], 8, "Slot 9")}
                        </div>
                        {wedgeSlotItems.slice(4, 8).map((it, i) => wedgeSlotCard(it, i + 4, `Slot ${i + 5}`))}
                      </div>
                    ) : tab === "meleeConsonanceWeapon" || tab === "rangedConsonanceWeapon" ? (
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
                </>
              );
            })()}

          {/* 동료 탭: 동료 쐐기 슬롯 */}
          {displayTab.kind === "ally" &&
            (() => {
              const { allyIndex, allyTab } = displayTab;
              const ally = build.allies[allyIndex];
              const slotItems =
                allyTab === "character"
                  ? ally.wedgeSlotsCharacter.map((s) => bySlug(wedges, s))
                  : ally.wedgeSlotsWeapon.map((s) => bySlug(wedges, s));

              const psSlots = allyTab === "character" ? ally.phaseShiftSlotsCharacter : ally.phaseShiftSlotsWeapon;

              const allyWedgeSlotCard = (it: DemonWedgeListItem | undefined, i: number, label: string) => {
                const isPS = psSlots?.[i] ?? false;
                const handleClick = () => {
                  if (phaseShiftMode) {
                    setBuild((prev) => {
                      const newAllies = [prev.allies[0], prev.allies[1]] as [AllyState, AllyState];
                      const a = { ...newAllies[allyIndex] };
                      if (allyTab === "character") {
                        const next = [...a.phaseShiftSlotsCharacter];
                        next[i] = !next[i];
                        a.phaseShiftSlotsCharacter = next;
                      } else {
                        const next = [...a.phaseShiftSlotsWeapon];
                        next[i] = !next[i];
                        a.phaseShiftSlotsWeapon = next;
                      }
                      newAllies[allyIndex] = a;
                      return { ...prev, allies: newAllies };
                    });
                  } else {
                    setPicker({ type: "ally-wedge", allyIndex, allyTab, slotIndex: i });
                  }
                };
                return (
                  <div
                    key={i}
                    className={`rounded-2xl transition ${isPS ? "ring-1 ring-violet-400/70" : ""}`}
                    onMouseEnter={(e) => handleWedgeMouseEnter(e, it)}
                    onMouseLeave={handleWedgeMouseLeave}
                  >
                    <SlotCard size="sm" label={label} item={it} onClick={handleClick} />
                  </div>
                );
              };

              const allyUsed = allyResistanceUsed[allyIndex];
              const allyUsedVal = allyTab === "character" ? allyUsed.character : allyUsed.weapon;
              const allyLimit =
                allyTab === "character" ? ally.resistanceLimits.character : ally.resistanceLimits.weapon;

              return (
                <>
                  <div className="mt-4 flex items-center gap-3">
                    <span className="text-sm text-white/60">내성 한도</span>
                    <input
                      type="number"
                      min={0}
                      value={allyLimit}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setBuild((prev) => {
                          const newAllies = [prev.allies[0], prev.allies[1]] as [AllyState, AllyState];
                          const a = { ...newAllies[allyIndex] };
                          a.resistanceLimits = {
                            ...a.resistanceLimits,
                            [allyTab]: v >= 0 ? v : 0,
                          };
                          newAllies[allyIndex] = a;
                          return { ...prev, allies: newAllies };
                        });
                      }}
                      className="w-20 h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80 text-center"
                    />
                    <span className="text-sm font-semibold text-white/50">
                      사용 {allyUsedVal} / {allyLimit}
                    </span>
                    <button
                      onClick={() => {
                        const emptySlugs = allyTab === "character" ? Array(9).fill("") : Array(8).fill("");
                        setBuild((prev) => {
                          const newAllies = [prev.allies[0], prev.allies[1]] as [AllyState, AllyState];
                          const a = { ...newAllies[allyIndex] };
                          if (allyTab === "character") a.wedgeSlotsCharacter = emptySlugs;
                          else a.wedgeSlotsWeapon = emptySlugs;
                          newAllies[allyIndex] = a;
                          return { ...prev, allies: newAllies };
                        });
                      }}
                      className="ml-auto px-3 py-1.5 rounded-lg text-xs border border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
                    >
                      쐐기 초기화
                    </button>
                  </div>
                  <div className="mt-6">
                    {allyTab === "character" ? (
                      <div className="grid grid-cols-4 gap-8 justify-items-center">
                        {slotItems.slice(0, 4).map((it, i) => allyWedgeSlotCard(it, i, `Slot ${i + 1}`))}
                        <div className="col-span-4 flex justify-center py-4">
                          {allyWedgeSlotCard(slotItems[8], 8, "Slot 9")}
                        </div>
                        {slotItems.slice(4, 8).map((it, i) => allyWedgeSlotCard(it, i + 4, `Slot ${i + 5}`))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-8 justify-items-center">
                        {slotItems.slice(0, 4).map((it, i) => allyWedgeSlotCard(it, i, `Slot ${i + 1}`))}
                        {slotItems.slice(4, 8).map((it, i) => allyWedgeSlotCard(it, i + 4, `Slot ${i + 5}`))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
        </ContentSection>
      )}

      {/* 쐐기 슬롯 hover 툴팁 */}
      {wedgeTooltip && (
        <div
          className="pointer-events-none fixed z-[60] w-[320px]"
          style={{
            left: `${wedgeTooltip.x}px`,
            top: `${wedgeTooltip.y}px`,
            transform: wedgeTooltip.below ? "translate(-50%, 8px)" : "translate(-50%, -100%) translateY(-8px)",
          }}
        >
          <WedgeHoverCard wedge={wedgeTooltip.item} />
        </div>
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
            const allyIdx = picker.target === "ally1" ? 0 : 1;
            const contribRef = activeBuild === "A" ? passiveContribA : passiveContribB;
            contribRef.current[allyKey] = emptyBuffFields();
            const combinedPassive = sumBuffs([
              contribRef.current.main,
              contribRef.current.ally1,
              contribRef.current.ally2,
              contribRef.current.meleeWeapon,
              contribRef.current.rangedWeapon,
            ]);
            setBuild((prev) => {
              const newAllies = [prev.allies[0], prev.allies[1]] as [AllyState, AllyState];
              newAllies[allyIdx] = emptyAllyState();
              return {
                ...prev,
                selections: {
                  ...prev.selections,
                  ally1Slug: picker.target === "ally1" ? slug : prev.selections.ally1Slug,
                  ally2Slug: picker.target === "ally2" ? slug : prev.selections.ally2Slug,
                },
                buffs: { ...prev.buffs, passive: combinedPassive },
                allies: newAllies,
              };
            });
            // 동료 쐐기 탭을 보고 있었다면 메인으로 리셋
            setDisplayTab((prev) =>
              prev.kind === "ally" && prev.allyIndex === allyIdx ? { kind: "main", tab: "character" } : prev,
            );
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
        itemClassName={(it) =>
          WEDGE_RARITY_COLORS[it.rarity as number] ?? "border-white/10 bg-white/5 hover:bg-white/10"
        }
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

      {/* 협력 동료 무기 선택 모달 */}
      <PickerModal
        open={picker?.type === "ally-weapon"}
        title="협력 동료 무기 선택"
        items={weapons}
        selectedSlug={picker?.type === "ally-weapon" ? build.allies[picker.allyIndex].weaponSlug : undefined}
        filters={WEAPON_FILTERS.filter((f) => f.field === "category" || f.field === "weaponType").map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        renderHoverCard={(it) => <WeaponHoverCard weapon={it as unknown as WeaponListItem} />}
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "ally-weapon") return;
          const allyIdx = picker.allyIndex;
          if (build.allies[allyIdx].weaponSlug === slug) return;
          setBuild((prev) => {
            const newAllies = [prev.allies[0], prev.allies[1]] as [AllyState, AllyState];
            newAllies[allyIdx] = { ...newAllies[allyIdx], weaponSlug: slug, wedgeSlotsWeapon: Array(8).fill("") };
            return { ...prev, allies: newAllies };
          });
          setPicker(null);
        }}
      />

      {/* 협력 동료 쐐기 선택 모달 */}
      <PickerModal
        open={picker?.type === "ally-wedge"}
        title="악마의 쐐기 선택"
        items={allyWedgeOptions}
        selectedSlug={
          picker?.type === "ally-wedge"
            ? picker.allyTab === "character"
              ? build.allies[picker.allyIndex].wedgeSlotsCharacter[picker.slotIndex]
              : build.allies[picker.allyIndex].wedgeSlotsWeapon[picker.slotIndex]
            : undefined
        }
        filters={DEMON_WEDGE_FILTERS.filter((f) => f.field !== "equipType" && f.field !== "element").map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        grid="lg"
        renderHoverCard={(it) => <WedgeHoverCard wedge={it as unknown as DemonWedgeListItem} />}
        itemClassName={(it) =>
          WEDGE_RARITY_COLORS[it.rarity as number] ?? "border-white/10 bg-white/5 hover:bg-white/10"
        }
        onClose={() => setPicker(null)}
        onSelect={(slug) => {
          if (picker?.type !== "ally-wedge") return;
          const { allyIndex, allyTab, slotIndex } = picker;
          const ally = build.allies[allyIndex];

          // 내성 초과 체크
          const psSlots = allyTab === "character" ? ally.phaseShiftSlotsCharacter : ally.phaseShiftSlotsWeapon;
          const currentSlug =
            allyTab === "character" ? ally.wedgeSlotsCharacter[slotIndex] : ally.wedgeSlotsWeapon[slotIndex];
          const isPS = psSlots[slotIndex] ?? false;
          const rawCurrent = currentSlug ? (wedges.find((w) => w.slug === currentSlug)?.resistance ?? 0) : 0;
          const currentResistance = isPS ? Math.ceil(rawCurrent / 2) : rawCurrent;
          const rawNew = wedges.find((w) => w.slug === slug)?.resistance ?? 0;
          const newResistance = isPS ? Math.ceil(rawNew / 2) : rawNew;
          const usedNow =
            allyTab === "character" ? allyResistanceUsed[allyIndex].character : allyResistanceUsed[allyIndex].weapon;
          const limit = allyTab === "character" ? ally.resistanceLimits.character : ally.resistanceLimits.weapon;
          const newTotal = usedNow - currentResistance + newResistance;
          if (newTotal > limit) {
            setToast(`내성 초과! 배치 취소 (${newTotal} / ${limit})`);
            setPicker(null);
            return;
          }

          setBuild((prev) => {
            const newAllies = [prev.allies[0], prev.allies[1]] as [AllyState, AllyState];
            const a = { ...newAllies[allyIndex] };
            if (allyTab === "character") {
              const newSlots = [...a.wedgeSlotsCharacter];
              newSlots[slotIndex] = slug;
              a.wedgeSlotsCharacter = newSlots;
            } else {
              const newSlots = [...a.wedgeSlotsWeapon];
              newSlots[slotIndex] = slug;
              a.wedgeSlotsWeapon = newSlots;
            }
            newAllies[allyIndex] = a;
            return { ...prev, allies: newAllies };
          });
          setPicker(null);
        }}
      />

      {/* 3) 입력폼: 기본 스탯 */}
      <ContentSection title="기본 스탯">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 캐릭터 */}
          {(() => {
            const slug = build.selections.characterSlug;
            const isHpBased = (HP_BASED_SLUGS as readonly string[]).includes(slug);
            const isDefBased = (DEF_BASED_SLUGS as readonly string[]).includes(slug);
            return (
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-4 text-sm font-semibold text-white/80">캐릭터</div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <LabeledNumberInput
                    label="캐릭터 레벨"
                    value={build.base.character.characterLevel}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, characterLevel: n } },
                      }))
                    }
                  />
                  <LabeledNumberInput
                    label="현재 HP%"
                    value={build.base.character.currentHpPct}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, currentHpPct: n } },
                      }))
                    }
                  />
                  <LabeledNumberInput
                    label="캐릭터 기본 공격력"
                    value={build.base.character.baseAttack}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, baseAttack: n } },
                      }))
                    }
                  />
                  <LabeledNumberInput
                    label="독립 공격력"
                    value={build.base.character.independentAttack}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, independentAttack: n } },
                      }))
                    }
                  />
                  <LabeledNumberInput
                    label="스킬 배율(%)"
                    value={build.base.character.skillMultiplierPct}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, skillMultiplierPct: n } },
                      }))
                    }
                  />
                  {isHpBased && (
                    <LabeledNumberInput
                      label="기본 HP (스킬 계수)"
                      value={build.base.character.hp}
                      onChange={(n) =>
                        setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, hp: n } } }))
                      }
                    />
                  )}
                  {isDefBased && (
                    <LabeledNumberInput
                      label="기본 방어 (스킬 계수)"
                      value={build.base.character.defense}
                      onChange={(n) =>
                        setBuild((p) => ({ ...p, base: { ...p.base, character: { ...p.base.character, defense: n } } }))
                      }
                    />
                  )}
                  <LabeledNumberInput
                    label="필사(%)"
                    value={build.base.character.resolvePct}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, resolvePct: n } },
                      }))
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
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, defPenetrationPct: n } },
                      }))
                    }
                  />
                  <LabeledNumberInput
                    label="속성 관통(%)"
                    value={build.base.character.elementPenetrationPct}
                    onChange={(n) =>
                      setBuild((p) => ({
                        ...p,
                        base: { ...p.base, character: { ...p.base.character, elementPenetrationPct: n } },
                      }))
                    }
                  />
                </div>
              </div>
            );
          })()}

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

      <WedgeCopyConfirmModal
        confirm={wedgeCopyConfirm}
        onClose={() => setWedgeCopyConfirm(null)}
        onConfirm={(code) => {
          navigator.clipboard.writeText(code).then(() => setToast("코드가 복사되었습니다"));
          setWedgeCopyConfirm(null);
        }}
      />

      <WedgeCodeModal
        open={wedgeCodeModal}
        entityCode={
          wedgeCodeModal === "character"
            ? (selectedMain?.itemCode ?? null)
            : wedgeCodeModal === "meleeWeapon"
              ? (selectedMeleeWeapon?.itemCode ?? null)
              : wedgeCodeModal === "rangedWeapon"
                ? (selectedRangedWeapon?.itemCode ?? null)
                : build.consonanceItemCode
        }
        wedges={wedges}
        onClose={() => setWedgeCodeModal(null)}
        onApply={(slotSlugs) => {
          if (!wedgeCodeModal) return;
          const tab = wedgeCodeModal;
          setBuild((prev) => ({ ...prev, wedgeSlots: { ...prev.wedgeSlots, [tab]: slotSlugs } }));
          syncWedgeBuff(tab, slotSlugs);
          setWedgeCodeModal(null);
        }}
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

      {/* 6) 조건부 효과 토글 */}
      <ContentSection title="조건부 효과 (토글)">
        <ConditionalEffectsToggle
          build={build}
          meleeWeapon={selectedMeleeWeapon}
          rangedWeapon={selectedRangedWeapon}
          allWedges={wedges}
          allWeapons={weapons}
          characters={characters}
          onToggle={(key) => {
            setBuild((prev) => {
              const set = new Set(prev.conditionalEffects.disabledKeys);
              if (set.has(key)) set.delete(key);
              else set.add(key);
              return {
                ...prev,
                conditionalEffects: { ...prev.conditionalEffects, disabledKeys: [...set] },
              };
            });
          }}
        />
      </ContentSection>

      {/* 7) 결과 비교 */}
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

function WedgeCopyConfirmModal({
  confirm,
  onClose,
  onConfirm,
}: {
  confirm: { code: string } | null;
  onClose: () => void;
  onConfirm: (code: string) => void;
}) {
  if (!confirm) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b1020] p-6 shadow-xl">
        <div className="mb-3 text-base font-semibold text-white/90">쐐기 코드 복사</div>
        <p className="mb-4 text-xs text-white/50">아래 코드를 클립보드에 복사하시겠습니까?</p>
        <div className="mb-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-xs font-mono text-white/70 break-all select-all">
          {confirm.code}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg border border-white/15 bg-white/5 text-sm text-white/60 hover:bg-white/10 transition text-center"
          >
            취소
          </button>
          <button
            onClick={() => onConfirm(confirm.code)}
            className="flex-1 py-2 rounded-lg border border-cyan-300/40 bg-cyan-400/10 text-sm text-cyan-200 hover:bg-cyan-400/20 transition text-center"
          >
            복사
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

function WedgeCodeModal({
  open,
  entityCode,
  wedges,
  onClose,
  onApply,
}: {
  open: ActiveTab | null;
  entityCode: string | null | undefined;
  wedges: DemonWedgeListItem[];
  onClose: () => void;
  onApply: (slotSlugs: string[]) => void;
}) {
  if (!open) return null;
  return (
    <WedgeCodeModalContent tab={open} entityCode={entityCode} wedges={wedges} onClose={onClose} onApply={onApply} />
  );
}

function WedgeCodeModalContent({
  tab,
  entityCode,
  wedges,
  onClose,
  onApply,
}: {
  tab: ActiveTab;
  entityCode: string | null | undefined;
  wedges: DemonWedgeListItem[];
  onClose: () => void;
  onApply: (slotSlugs: string[]) => void;
}) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = () => {
    const result = parseWedgeCode(tab, input.trim(), wedges);
    if (!result) {
      setError("코드 형식이 올바르지 않습니다");
      return;
    }
    if (entityCode && result.entityCode !== entityCode) {
      setError("캐릭터/무기 코드가 일치하지 않습니다");
      return;
    }
    onApply(result.slotSlugs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/15 bg-[#0b1020] p-6 shadow-xl">
        <div className="mb-4 text-base font-semibold text-white/90">쐐기 세팅 코드 적용</div>
        <p className="mb-4 text-xs text-white/40">복사한 쐐기 코드를 붙여넣으세요.</p>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(null);
          }}
          placeholder="코드를 입력하세요"
          className="mb-2 w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/80"
        />
        {error && <p className="mb-3 text-xs text-red-400">{error}</p>}
        <div className="flex gap-2 mt-4">
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
