"use client";

import { useState, useCallback } from "react";
import {
  BuildState,
  EMPTY_BUILD,
  SharedSettings,
  ModalTarget,
  ReferenceData,
  SlotCategory,
  BuildStats,
  EMPTY_BUILD_STATS,
} from "@/domains/calculator/types";
import { getCharacterDetail } from "@/api/characters";
import { CharacterListItem } from "@/domains/characters/types";
import { WeaponListItem } from "@/domains/weapons/type";
import { DemonWedgeListItem } from "@/domains/demonWedges/type";

import BuildColumn from "./BuildColumn";
import SelectionModal from "./SelectionModal";

type Props = {
  referenceData: ReferenceData;
};

export default function CalculatorClient({ referenceData }: Props) {
  const [buildA, setBuildA] = useState<BuildState>({ ...EMPTY_BUILD });
  const [buildB, setBuildB] = useState<BuildState>({ ...EMPTY_BUILD });

  const [statsA, setStatsA] = useState<BuildStats>(JSON.parse(JSON.stringify(EMPTY_BUILD_STATS)));
  const [statsB, setStatsB] = useState<BuildStats>(JSON.parse(JSON.stringify(EMPTY_BUILD_STATS)));

  const [settings, setSettings] = useState<SharedSettings>({
    currentHpPercent: 100,
  });

  const [modal, setModal] = useState<ModalTarget | null>(null);

  const getSetBuild = (key: "A" | "B") => (key === "A" ? setBuildA : setBuildB);

  // --- 모달 열기 ---
  const openModal = useCallback((target: ModalTarget) => {
    setModal(target);
  }, []);

  // --- 모달에서 아이템 선택 ---
  const handleSelect = useCallback(
    async (item: CharacterListItem | WeaponListItem | DemonWedgeListItem) => {
      if (!modal) return;

      const setBuild = getSetBuild(modal.build);
      const cat = modal.slotCategory;

      if (cat === "character" || cat === "ally1" || cat === "ally2") {
        const charItem = item as CharacterListItem;
        try {
          const detail = await getCharacterDetail(charItem.slug);
          if (cat === "character") {
            setBuild((prev) => ({ ...prev, character: detail }));
          } else if (cat === "ally1") {
            setBuild((prev) => ({ ...prev, ally1: detail }));
          } else {
            setBuild((prev) => ({ ...prev, ally2: detail }));
          }
        } catch {
          alert("캐릭터 정보를 불러올 수 없습니다.");
        }
      } else if (cat === "meleeWeapon") {
        setBuild((prev) => ({ ...prev, meleeWeapon: item as WeaponListItem }));
      } else if (cat === "rangedWeapon") {
        setBuild((prev) => ({ ...prev, rangedWeapon: item as WeaponListItem }));
      } else {
        const wedge = item as DemonWedgeListItem;
        const idx = modal.slotIndex ?? 0;
        const wedgeKey = getWedgeKey(cat);
        if (wedgeKey) {
          setBuild((prev) => {
            const arr = [...prev[wedgeKey]];
            arr[idx] = wedge;
            return { ...prev, [wedgeKey]: arr };
          });
        }
      }

      setModal(null);
    },
    [modal],
  );

  // --- 슬롯 비우기 ---
  const handleClear = useCallback((build: "A" | "B", cat: SlotCategory, index?: number) => {
    const setBuild = getSetBuild(build);

    if (cat === "character") {
      setBuild((prev) => ({ ...prev, character: null }));
    } else if (cat === "ally1") {
      setBuild((prev) => ({ ...prev, ally1: null }));
    } else if (cat === "ally2") {
      setBuild((prev) => ({ ...prev, ally2: null }));
    } else if (cat === "meleeWeapon") {
      setBuild((prev) => ({ ...prev, meleeWeapon: null }));
    } else if (cat === "rangedWeapon") {
      setBuild((prev) => ({ ...prev, rangedWeapon: null }));
    } else {
      const wedgeKey = getWedgeKey(cat);
      if (wedgeKey && index !== undefined) {
        setBuild((prev) => {
          const arr = [...prev[wedgeKey]];
          arr[index] = null;
          return { ...prev, [wedgeKey]: arr };
        });
      }
    }
  }, []);

  // --- 모달용 데이터 ---
  const getModalItems = (): (CharacterListItem | WeaponListItem | DemonWedgeListItem)[] => {
    if (!modal) return [];
    const cat = modal.slotCategory;

    if (cat === "character" || cat === "ally1" || cat === "ally2") return referenceData.characters;
    if (cat === "meleeWeapon") return referenceData.weapons.filter((w) => w.category === "melee");
    if (cat === "rangedWeapon") return referenceData.weapons.filter((w) => w.category === "ranged");
    if (cat === "characterWedge")
      return referenceData.demonWedges.filter((d) => d.equipType === "character" && !d.isKukulkan);
    if (cat === "kukulkanWedge") return referenceData.demonWedges.filter((d) => d.isKukulkan);
    if (cat === "meleeWedge") return referenceData.demonWedges.filter((d) => d.equipType === "meleeWeapon");
    if (cat === "rangedWedge") return referenceData.demonWedges.filter((d) => d.equipType === "rangedWeapon");
    if (cat === "consonanceWedge") return referenceData.demonWedges.filter((d) => d.equipType === "consonanceWeapon");
    return [];
  };

  const getModalTitle = (): string => {
    if (!modal) return "";
    const titles: Record<SlotCategory, string> = {
      character: "캐릭터 선택",
      ally1: "협력 동료 1 선택",
      ally2: "협력 동료 2 선택",
      meleeWeapon: "근거리 무기 선택",
      rangedWeapon: "원거리 무기 선택",
      characterWedge: "캐릭터 쐐기 선택",
      kukulkanWedge: "쿠쿨칸 쐐기 선택",
      meleeWedge: "근거리 무기 쐐기 선택",
      rangedWedge: "원거리 무기 쐐기 선택",
      consonanceWedge: "동조 무기 쐐기 선택",
    };
    return titles[modal.slotCategory];
  };

  return (
    <>
      {/* HP 슬라이더 (공유) */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4">
        <label className="text-sm text-white/50">
          현재 HP: <span className="font-bold text-white/80">{settings.currentHpPercent}%</span>
          <span className="ml-2 text-xs text-white/30">(필사 · 격양 계수에 영향)</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={settings.currentHpPercent}
          onChange={(e) => setSettings({ ...settings, currentHpPercent: Number(e.target.value) })}
          className="mt-2 w-full accent-cyan-400"
        />
      </div>

      {/* 빌드 비교 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BuildColumn
          label="Build A"
          accent="cyan"
          build={buildA}
          stats={statsA}
          onStatsChange={setStatsA}
          currentHpPercent={settings.currentHpPercent}
          onOpenModal={(cat, idx) => openModal({ build: "A", slotCategory: cat, slotIndex: idx })}
          onClear={(cat, idx) => handleClear("A", cat, idx)}
        />
        <BuildColumn
          label="Build B"
          accent="amber"
          build={buildB}
          stats={statsB}
          onStatsChange={setStatsB}
          currentHpPercent={settings.currentHpPercent}
          onOpenModal={(cat, idx) => openModal({ build: "B", slotCategory: cat, slotIndex: idx })}
          onClear={(cat, idx) => handleClear("B", cat, idx)}
        />
      </div>

      {/* 결과 비교 (Phase 3~4) */}
      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center">
        <h2 className="text-lg font-semibold text-white/50">결과 비교</h2>
        <p className="mt-2 text-sm text-white/30">Phase 3~4에서 구현 예정</p>
      </div>

      {/* 선택 모달 */}
      {modal && (
        <SelectionModal
          title={getModalTitle()}
          items={getModalItems()}
          slotCategory={modal.slotCategory}
          onSelect={handleSelect}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function getWedgeKey(
  cat: SlotCategory,
): keyof Pick<BuildState, "characterWedges" | "meleeWedges" | "rangedWedges" | "consonanceWedges"> | null {
  switch (cat) {
    case "characterWedge":
    case "kukulkanWedge":
      return "characterWedges";
    case "meleeWedge":
      return "meleeWedges";
    case "rangedWedge":
      return "rangedWedges";
    case "consonanceWedge":
      return "consonanceWedges";
    default:
      return null;
  }
}
