import { FEATURE_OPTIONS } from "@/config/navigation";
import type React from "react";

type FeatureItem = {
  featureCode: string;
};

type Props = {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function FeaturesSection({ form, setForm }: Props) {
  const features: FeatureItem[] = form?.features ?? [];

  const toggleFeature = (code: string) => {
    setForm((prev: any) => {
      const exists = prev.features?.some((f: FeatureItem) => f.featureCode === code);

      return {
        ...prev,
        features: exists
          ? prev.features.filter((f: FeatureItem) => f.featureCode !== code)
          : [...(prev.features ?? []), { featureCode: code }],
      };
    });
  };

  const isChecked = (code: string) => features.some((f) => f.featureCode === code);

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
      <h2 className="text-lg font-semibold">특징</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {FEATURE_OPTIONS.map(({ value, label }) => {
          const checked = isChecked(value);

          return (
            <label
              key={value}
              className={`
            cursor-pointer select-none rounded-lg border px-3 py-2 text-sm
            transition-all
            ${
              checked
                ? "border-indigo-400 bg-indigo-500/10 text-indigo-300 shadow-[0_0_0_1px_rgba(99,102,241,0.4)]"
                : "border-white/10 hover:border-white/20 text-white/80"
            }
          `}
            >
              <input type="checkbox" checked={checked} onChange={() => toggleFeature(value)} className="hidden" />
              {label}
            </label>
          );
        })}
      </div>
    </section>
  );
}
