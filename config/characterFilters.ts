export type FilterGroup = {
  key: string;
  label: string;
  options: string[];
};

export const CHARACTER_FILTERS: FilterGroup[] = [
  {
    key: "element",
    label: "속성",
    options: ["All", "물", "불", "바람", "번개", "빛", "어둠"],
  },
  {
    key: "meleeProficiency",
    label: "근거리 무기 마스터리",
    options: ["All", "대검", "쌍도", "대도", "장병기"],
  },
  {
    key: "rangedProficiency",
    label: "원거리 무기 마스터리",
    options: ["All", "권총", "소총", "활", "저격총"],
  },
  {
    key: "feature",
    label: "특성",
    options: [
      "All",
      "딜러",
      "서포터",
      "치료",
      "정신력 회복",
      "동조 무기",
      "무기 대미지",
      "스킬 대미지",
      "소환물",
      "제어",
      "실드",
      "최대 HP",
      "방어",
      "최대 정신력",
    ],
  },
];
