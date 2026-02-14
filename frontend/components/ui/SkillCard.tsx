type SkillCardProps = {
  name: string;
  typeName: string;
  description: string;
};

export default function SkillCard({ name, typeName, description }: SkillCardProps) {
  return (
    <div className="rounded-xl bg-white/5 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-xs text-white/60">{typeName}</span>
      </div>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  );
}
