import { WeaponFormState, WeaponSaveRequest } from "@/domains/weaponForm";

const isBlank = (v?: string | null) => v === undefined || v === null || v.trim() === "";

export function buildWeaponPayload(form: WeaponFormState): WeaponSaveRequest {
  const isMelee = form.category === "melee";
  const isRanged = form.category === "ranged";

  return {
    slug: form.slug,
    name: form.name,
    image: form.image,

    category: form.category,
    weaponType: form.weaponType,
    attackType: form.attackType,
    element: isBlank(form.element) ? undefined : form.element,

    attack: form.attack,
    critRate: form.critRate,
    critDamage: form.critDamage,
    attackSpeed: form.attackSpeed,
    triggerProbability: form.triggerProbability,

    // 근접 전용
    chargeAttackSpeed: isMelee ? form.chargeAttackSpeed : undefined,
    fallAttackSpeed: isMelee ? form.fallAttackSpeed : undefined,

    // 원거리 전용
    multiShot: isRanged ? form.multiShot : undefined,
    maxAmmo: isRanged ? form.maxAmmo : undefined,
    ammoConversionRate: isRanged ? form.ammoConversionRate : undefined,

    // 스킬
    passiveStat: isBlank(form.passiveStat) ? undefined : form.passiveStat,
    passiveValue: form.passiveValue || undefined,
    activeSkillDescription: isBlank(form.activeSkillDescription) ? undefined : form.activeSkillDescription,
  };
}
