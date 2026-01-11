type AdminActionButtonProps = {
  variant: "edit" | "delete";
  onClick: () => void;
};

export function AdminActionButton({ variant, onClick }: AdminActionButtonProps) {
  const styles = {
    edit: "text-cyan-300 ring-cyan-500 hover:bg-cyan-500/20",
    delete: "text-red-300 ring-red-500 hover:bg-red-500/20",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`
        pointer-events-auto
        rounded-full
        bg-black/70
        px-4 py-2
        text-sm font-semibold
        ring-1
        transition
        ${styles[variant]}
      `}
    >
      {variant === "edit" ? "수정" : "삭제"}
    </button>
  );
}
