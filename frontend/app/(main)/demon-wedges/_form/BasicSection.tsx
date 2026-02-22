import FormImageUpload from "@/components/ui/FormImageUpload";
import FormInput from "@/components/ui/FormInput";
import FormLabel from "@/components/ui/FormLabel";
import FormSelect from "@/components/ui/FormSelect";
import { EQUIP_TYPE_OPTIONS } from "@/config/options";
import { useCodeOptions } from "@/hooks/useCodeOptions";
import { DemonWedgeFormState } from "@/domains/demonWedgeForm";
import { numberValue } from "@/lib/utils";

type Props = {
  form: DemonWedgeFormState;
  setForm: React.Dispatch<React.SetStateAction<DemonWedgeFormState>>;
};

export default function BasicSection({ form, setForm }: Props) {
  const rarityOptions = useCodeOptions("RARITY");
  const tendencyOptions = useCodeOptions("TENDENCY");
  const elementOptions = useCodeOptions("ELEMENT");

  const update = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">기본 정보</h2>

      <div className="space-y-1">
        <FormLabel>Slug (고유 ID)</FormLabel>
        <FormInput value={form.slug} onChange={(v) => update("slug", v)} />
        <p className="text-[11px] text-white/35">URL 및 내부 식별자로 사용됩니다.</p>
      </div>

      <div className="space-y-1">
        <FormLabel>이름</FormLabel>
        <FormInput value={form.name} onChange={(v) => update("name", v)} />
      </div>

      <FormImageUpload
        label="이미지"
        value={form.image}
        onChange={(url) => update("image", url)}
        previewSize="lg"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <FormLabel>희귀도</FormLabel>
          <FormSelect
            value={String(form.rarity)}
            onChange={(v) => update("rarity", Number(v))}
            options={rarityOptions}
            placeholder="희귀도 선택"
          />
        </div>

        <div className="space-y-1">
          <FormLabel>내성 코스트</FormLabel>
          <FormInput
            type="number"
            value={numberValue(form.resistance)}
            onChange={(v) => update("resistance", Number(v))}
            placeholder="내성 코스트"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <FormLabel>성향</FormLabel>
          <FormSelect
            value={form.tendency}
            onChange={(v) => update("tendency", v)}
            options={tendencyOptions}
            placeholder="성향 선택"
          />
        </div>

        <div className="space-y-1">
          <FormLabel>착용 제한</FormLabel>
          <FormSelect
            value={form.equipType}
            onChange={(v) => update("equipType", v)}
            options={EQUIP_TYPE_OPTIONS}
            placeholder="착용 위치 선택"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <FormLabel>속성 제한</FormLabel>
          <FormSelect
            value={form.element}
            onChange={(v) => update("element", v)}
            options={elementOptions}
            placeholder="무속성"
          />
        </div>

        <div className="flex items-end pb-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isKukulkan}
              onChange={(e) => update("isKukulkan", e.target.checked)}
              className="h-4 w-4 rounded border-white/20 bg-white/5 text-cyan-400 focus:ring-cyan-400/50"
            />
            <span className="text-sm text-white/70">쿠쿨칸 전용</span>
          </label>
        </div>
      </div>
    </section>
  );
}
