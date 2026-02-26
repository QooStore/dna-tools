"use client";

import type { CharacterListItem } from "@/domains/characters/types";
import type { WeaponListItem } from "@/domains/weapons/type";
import type { DemonWedgeListItem } from "@/domains/demonWedges/type";
import type { BuildState } from "./calculatorTypes";
import { STAT_TYPE_LABEL } from "./calculatorLogic";

const SOURCE_TYPE_LABELS: Record<string, string> = {
  SKILL: "스킬 버프",
  PASSIVE: "패시브",
  INTRON: "근원",
};

export function ConditionalEffectsToggle({
  build,
  meleeWeapon,
  rangedWeapon,
  allWedges,
  allWeapons,
  characters,
  onToggle,
}: {
  build: BuildState;
  meleeWeapon?: WeaponListItem;
  rangedWeapon?: WeaponListItem;
  allWedges: DemonWedgeListItem[];
  allWeapons: WeaponListItem[];
  characters: CharacterListItem[];
  onToggle: (key: string) => void;
}) {
  const disabledSet = new Set(build.conditionalEffects.disabledKeys);

  // 캐릭터 효과: sourceType 기준 그룹핑
  const charEffectsBySource: Record<string, typeof build.conditionalEffects.characterEffects> = {};
  for (const e of build.conditionalEffects.characterEffects) {
    const src = e.sourceType ?? "기타";
    if (!charEffectsBySource[src]) charEffectsBySource[src] = [];
    charEffectsBySource[src].push(e);
  }

  // 무기 효과
  const meleeEffects = meleeWeapon?.conditionalEffects ?? [];
  const rangedEffects = rangedWeapon?.conditionalEffects ?? [];

  // 쐐기 효과 (장착된 쐐기 중 조건부 효과 있는 것, 슬러그 중복 제거)
  const wedgeMap = new Map(allWedges.map((w) => [w.slug, w]));
  const seenSlugs = new Set<string>();
  const wedgesWithEffects: { name: string; slug: string; effects: DemonWedgeListItem["conditionalEffects"] }[] = [];
  for (const slugs of Object.values(build.wedgeSlots)) {
    for (const slug of slugs) {
      if (!slug || seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);
      const w = wedgeMap.get(slug);
      if (!w?.conditionalEffects?.length) continue;
      wedgesWithEffects.push({ name: w.name, slug: w.slug, effects: w.conditionalEffects });
    }
  }

  // 협력 동료 효과 데이터 계산
  const allyEffectDataList = ([0, 1] as const).flatMap((allyIdx) => {
    const allySlug = allyIdx === 0 ? build.selections.ally1Slug : build.selections.ally2Slug;
    if (!allySlug) return [];
    const ally = build.allies[allyIdx];
    const allyChar = characters.find((c) => c.slug === allySlug);
    const allyLabel = allyChar ? `협력 동료 ${allyIdx + 1} — ${allyChar.name}` : `협력 동료 ${allyIdx + 1}`;

    const allyCharEffsBySource: Record<string, typeof build.conditionalEffects.characterEffects> = {};
    for (const e of ally.characterConditionalEffects) {
      const src = e.sourceType ?? "기타";
      if (!allyCharEffsBySource[src]) allyCharEffsBySource[src] = [];
      allyCharEffsBySource[src].push(e);
    }

    const allyWeapon = ally.weaponSlug ? allWeapons.find((w) => w.slug === ally.weaponSlug) : undefined;
    const allyWeaponEffects = allyWeapon?.conditionalEffects ?? [];

    const allySeenSlugs = new Set<string>();
    const allyWedgesWithEffects: typeof wedgesWithEffects = [];
    for (const slug of [...ally.wedgeSlotsCharacter, ...ally.wedgeSlotsWeapon]) {
      if (!slug || allySeenSlugs.has(slug)) continue;
      allySeenSlugs.add(slug);
      const w = wedgeMap.get(slug);
      if (!w?.conditionalEffects?.length) continue;
      allyWedgesWithEffects.push({ name: w.name, slug: w.slug, effects: w.conditionalEffects });
    }

    const hasAny =
      ally.characterConditionalEffects.length > 0 ||
      allyWeaponEffects.length > 0 ||
      allyWedgesWithEffects.length > 0;

    if (!hasAny) return [];

    return [{
      allyIdx,
      allyLabel,
      charEffectsBySource: allyCharEffsBySource,
      weapon: allyWeapon,
      weaponEffects: allyWeaponEffects,
      wedgesWithEffects: allyWedgesWithEffects,
    }];
  });

  const hasCharEffects = build.conditionalEffects.characterEffects.length > 0;
  const hasMeleeEffects = meleeEffects.length > 0;
  const hasRangedEffects = rangedEffects.length > 0;
  const hasWedgeEffects = wedgesWithEffects.length > 0;
  const hasAllyEffects = allyEffectDataList.length > 0;

  const renderToggle = (key: string, statType: string, value: number, extra?: string) => {
    const isEnabled = !disabledSet.has(key);
    const label = STAT_TYPE_LABEL[statType] ?? statType;
    return (
      <button
        key={key}
        type="button"
        onClick={() => onToggle(key)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition text-left ${
          isEnabled
            ? "border-indigo-400/60 bg-indigo-400/15 text-indigo-200"
            : "border-white/15 bg-white/5 text-white/60 hover:bg-white/10"
        }`}
      >
        <span
          className={`w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center ${
            isEnabled ? "border-indigo-400 bg-indigo-400" : "border-white/40"
          }`}
        >
          {isEnabled && (
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 text-white" fill="currentColor">
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span>
          {label} {value > 0 ? "+" : ""}{value}
          {extra && <span className="ml-1 text-xs opacity-60">({extra})</span>}
        </span>
      </button>
    );
  };

  if (!hasCharEffects && !hasMeleeEffects && !hasRangedEffects && !hasWedgeEffects && !hasAllyEffects) {
    return <p className="text-sm text-white/40">등록된 조건부 효과가 없습니다.</p>;
  }

  return (
    <div className="space-y-5">
      {/* 캐릭터 조건부 효과 */}
      {hasCharEffects && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-white/70">캐릭터</div>
          {Object.entries(charEffectsBySource).map(([sourceType, effects]) => (
            <div key={sourceType} className="space-y-2">
              <div className="text-xs text-white/50">{SOURCE_TYPE_LABELS[sourceType] ?? sourceType}</div>
              <div className="flex flex-wrap gap-2">
                {effects.map((e) =>
                  renderToggle(
                    `char-${e.id}`,
                    e.statType,
                    e.value,
                    e.intronStage ? `${e.intronStage}단계` : undefined,
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 근접 무기 조건부 효과 */}
      {hasMeleeEffects && meleeWeapon && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-white/70">근접 무기: {meleeWeapon.name}</div>
          <div className="flex flex-wrap gap-2">
            {meleeEffects.map((e) => renderToggle(`mw-${e.id}`, e.statType, e.value))}
          </div>
        </div>
      )}

      {/* 원거리 무기 조건부 효과 */}
      {hasRangedEffects && rangedWeapon && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-white/70">원거리 무기: {rangedWeapon.name}</div>
          <div className="flex flex-wrap gap-2">
            {rangedEffects.map((e) => renderToggle(`rw-${e.id}`, e.statType, e.value))}
          </div>
        </div>
      )}

      {/* 쐐기 조건부 효과 */}
      {wedgesWithEffects.map(({ name, slug, effects }) => (
        <div key={slug} className="space-y-2">
          <div className="text-sm font-semibold text-white/70">쐐기: {name}</div>
          <div className="flex flex-wrap gap-2">
            {effects.map((e) => renderToggle(`wedge-${e.id}`, e.statType, e.value))}
          </div>
        </div>
      ))}

      {/* 협력 동료 조건부 효과 */}
      {allyEffectDataList.map(({ allyIdx, allyLabel, charEffectsBySource: allyCharEffsBySource, weapon: allyWeapon, weaponEffects: allyWeaponEffects, wedgesWithEffects: allyWedgesWithEffects }) => {
        const pfx = `ally${allyIdx + 1}`;
        return (
          <div key={allyIdx} className="space-y-3">
            <div className="text-sm font-semibold text-white/70">{allyLabel}</div>
            {Object.entries(allyCharEffsBySource).map(([sourceType, effects]) => (
              <div key={sourceType} className="space-y-2">
                <div className="text-xs text-white/50">{SOURCE_TYPE_LABELS[sourceType] ?? sourceType}</div>
                <div className="flex flex-wrap gap-2">
                  {effects.map((e) =>
                    renderToggle(`${pfx}-char-${e.id}`, e.statType, e.value, e.intronStage ? `${e.intronStage}단계` : undefined)
                  )}
                </div>
              </div>
            ))}
            {allyWeaponEffects.length > 0 && allyWeapon && (
              <div className="space-y-2">
                <div className="text-xs text-white/50">무기: {allyWeapon.name}</div>
                <div className="flex flex-wrap gap-2">
                  {allyWeaponEffects.map((e) => renderToggle(`${pfx}-wep-${e.id}`, e.statType, e.value))}
                </div>
              </div>
            )}
            {allyWedgesWithEffects.map(({ name, slug, effects }) => (
              <div key={slug} className="space-y-2">
                <div className="text-xs text-white/50">쐐기: {name}</div>
                <div className="flex flex-wrap gap-2">
                  {effects.map((e) => renderToggle(`${pfx}-wedge-${e.id}`, e.statType, e.value))}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
