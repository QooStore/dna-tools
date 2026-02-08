import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import { WeaponFormState } from "@/domains/weaponForm";
import { numberValue } from "@/lib/utils";

type Props = {
  form: WeaponFormState;
  setForm: React.Dispatch<React.SetStateAction<WeaponFormState>>;
};

export default function SkillSection({ form, setForm }: Props) {
  const update = (key: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">스킬</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <LabelComponent>패시브 스탯</LabelComponent>
          <InputComponent
            value={form.passiveStat}
            placeholder="패시브 스탯명"
            onChange={(v) => update("passiveStat", v)}
          />
        </div>

        <div className="space-y-1">
          <LabelComponent>패시브 수치</LabelComponent>
          <InputComponent
            type="number"
            value={numberValue(form.passiveValue)}
            placeholder="패시브 수치"
            onChange={(v) => update("passiveValue", Number(v))}
          />
        </div>
      </div>

      <div className="space-y-1">
        <LabelComponent>액티브 스킬 설명</LabelComponent>
        <textarea
          value={form.activeSkillDescription}
          placeholder="액티브 스킬 설명"
          onChange={(e) => update("activeSkillDescription", e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
        />
      </div>
    </section>
  );
}
