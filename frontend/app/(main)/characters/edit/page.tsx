"use client";

import CharacterForm from "@/components/characters/new/CharacterForm";
import { useRouter } from "next/navigation";

export default function NewCharacterPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    // await adminCreateCharacter(data);
    router.push("/characters");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">캐릭터 수정</h1>

      <CharacterForm onSubmit={handleSubmit} />
    </div>
  );
}
