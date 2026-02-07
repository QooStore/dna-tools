import { WEAPON_TYPE_OPTIONS, WEAPON_PROFICIENCY_OPTIONS, ATTACK_TYPE_OPTIONS } from "@/config/options";

type Option = { value: string; label: string };

export type Field =
  | {
      key: string;
      label: string;
      kind: "text";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      kind: "number";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      kind: "select";
      options: readonly Option[];
      placeholder?: string;
    };

export const STATS_FIELDS: readonly Field[] = [
  { key: "attack", label: "공격력", kind: "number" },
  { key: "hp", label: "체력", kind: "number" },
  { key: "defense", label: "방어력", kind: "number" },
  { key: "maxMentality", label: "최대 정신력", kind: "number" },
  { key: "resolve", label: "필사", kind: "number" },
  { key: "morale", label: "격양", kind: "number" },
];

export const WEAPON_FIELDS: readonly Field[] = [
  {
    key: "category",
    label: "무기 카테고리",
    kind: "select",
    options: WEAPON_TYPE_OPTIONS,
    placeholder: "근접 / 원거리",
  },
  {
    key: "weaponType",
    label: "무기 타입",
    kind: "select",
    options: WEAPON_PROFICIENCY_OPTIONS,
    placeholder: "무기 타입 선택",
  },
  {
    key: "attackType",
    label: "공격 타입",
    kind: "select",
    options: ATTACK_TYPE_OPTIONS,
    placeholder: "공격 타입 선택",
  },
  { key: "attack", label: "공격력", kind: "number" },
  { key: "critRate", label: "치명타 확률 (%)", kind: "number" },
  { key: "critDamage", label: "치명타 피해량 (%)", kind: "number" },
  { key: "attackSpeed", label: "공격 속도", kind: "number" },
  { key: "triggerProbability", label: "발동 확률 (%)", kind: "number" },
];
