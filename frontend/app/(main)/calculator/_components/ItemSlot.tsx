"use client";

import Image from "next/image";

type Props = {
  label: string;
  image?: string | null;
  name?: string | null;
  subtitle?: string;
  accent: "cyan" | "amber";
  onSelect: () => void;
  onClear: () => void;
};

export default function ItemSlot({ label, image, name, subtitle, accent, onSelect, onClear }: Props) {
  const isEmpty = !name;
  const ring = accent === "cyan" ? "hover:ring-cyan-400/40" : "hover:ring-amber-400/40";
  const border = accent === "cyan" ? "border-cyan-400/20" : "border-amber-400/20";
  const plus = accent === "cyan" ? "text-cyan-400/50" : "text-amber-400/50";

  return (
    <div className="relative group">
      <button
        onClick={onSelect}
        className={`
          relative flex items-center gap-3 w-full
          rounded-xl border bg-white/[0.03] p-3
          transition ring-1 ring-transparent ${ring}
          ${isEmpty ? "border-white/10" : border}
        `}
      >
        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
          {image ? (
            <Image src={image} alt={name ?? ""} fill className="object-contain p-0.5" />
          ) : (
            <span className={`flex h-full w-full items-center justify-center text-xl ${plus}`}>+</span>
          )}
        </div>

        <div className="min-w-0 flex-1 text-left">
          {isEmpty ? (
            <span className="text-sm text-white/30">{label}</span>
          ) : (
            <>
              <p className="truncate text-sm font-medium">{name}</p>
              {subtitle && <p className="truncate text-[11px] text-white/40">{subtitle}</p>}
            </>
          )}
        </div>
      </button>

      {!isEmpty && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="
            absolute -right-1.5 -top-1.5 z-10
            flex h-5 w-5 items-center justify-center
            rounded-full bg-red-500/80 text-[10px] text-white
            opacity-0 group-hover:opacity-100 transition
          "
        >
          ✕
        </button>
      )}
    </div>
  );
}
