type InfoCardProps = {
  title: string;
  description: string | number;
};

export default function InfoCard({ title, description }: InfoCardProps) {
  return (
    <div className="rounded-lg bg-white/5 p-3">
      <span className="font-semibold">{title}</span>
      <p className="mt-1 text-sm text-white/80">{description}</p>
    </div>
  );
}
