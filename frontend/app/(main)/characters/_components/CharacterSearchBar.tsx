"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CharacterSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에 있는 keyword를 초기값으로 사용
  const keywordFromUrl = searchParams.get("keyword") ?? "";
  const [value, setValue] = useState(keywordFromUrl);

  // 뒤로가기 / URL 변경 시 input 값 동기화
  useEffect(() => {
    setValue(keywordFromUrl);
  }, [keywordFromUrl]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim() === "") {
      params.delete("keyword");
    } else {
      params.set("keyword", value.trim());
    }

    router.push(`?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative w-full max-w-sm">
      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
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
