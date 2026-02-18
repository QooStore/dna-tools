"use client";

type SlotItem = {
  name: string;
  listImage?: string;
  image?: string | null;
};

export default function SlotCard({
  label,
  item,
  onClick,
  size = "md",
  disabled = false,
}: {
  label: string;
  item?: SlotItem;
  onClick: () => void;
  size?: "sm" | "md";
  disabled?: boolean;
}) {
  const img = item?.listImage || item?.image;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`group w-fit ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      <div
        className={
          "relative mx-auto overflow-hidden rounded-2xl border border-dashed transition " +
          (disabled ? "border-white/10 bg-white/3" : "border-white/25 bg-white/5 hover:bg-white/10") +
          " " +
          (size === "sm" ? "h-[160px] w-[120px]" : "h-[220px] w-[160px]")
        }
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={item?.name ?? label} className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-3xl text-white/80">{disabled ? "" : "+"}</div>
          </div>
        )}
        {/* overlay name */}
        {item?.name ? (
          <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1">
            <div className="truncate text-xs font-semibold text-white/90">{item.name}</div>
          </div>
        ) : null}
      </div>

      <div className="mt-2 text-center text-sm font-semibold text-white/80 group-hover:text-white">{label}</div>
    </button>
  );
}
