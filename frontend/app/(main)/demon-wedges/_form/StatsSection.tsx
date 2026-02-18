import FormInput from "@/components/ui/FormInput";
import SelectComponent from "@/components/ui/FormSelect";
import FormLabel from "@/components/ui/FormLabel";
import { DemonWedgeFormState, DemonWedgeStatForm } from "@/domains/demonWedgeForm";
import { TARGET_STAT_OPTIONS } from "@/config/options";
import { numberValue } from "@/lib/utils";

type Props = {
  form: DemonWedgeFormState;
  setForm: React.Dispatch<React.SetStateAction<DemonWedgeFormState>>;
};

export default function StatsSection({ form, setForm }: Props) {
  const updateStat = (index: number, key: keyof DemonWedgeStatForm, value: string | number) => {
    setForm((prev) => {
      const next = [...prev.stats];
      next[index] = { ...next[index], [key]: value };
      return { ...prev, stats: next };
    });
  };

  const addStat = () => {
    setForm((prev) => ({
      ...prev,
      stats: [...prev.stats, { statType: "", value: 0 }],
    }));
  };

  const removeStat = (index: number) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index),
    }));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">스탯 (Main Effect)</h2>
        <button type="button" onClick={addStat} className="text-sm text-cyan-300 hover:text-cyan-200 transition">
          + 스탯 추가
        </button>
      </div>

      {form.stats.length === 0 && <p className="text-sm text-white/30">스탯이 없습니다. 위 버튼으로 추가하세요.</p>}

      {form.stats.map((stat, i) => (
        <div key={i} className="flex items-end gap-3">
          <div className="flex-1 space-y-1">
            <FormLabel>스탯 종류</FormLabel>
            <SelectComponent
              value={stat.statType}
              options={TARGET_STAT_OPTIONS}
              onChange={(v) => updateStat(i, "statType", v)}
            />
          </div>

          <div className="w-32 space-y-1">
            <FormLabel>수치</FormLabel>
            <FormInput
              type="number"
              value={numberValue(stat.value)}
              onChange={(v) => updateStat(i, "value", Number(v))}
              placeholder="0"
            />
          </div>

          <button
            type="button"
            onClick={() => removeStat(i)}
            className="mb-0.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 transition"
          >
            삭제
          </button>
        </div>
      ))}
    </section>
  );
}
