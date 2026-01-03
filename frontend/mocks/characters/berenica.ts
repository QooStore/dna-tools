import { CharacterDetail } from "@/types/character";

export const BERENICA: CharacterDetail = {
  slug: "berenica",
  name: "베레니카",
  element: "어둠",
  image: "/images/characters/berenica_v1.png",

  meleeProficiency: "한손검",
  rangedProficiency: "쌍권총",

  features: ["딜러", "무기 대미지", "동조 무기"],

  baseStats: {
    attack: 251,
    hp: 1255,
    defense: 300,
    maxMentality: 150,
    resolve: 0,
    morale: 0,
  },

  consonanceWeapon: {
    category: "근접",
    type: "한손검",
    attackType: "베기",
    attack: 361.5,
    critRate: 12,
    critDamage: 150,
    attackSpeed: 1,
    triggerProbability: 50,
  },

  skills: [
    {
      name: "잔광",
      type: "대미지",
      description: "전방을 향해 돌진하여, 경로상에 어둠 속성 범위 대미지를 4회 입힌다.",
    },
    {
      name: "어둠의 불꽃",
      type: "버프",
      description:
        "근접 무기를 [이미르]로 교체하여 1개의 검기를 날리고, [이미르]로 기본 공격을 할 때 공격 방향으로 검기를 날린다. [이미르]를 사용하는 동안 자신이 대미지를 받을 시 경직되지 않으며, 정신력이 지속적으로 소모되고, 정신력이 0이 되거나 해당 스킬을 다시 사용하면 [이미르]를 회수한다.",
    },
    {
      name: "회전",
      type: "패시브",
      description: "[잔광]이나 한손검으로 대미지를 입힐 시, 일정 확률로 정신력을 회복한다.",
    },
  ],

  passiveUpgrade: {
    stats: {
      attackPercent: 50,
      skillEfficiencyPercent: 12.5,
    },

    effects: [
      {
        key: "afterburn",
        name: "잔불",
        description: "[어둠의 불꽃] 시전 후 다음 [잔광]을 시전할 때 정신력을 소모하지 않는다.",
      },
      {
        key: "heart_devourer",
        name: "심장 포식",
        description: "[협력 동료로 등장할 때에만 적용] 자신과 팀원의 공격력이 상승한다.",
        condition: "협력 동료",
        modifiers: {
          attackPercent: 40,
        },
      },
    ],
  },

  intron: [
    {
      stage: 1,
      description:
        "스파이럴 점프와 [잔광] 시전 시, 자신은 1단계의 스킬 효율 8% 상승 효과를 획득한다. 지속 시간 12초, 최대 3단계 중첩.",
    },
    { stage: 2, description: "HP 비율이 잣힌보다 낮은 대상에게 입히는 대미지 30% 상승." },
    { stage: 3, description: "[잔광] 레벨+2, [회전] 레벨+1" },
    { stage: 4, description: "자신의 콤보 레벨에 따라 공격이 상승한다. 레벨당 20% 상승." },
    { stage: 5, description: "[어둠의 불꽃] 레벨+2, [회전] 레벨+1" },
  ],
};
