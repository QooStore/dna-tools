type SkillCardProps = {
  name: string;
  type: string;
  description: string;
};

export default function SkillCard({ name, type, description }: SkillCardProps) {
  return (
    <div className="rounded-xl bg-white/5 p-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{name}</h3>
        <span className="text-xs text-white/60">{type}</span>
      </div>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  );
}
