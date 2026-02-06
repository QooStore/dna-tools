"use client";

import Link from "next/link";

import { NAV_ITEMS } from "@/config/navigation";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0b1020]/80 backdrop-blur border-b border-white/10">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* 로고 = 홈 */}
        <Link href="/" className="text-lg font-bold tracking-wide text-white hover:text-cyan-400 transition">
          DNA TOOLS
        </Link>

        {/* 메뉴 */}
        <nav className="flex items-center gap-6 text-sm font-medium text-white/80">
          {NAV_ITEMS.map((item) => (
            // 메뉴 확장을 위한 임시 config 추가
            <Link
              key={item.href}
              href={item.href}
              className={`transition ${item.highlight ? "text-cyan-400 hover:text-cyan-300" : "hover:text-white"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
