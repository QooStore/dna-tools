"use client";
import { useRouter } from "next/navigation";

import CharacterForm from "../_form/CharacterForm";

import { adminSaveCharacter } from "@/api/admin";
import { CharacterSaveRequest } from "@/domains/characterForm";

export default function NewCharacterPage() {
  const router = useRouter();

  const handleSubmit = async (data: CharacterSaveRequest) => {
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
