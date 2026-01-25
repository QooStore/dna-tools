import { isBlank } from "@/lib/utils";

export function buildCharacterPayload(form: any) {
  return {
    slug: form.slug,
    name: form.name,
    elementCode: form.elementCode,
    image: form.image,
    elementImage: form.elementImage,
    listImage: form.listImage,
    meleeProficiency: form.meleeProficiency,
    rangedProficiency: form.rangedProficiency,

    stats: form.stats ?? undefined,

    consonanceWeapon: form.consonanceWeapon ?? undefined,

    features: form.features && form.features.length > 0 ? form.features : undefined,

    skills:
      form.skills && form.skills.length > 0
        ? form.skills.filter((s: any) => !isBlank(s.name) && !isBlank(s.type))
        : undefined,

    introns:
      form.introns && form.introns.length > 0 ? form.introns.filter((i: any) => !isBlank(i.description)) : undefined,

    passiveUpgrades:
      form.passiveUpgrades && form.passiveUpgrades.length > 0
        ? form.passiveUpgrades.filter((p: any) => !isBlank(p.upgradeKey) && !isBlank(p.upgradeType) && !isBlank(p.name))
        : undefined,
  };
}
