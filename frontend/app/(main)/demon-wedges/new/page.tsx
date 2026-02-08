"use client";
import { useRouter } from "next/navigation";

import DemonWedgeForm from "../_form/DemonWedgeForm";

import { adminSaveDemonWedge } from "@/api/admin";
import { DemonWedgeSaveRequest } from "@/domains/demonWedgeForm";

export default function NewDemonWedgePage() {
  const router = useRouter();

  const handleSubmit = async (data: DemonWedgeSaveRequest) => {
    await adminSaveDemonWedge(data);
    router.push("/demon-wedges");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">악마의 쐐기 등록</h1>

      <DemonWedgeForm onSubmit={handleSubmit} />
    </div>
  );
}
