import { DemonWedgeFormState, DemonWedgeSaveRequest } from "@/domains/demonWedgeForm";

const isBlank = (v?: string | null) => v === undefined || v === null || v.trim() === "";

export function buildDemonWedgePayload(form: DemonWedgeFormState): DemonWedgeSaveRequest {
  return {
    slug: form.slug,
    name: form.name,
    image: form.image,
    rarity: form.rarity,
    resistance: form.resistance,
    tendency: form.tendency,
    equipType: form.equipType,
    element: isBlank(form.element) ? undefined : form.element,
    isKukulkan: form.isKukulkan,
    effectDescription: isBlank(form.effectDescription) ? undefined : form.effectDescription,
    stats: form.stats.filter((s) => !isBlank(s.statType) && s.value !== 0),

    conditionalEffects:
      form.conditionalEffects
        ?.filter((e) => !isBlank(e.statType) && e.value !== 0)
        .map((e) => ({
          statType: e.statType,
          value: e.value,
        })) ?? undefined,
  };
}
