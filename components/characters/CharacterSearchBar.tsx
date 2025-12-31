"use client";

export default function CharacterSearchBar() {
  return (
    <div className="relative w-full max-w-sm">
      {/* Input */}
      <input
        type="text"
        placeholder="캐릭터 검색"
        className="
          h-10 w-full rounded-md
          bg-white/5 pl-9 pr-3
          text-sm text-white
          ring-1 ring-white/10
          outline-none
          transition
          placeholder:text-white/40
          focus:ring-cyan-400
        "
      />
    </div>
  );
}
