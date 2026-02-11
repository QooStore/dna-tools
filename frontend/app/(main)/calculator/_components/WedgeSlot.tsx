"use client";

import Image from "next/image";

type Props = {
  index: number;
  label?: string;
  image?: string | null;
  name?: string | null;
  onSelect: () => void;
  onClear: () => void;
};

export default function WedgeSlot({ index, label, image, name, onSelect, onClear }: Props) {
  const isEmpty = !name;

  return (
    <div className="flex flex-col items-center gap-1.5 group">
      <button
        onClick={onSelect}
        className={`
          relative flex items-center justify-center
          h-24 w-24
          rounded-lg
          transition
          ${isEmpty
            ? "border-2 border-dashed border-white/15 hover:border-white/30 bg-white/[0.02]"
            : "border border-white/20 bg-white/[0.05] hover:border-cyan-400/40"
          }
        `}
      >
        {image ? (
          <Image src={image} alt={name ?? ""} fill className="object-contain p-1.5 rounded-lg" />
        ) : (
          <span className="text-2xl text-white/20">+</span>
        )}

        {/* 제거 버튼 */}
        {!isEmpty && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
            className="
              absolute -right-1.5 -top-1.5 z-10
              flex h-5 w-5 items-center justify-center
              rounded-full bg-red-500/80 text-[10px] text-white
              opacity-0 group-hover:opacity-100 transition cursor-pointer
            "
          >
            ✕
          </span>
        )}
      </button>

      <span className="text-[11px] text-white/35 truncate max-w-[96px] text-center">
        {name ?? label ?? `Slot ${index + 1}`}
      </span>
    </div>
  );
}
