"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import WeaponForm from "../../_form/WeaponForm";
import { adminSaveWeapon } from "@/api/admin";
import { getWeaponDetail } from "@/api/weapons";
import { WeaponSaveRequest, WeaponFormState } from "@/domains/weaponForm";

export default function EditWeaponPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug;
  const slug = typeof slugParam === "string" ? slugParam : undefined;

  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<Partial<WeaponFormState> | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const data = await getWeaponDetail(slug);
        setInitialData({
          ...data,
          image: data.image ?? "",
          element: data.element ?? "",
          chargeAttackSpeed: data.chargeAttackSpeed ?? 0,
          fallAttackSpeed: data.fallAttackSpeed ?? 0,
          multishot: data.multishot ?? 0,
          maxAmmo: data.maxAmmo ?? 0,
          magCapacity: data.magCapacity ?? 0,
          ammoConversionRate: data.ammoConversionRate ?? 0,
          passiveStat: data.passiveStat ?? "",
          passiveValue: data.passiveValue ?? 0,
          activeSkillDescription: data.activeSkillDescription ?? "",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const handleSubmit = async (payload: WeaponSaveRequest) => {
    await adminSaveWeapon(payload, slug);
    router.push("/weapons");
  };

  if (loading) {
    return <div className="text-white/50">로딩 중...</div>;
  }

  if (!initialData) {
    return <div className="text-red-400">무기 데이터를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">무기 수정</h1>

      <WeaponForm initialData={initialData} onSubmit={handleSubmit} />
    </div>
  );
}
