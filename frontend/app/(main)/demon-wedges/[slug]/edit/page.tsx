"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import DemonWedgeForm from "../../_form/DemonWedgeForm";
import { adminSaveDemonWedge } from "@/api/admin";
import { getDemonWedgeDetail } from "@/api/demonWedges";
import { DemonWedgeSaveRequest, DemonWedgeFormState } from "@/domains/demonWedgeForm";

export default function EditDemonWedgePage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug;
  const slug = typeof slugParam === "string" ? slugParam : undefined;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<DemonWedgeFormState> | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getDemonWedgeDetail(slug);
        setInitialData({
          ...data,
          image: data.image ?? "",
          element: data.element ?? "",
          isKukulkan: data.isKukulkan ?? false,
          effectDescription: data.effectDescription ?? "",
          stats: data.stats ?? [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (payload: DemonWedgeSaveRequest) => {
    await adminSaveDemonWedge(payload, slug);
    router.push("/demon-wedges");
  };

  if (loading) {
    return <div className="text-white/50">로딩 중...</div>;
  }

  if (!initialData) {
    return <div className="text-red-400">악마의 쐐기 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">악마의 쐐기 수정</h1>

      <DemonWedgeForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
