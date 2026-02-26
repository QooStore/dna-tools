"use client";

import { useState, useRef } from "react";
import FormInput from "@/components/ui/FormInput";
import type { EnemyInputs, EnemyType, ElementCondition } from "./calculatorTypes";
import {
  ENEMY_TYPE_LABELS,
  ENEMY_DEF,
  ELEMENT_CONDITION_LABELS,
  ELEMENT_CONDITION_DESC,
  enemyDmgTakenCoeff,
} from "./calculatorLogic";

function num(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
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

export function EnemyForm({
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

export function DmgReductionModal({
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
