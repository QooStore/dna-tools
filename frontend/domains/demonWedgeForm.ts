export interface DemonWedgeStatForm {
  statType: string;
  value: number;
}

export interface DemonWedgeConditionalEffectForm {
  statType: string;
  value: number;
}

export interface DemonWedgeFormState {
  slug: string;
  name: string;
  image: string;
  rarity: number;
  resistance: number;
  tendency: string;
  equipType: string;
  element: string;
  isKukulkan: boolean;
  effectDescription: string;
  stats: DemonWedgeStatForm[];
  conditionalEffects: DemonWedgeConditionalEffectForm[];
}

export interface DemonWedgeSaveRequest {
  slug: string;
  name: string;
  image: string;
  rarity: number;
  resistance: number;
  tendency: string;
  equipType: string;
  element?: string;
  isKukulkan: boolean;
  effectDescription?: string;
  stats: DemonWedgeStatForm[];
  conditionalEffects?: DemonWedgeConditionalEffectForm[];
}
