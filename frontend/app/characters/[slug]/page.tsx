import Image from "next/image";

import Feature from "@/components/Feature";
import ContentSection from "@/components/ui/ContentSection";
import InfoCard from "@/components/ui/InfoCard";
import SkillCard from "@/components/ui/SkillCard";
import StatCard from "@/components/ui/StatCard";

import { getCharacterDetail } from "@/lib/api/characters";

export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const param = await params;
  const character = await getCharacterDetail(param.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-16">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-2xl bg-[#060a18]">
        {/* Element Glow */}
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
          {Object.entries(character.baseStats).map(([label, value]) => (
            <StatCard key={label} label={label} value={value} />
          ))}
        </div>
      </ContentSection>
      {/* Consonance Weapon */}
      {character.consonanceWeapon && (
        <ContentSection title="동조 무기">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(character.consonanceWeapon).map(([label, value]) => (
              <StatCard key={label} label={label} value={value} />
            ))}
          </div>
        </ContentSection>
      )}
      {/* Skills */}
      <ContentSection title="스킬">
        <div className="space-y-4">
          {character.skills.map((skill) => (
            <SkillCard key={skill.name} {...skill} />
          ))}
        </div>
      </ContentSection>
      {/* Passive Upgrade */}
      <ContentSection title="패시브 강화">
        <div className="space-y-2">
          {character.passiveUpgrade.effects.map((passiveEffect) => (
            <InfoCard key={passiveEffect.name} title={passiveEffect.name} description={passiveEffect.description} />
          ))}
        </div>
      </ContentSection>
      {/* Intron */}
      <ContentSection title="근원">
        <div className="space-y-2">
          {character.intron.map((intron) => (
            <InfoCard key={intron.stage} title={`제${intron.stage}근원`} description={intron.description} />
          ))}
        </div>
      </ContentSection>
    </div>
  );
}
