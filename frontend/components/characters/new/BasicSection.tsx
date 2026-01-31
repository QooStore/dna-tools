import FormImageUpload from "@/components/ui/FormImageUpload";
import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import FormSelect from "@/components/ui/FormSelect";
import { ELEMENT_OPTIONS, MELEE_PROFICIENCY_OPTIONS, RANGED_PROFICIENCY_OPTIONS } from "@/config/navigation";
import { CharacterFormState } from "@/domains/characterForm";

type Props = {
  form: CharacterFormState;
  setForm: React.Dispatch<React.SetStateAction<CharacterFormState>>;
};

export default function BasicSection({ form, setForm }: Props) {
  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">기본 정보</h2>

      {/* slug */}
      <div className="space-y-1">
        <LabelComponent>Slug (고유 ID)</LabelComponent>
        <InputComponent value={form.slug} onChange={(value) => update("slug", value)} />
        <p className="text-[11px] text-white/35">URL 및 내부 식별자로 사용됩니다.</p>
      </div>

      {/* name */}
      <div className="space-y-1">
        <LabelComponent>캐릭터 이름</LabelComponent>
        <InputComponent value={form.name} onChange={(value) => update("name", value)} />
      </div>

      {/* element */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <div className="space-y-1">
          <LabelComponent>속성</LabelComponent>
          <FormSelect
            value={form.elementCode}
            onChange={(value) => {
              update("elementCode", value);
              update("elementImage", `/images/element_icon/${value}.png`);
            }}
            options={ELEMENT_OPTIONS}
          />
        </div>
      </div>

      {/* image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
        <FormImageUpload
          label="캐릭터 이미지"
          value={form.image}
          onChange={(url) => update("image", url)}
          previewSize="lg"
        />
        <FormImageUpload label="목록 이미지" value={form.listImage} onChange={(url) => update("listImage", url)} />
      </div>

      {/* proficiency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <LabelComponent>근접 무기 숙련 타입</LabelComponent>
          <FormSelect
            value={form.meleeProficiency}
            onChange={(value) => update("meleeProficiency", value)}
            options={MELEE_PROFICIENCY_OPTIONS}
          />
        </div>
        <div className="space-y-1">
          <LabelComponent>원거리 무기 숙련 타입</LabelComponent>
          <FormSelect
            value={form.rangedProficiency}
            onChange={(value) => update("rangedProficiency", value)}
            options={RANGED_PROFICIENCY_OPTIONS}
          />
        </div>
      </div>
    </section>
  );
}
