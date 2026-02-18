import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <img src="/images/home/error_404.png" alt="404" className="h-40 opacity-60" />
      <p className="text-lg text-white/60">페이지를 찾을 수 없습니다</p>
      <Link
        href="/"
        className="px-6 py-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30 transition"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
