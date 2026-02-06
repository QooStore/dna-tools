type FeatureProps = {
  feature: {
    featureCode: string;
    featureName: string;
  };
};

export default function Feature({ feature }: FeatureProps) {
  return (
    <span key={feature.featureCode} className="rounded-full bg-white/10 px-3 py-1 text-xs">
      {feature.featureName}
    </span>
  );
}
