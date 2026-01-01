type StatCardProps = {
  label: string;
  value: string | number;
};

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-lg bg-white/5 p-3 flex justify-between items-center">
      <span className="text-sm text-white/70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
