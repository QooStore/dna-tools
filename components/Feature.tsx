type FeatureProps = {
  feature: string;
};

export default function Feature({ feature }: FeatureProps) {
  return (
    <span key={feature} className="rounded-full bg-white/10 px-3 py-1 text-xs">
      {feature}
    </span>
  );
}
