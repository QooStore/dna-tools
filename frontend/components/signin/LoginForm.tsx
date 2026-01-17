"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "@/lib/api/signin";

export default function LoginForm() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const onSubmit = () => {
    setError("");

    startTransition(async () => {
      const result = await adminLogin(userId, password);

      if (result.result !== "success") {
        setError("오류 발생!");
        return;
      }

      router.push("/");
    });
  };

  return (
    <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
      <h1 className="mb-6 text-center text-xl font-semibold text-zinc-100">로그인</h1>

      <input
        className="mb-3 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
        placeholder="아이디"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      <input
        type="password"
        className="mb-4 w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
      />

      {error && <p className="mb-4 text-center text-sm text-red-400">{error}</p>}

      <button
        onClick={onSubmit}
        disabled={isPending}
        className="w-full rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60 text-center"
      >
        {isPending ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
}
