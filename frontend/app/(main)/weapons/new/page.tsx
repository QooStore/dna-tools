"use client";
import { useRouter } from "next/navigation";

import WeaponForm from "../_form/WeaponForm";

import { adminSaveWeapon } from "@/api/admin";
import { WeaponSaveRequest } from "@/domains/weaponForm";

export default function NewWeaponPage() {
  const router = useRouter();

  const handleSubmit = async (data: WeaponSaveRequest) => {
    await adminSaveWeapon(data);
    router.push("/weapons");
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">무기 등록</h1>

      <WeaponForm onSubmit={handleSubmit} />
    </div>
  );
}
