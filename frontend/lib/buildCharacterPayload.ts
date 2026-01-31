import { CharacterFormState } from "@/domains/characterForm";
import { CharacterSaveRequest } from "@/domains/characterApi";

const isBlank = (v?: string | null) => v === undefined || v === null || v.trim() === "";

export function buildCharacterPayload(form: CharacterFormState): CharacterSaveRequest {
  return {
    slug: form.slug,
    name: form.name,
    elementCode: form.elementCode,
    image: form.image,
    elementImage: form.elementImage,
    listImage: form.listImage,
    meleeProficiency: form.meleeProficiency,
    rangedProficiency: form.rangedProficiency,

    stats: form.stats
      ? {
          attack: form.stats.attack,
          hp: form.stats.hp,
          defense: form.stats.defense,
          maxMentality: form.stats.maxMentality,
          resolve: form.stats.resolve,
          morale: form.stats.morale,
        }
      : undefined,

    consonanceWeapon:
      !isBlank(form.consonanceWeapon.weaponType) && !isBlank(form.consonanceWeapon.category)
        ? {
            category: form.consonanceWeapon.category,
            weaponType: form.consonanceWeapon.weaponType,
            attackType: form.consonanceWeapon.attackType,
            attack: form.consonanceWeapon.attack,
            critRate: form.consonanceWeapon.critRate,
            critDamage: form.consonanceWeapon.critDamage,
            attackSpeed: form.consonanceWeapon.attackSpeed,
            triggerProbability: form.consonanceWeapon.triggerProbability,
          }
        : undefined,

    features: form.features && form.features.length > 0 ? form.features : undefined,

    skills:
      form.skills
        ?.filter((s) => !isBlank(s.name) && !isBlank(s.type))
        .map((s) => ({
          name: s.name,
          type: s.type,
          description: s.description,
        })) ?? undefined,

    introns:
      form.introns
        ?.filter((i) => i.stage > 0 && !isBlank(i.description))
        .map((i) => ({
          stage: i.stage,
          description: i.description,
        })) ?? undefined,

    passiveUpgrades:
      form.passiveUpgrades
        ?.filter((p) => !isBlank(p.upgradeKey) && !isBlank(p.upgradeType) && !isBlank(p.name))
        .map((p) => ({
          upgradeKey: p.upgradeKey,
          upgradeType: p.upgradeType,
          targetStat: p.targetStat || undefined,
          value: p.value ?? undefined,
          name: p.name,
          description: p.description || undefined,
        })) ?? undefined,
  };
}
