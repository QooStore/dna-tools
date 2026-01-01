export type Character = {
  id: string;
  name: string;
  image: string;
  element: string;
  features: string[];
  elementIcon: string;
  slug: string;
  meleeProficiency: string;
  rangedProficiency: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "berenica",
    name: "베레니카",
    image: "/images/character_list/berenica.png",
    element: "불",
    elementIcon: "/images/element_icon/umbro.png",
    features: ["딜러", "무기 대미지"],
    slug: "berenica",
    meleeProficiency: "대검",
    rangedProficiency: "권총",
  },
  {
    id: "fina",
    name: "피나",
    image: "/images/character_list/fina.png",
    element: "물",
    elementIcon: "/images/element_icon/hydro.png",
    features: ["서포터", "치료", "정신력 회복"],
    slug: "fina",
    meleeProficiency: "쌍도",
    rangedProficiency: "소총",
  },
  {
    id: "kezhuo",
    name: "커저우",
    image: "/images/character_list/tabethe.png",
    element: "번개",
    elementIcon: "/images/element_icon/electro.png",
    features: ["딜러", "스킬 대미지", "제어", "서포터", "치료", "정신력 회복"],
    slug: "abc",
    meleeProficiency: "장병기",
    rangedProficiency: "저격총",
  },
];
