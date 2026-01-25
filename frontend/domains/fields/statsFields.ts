import type { Field } from "@/components/characters/new/FormSectionRenderer";

export const STATS_FIELDS: readonly Field[] = [
  { key: "attack", label: "공격력", kind: "number" },
  { key: "hp", label: "체력", kind: "number" },
  { key: "defense", label: "방어력", kind: "number" },
  { key: "maxMentality", label: "최대 정신력", kind: "number" },
  { key: "resolve", label: "필사", kind: "number" },
  { key: "morale", label: "격양", kind: "number" },
];
