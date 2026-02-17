import Image from "next/image";

import Feature from "../_components/Feature";
import ContentSection from "@/components/ui/ContentSection";
import InfoCard from "@/components/ui/InfoCard";
import SkillCard from "@/components/ui/SkillCard";
import StatCard from "@/components/ui/StatCard";

import { getCharacterDetail } from "@/api/characters";
import { formatWeaponStat } from "@/lib/utils";
import { CharacterDetail } from "@/domains/characters/types";
import { ELEMENT_GLOW_STYLES } from "@/config/elementStyles";
import { ConsonanceWeaponStats } from "@/domains/weapons/type";
import { CHARACTER_DETAILS_CONSONANCE_WEAPON } from "@/config/fields";
import { LABELS } from "@/config/labels";

export default async function CharacterDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const param = await params;
  const character: CharacterDetail = await getCharacterDetail(param.slug);
  const elementStyle = ELEMENT_GLOW_STYLES[character.elementCode as keyof typeof ELEMENT_GLOW_STYLES];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-16">
      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden rounded-2xl bg-[#060a18]">
        {/* Element Glow */}
        <div
          className={`absolute inset-0`}
          style={{ backgroundImage: `radial-gradient(circle at 70% 40%, ${elementStyle.glowColor}, transparent 60%)` }}
        />

        {/* Image */}
        <div className="absolute inset-0">
          <Image
            src={character.image}
            alt={character.name}
            fill
            className="object-contain object-bottom"
            priority
            unoptimized
          />
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a18]/95 via-[#060a18]/40 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex min-h-[760px] items-end px-10 pb-12">
          <div className="max-w-xl space-y-4">
            <h1 className="text-5xl font-bold">{character.name}</h1>

            {character.meleeProficiencyLabel && character.rangedProficiencyLabel && (
              <div className="text-sm text-white/70">
                {character.meleeProficiencyLabel} · {character.rangedProficiencyLabel}
              </div>
            )}

            {!(character.meleeProficiencyLabel && character.rangedProficiencyLabel) && (
              <div className="text-sm text-white/70">모든 유형</div>
            )}

            <div className="flex flex-wrap gap-2 pt-2">
              {character.features.map((feature) => (
                <Feature key={feature.featureCode} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Base Stats */}
      <ContentSection title="기본 스탯">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(character.stats).map(([key, value]) => (
            <StatCard key={key} label={LABELS.stat[key]} value={value} />
          ))}
        </div>
      </ContentSection>
      {/* Consonance Weapon */}
      {character.consonanceWeapon && (
        <ContentSection title="동조 무기">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CHARACTER_DETAILS_CONSONANCE_WEAPON.map(({ key, label }) => {
              const value = character.consonanceWeapon?.[key as keyof ConsonanceWeaponStats];
              if (value == null) return null;

              return <StatCard key={key} label={label} value={formatWeaponStat(key, value)} />;
            })}
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
          {character.passiveUpgrades.map((passiveEffect) => (
            <InfoCard
              key={passiveEffect.upgradeKey}
              title={passiveEffect.name}
              description={passiveEffect.description}
            />
          ))}
        </div>
      </ContentSection>
      {/* Intron */}
      <ContentSection title="근원">
        <div className="space-y-2">
          {character.introns.map((intron) => (
            <InfoCard key={intron.stage} title={`제${intron.stage}근원`} description={intron.description} />
          ))}
        </div>
      </ContentSection>
    </div>
  );
}
