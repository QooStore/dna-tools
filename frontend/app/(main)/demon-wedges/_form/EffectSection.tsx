import FormLabel from "@/components/ui/FormLabel";
import { DemonWedgeFormState } from "@/domains/demonWedgeForm";

type Props = {
  form: DemonWedgeFormState;
  setForm: React.Dispatch<React.SetStateAction<DemonWedgeFormState>>;
};

export default function EffectSection({ form, setForm }: Props) {
  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">효과 설명</h2>

      <div className="space-y-1">
        <FormLabel>효과 설명 (Sub Effect)</FormLabel>
        <textarea
          value={form.effectDescription}
          placeholder="효과 설명을 입력하세요"
          onChange={(e) => setForm((prev) => ({ ...prev, effectDescription: e.target.value }))}
          rows={4}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-cyan-400/50"
        />
      </div>
    </section>
  );
}
