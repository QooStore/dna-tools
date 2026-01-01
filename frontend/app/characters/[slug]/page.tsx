// 임시 더미 데이터
const CHARACTER_DETAIL = {
  name: "베레니카",
  element: "불",
  elementIcon: "/images/element_icon/umbro.png",
  image: "/images/characters/berenica_v1.png",

  meleeProficiency: "대검",
  rangedProficiency: "권총",

  features: ["딜러", "무기 대미지", "동조 무기"],

  baseStats: {
    공격: 251,
    HP: 1255,
    방어: 300,
    "최대 정신력": 150,
    격양: 0,
    필사: 0,
  },

  consonance_weapon_stats: {
    타입: "검",
    공격타입: "베기",
    공격: 361.5,
    "크리티컬 확률": 12,
    "크리티컬 대미지": 150,
    공격속도: 1,
    발동확률: 50,
  },

  skills: [
    {
      name: "파멸의 일격",
      type: "대미지",
      description: "전방의 적에게 강력한 화염 피해를 가한다.",
    },
    {
      name: "불꽃의 의지",
      type: "버프",
      description: "일정 시간 동안 자신의 공격력을 증가시킨다.",
    },
    {
      name: "회전",
      type: "패시브",
      description: "[잔광]으로 대미지를 입히거나, 한손검으로 대미지를 입힐 시 정신력을 회복한다.",
    },
  ],

  passiveUpgrade: {
    공격: 20,
    스킬효율: 5,
    잔향: "달 사냥이 추가 효과를 갖는다.",
  },

  intron: {
    "1단계": "공격력 상승",
    "2단계": "방어력 상승",
    "3단계": "공격속도 상승",
  },
};

import Image from "next/image";

import Feature from "@/components/Feature";
import ContentSection from "@/components/ui/ContentSection";
import InfoCard from "@/components/ui/InfoCard";
import SkillCard from "@/components/ui/SkilCard";
import StatCard from "@/components/ui/StatCard";

export default function CharacterDetailPage({ params }: { params: { slug: string } }) {
  const character = CHARACTER_DETAIL;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-16">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-2xl bg-[#060a18]">
        {/* Element Glow (불 예시) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(255,80,80,0.25),transparent_60%)]" />

        {/* Image */}
        <div className="absolute inset-0">
          <Image src={character.image} alt={character.name} fill className="object-contain object-bottom" priority />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a18]/95 via-[#060a18]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[760px] items-end px-10 pb-12">
          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-bold">{character.name}</h1>

            <div className="text-sm text-white/70">
              {character.meleeProficiency} · {character.rangedProficiency}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {character.features.map((feature) => (
                <Feature key={feature} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Base Stats */}
      <ContentSection title="기본 스탯">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(CHARACTER_DETAIL.baseStats).map(([label, value]) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>
      </ContentSection>

      {/* Consonance Weapon */}
      <ContentSection title="동조 무기">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(CHARACTER_DETAIL.consonance_weapon_stats).map(([label, value]) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>
      </ContentSection>
      {/* Skills */}
      <ContentSection title="스킬">
        <div className="space-y-4">
          {CHARACTER_DETAIL.skills.map((skill) => (
            <SkillCard key={skill.name} {...skill} />
          ))}
        </div>
      </ContentSection>

      {/* Passive Upgrade */}
      <ContentSection title="패시브 강화">
        <div className="space-y-2">
          {Object.entries(CHARACTER_DETAIL.passiveUpgrade).map(([label, value]) => (
            <InfoCard key={label} title={label} description={value} />
          ))}
        </div>
      </ContentSection>

      {/* Intron */}
      <ContentSection title="근원">
        <div className="space-y-2">
          {Object.entries(CHARACTER_DETAIL.intron).map(([stage, effect]) => (
            <InfoCard key={stage} title={stage} description={effect} />
          ))}
        </div>
      </ContentSection>
    </div>
  );
}
