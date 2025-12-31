// 임시 더미 데이터
const CHARACTER_DETAIL = {
  name: "베레니카",
  element: "불",
  elementIcon: "/images/element_icon/umbro.png",
  image: "/images/characters/berenica_v1.png",

  meleeProficiency: "대검",
  rangedProficiency: "권총",

  features: ["딜러", "무기 대미지"],

  baseStats: {
    atk: 1200,
    hp: 18000,
    def: 650,
    critRate: "15%",
    critDamage: "150%",
  },

  passiveEffects: ["공격력 +10%", "치명타 확률 +5%"],

  skills: [
    {
      name: "파멸의 일격",
      description: "전방의 적에게 강력한 화염 피해를 가한다.",
    },
    {
      name: "불꽃의 의지",
      description: "일정 시간 동안 자신의 공격력을 증가시킨다.",
    },
  ],
};

import Image from "next/image";

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
              {character.features.map((f) => (
                <span key={f} className="rounded-full bg-white/10 px-3 py-1 text-xs">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= BASE STATS ================= */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">기본 스탯 (MAX)</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Object.entries(character.baseStats).map(([key, value]) => (
            <div key={key} className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
              <div className="text-xs text-white/50 uppercase">{key}</div>
              <div className="mt-1 font-semibold">{value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PASSIVE ================= */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">패시브 효과</h2>
        <ul className="space-y-2">
          {character.passiveEffects.map((effect) => (
            <li key={effect} className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              {effect}
            </li>
          ))}
        </ul>
      </section>

      {/* ================= SKILLS ================= */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">스킬</h2>

        <div className="space-y-4">
          {character.skills.map((skill) => (
            <div key={skill.name} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="font-semibold">{skill.name}</div>
              <div className="mt-1 text-sm text-white/70">{skill.description}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
