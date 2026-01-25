"use client";
import { useRouter } from "next/navigation";

import CharacterForm from "@/components/characters/new/CharacterForm";

import { adminSaveCharacter } from "@/lib/api/admin";

export default function NewCharacterPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await adminSaveCharacter(data);
    router.push("/characters");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">캐릭터 등록</h1>

      <CharacterForm onSubmit={handleSubmit} />
    </div>
  );
}
