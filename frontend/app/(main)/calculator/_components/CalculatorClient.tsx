"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { CharacterListItem } from "@/domains/characters/types";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { DemonWedgeListItem } from "@/domains/demonWedges/type";

import FormInput from "@/components/ui/FormInput";
import ContentSection from "@/components/ui/ContentSection";

import SlotCard from "./SlotCard";
import PickerModal from "./PickerModal";
import WedgeHoverCard from "./WedgeHoverCard";

import type { CharacterDetail } from "@/domains/characters/types";
import { fetchCharacterDetailClient, prefetchCharacterDetail } from "@/api/characters.client";

import { CHARACTER_MODAL_FILTERS } from "@/config/characterFilters";
import { WEAPON_FILTERS } from "@/config/weaponFilters";
import { DEMON_WEDGE_FILTERS } from "@/config/demonWedgeFilters";

import { ActiveTab, BuildId, BuildState, emptyBuildState, BuffFields, emptyBuffFields } from "./calculatorTypes";
import {
  TAB_LABELS,
  applyWedgesToBuff,
  applyPassiveUpgradesToBuff,
  applyWeaponPassiveToBuff,
  sumBuffs,
  tabToEquipType,
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
        critRatePct: (consonance as any)?.critRate ?? 0,
        critDamagePct: (consonance as any)?.critDamage ?? 0,
        attackSpeed: (consonance as any)?.attackSpeed ?? 1,
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
  contribRef: React.MutableRefObject<PassiveContrib>,
  key: keyof PassiveContrib,
  buff: BuffFields,
  setBuildFn: React.Dispatch<React.SetStateAction<BuildState>>,
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

  const wedgeOptionsForTab = useMemo(() => {
    const equipType = tabToEquipType[build.activeTab];
    const isKukulkanSlot = build.activeTab === "character" && picker?.type === "wedge" && picker.slotIndex === 8;
    return wedges.filter((w) => {
      if (w.equipType !== equipType) return false;
      if (isKukulkanSlot && !w.isKukulkan) return false;
      if (!isKukulkanSlot && build.activeTab === "character" && w.isKukulkan) return false;
      return true;
    });
  }, [wedges, build.activeTab, picker]);

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
        title={picker?.type === "character" && picker.target === "main" ? "메인 캐릭터 선택" : "협력 동료 선택"}
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
        onItemHover={(it: any) => {
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
        items={wedgeOptionsForTab as any}
        selectedSlug={picker?.type === "wedge" ? build.wedgeSlots[picker.tab][picker.slotIndex] : undefined}
        filters={DEMON_WEDGE_FILTERS.filter((f) => f.field !== "equipType" && f.field !== "element").map((f) => ({
          field: f.field,
          title: f.title,
          options: f.options,
        }))}
        grid="lg"
        renderHoverCard={(it: any) => <WedgeHoverCard wedge={it} />}
        itemClassName={(it: any) => {
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
