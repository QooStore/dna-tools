"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import CharacterForm from "@/components/characters/new/CharacterForm";
import { adminSaveCharacter } from "@/lib/api/admin";
import { getCharacterDetail } from "@/lib/api/characters";

export default function EditCharacterPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug;
  const slug = typeof slugParam === "string" ? slugParam : undefined;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getCharacterDetail(slug);
        console.log("data ==> ", data);
        setInitialData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (payload: any) => {
    await adminSaveCharacter(payload, slug);
    router.push("/characters");
  };

  if (loading) {
    return <div className="text-white/50">로딩 중...</div>;
  }

  if (!initialData) {
    return <div className="text-red-400">캐릭터 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">캐릭터 수정</h1>

      <CharacterForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
