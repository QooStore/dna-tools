import FormImageUpload from "@/components/ui/FormImageUpload";
import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import FormSelect from "@/components/ui/FormSelect";
import {
  WEAPON_CATEGORY_FIELD,
  WEAPON_MELEE_TYPE_FIELD,
  WEAPON_RANGED_TYPE_FIELD,
  WEAPON_ATTACK_TYPE_FIELD,
  WEAPON_ELEMENT_FIELD,
} from "@/config/fields";
import { WeaponFormState } from "@/domains/weaponForm";

type Props = {
  form: WeaponFormState;
  setForm: React.Dispatch<React.SetStateAction<WeaponFormState>>;
};

export default function BasicSection({ form, setForm }: Props) {
  const update = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const weaponTypeField = form.category === "ranged" ? WEAPON_RANGED_TYPE_FIELD : WEAPON_MELEE_TYPE_FIELD;

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
        <LabelComponent>무기 이름</LabelComponent>
        <InputComponent value={form.name} onChange={(value) => update("name", value)} />
      </div>

      {/* image */}
      <FormImageUpload
        label="무기 이미지"
        value={form.image}
        onChange={(url) => update("image", url)}
        previewSize="lg"
      />

      {/* 분류 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <LabelComponent>{WEAPON_CATEGORY_FIELD.label}</LabelComponent>
          <FormSelect
            value={form.category}
            onChange={(value) => {
              update("category", value);
              update("weaponType", "");
            }}
            options={WEAPON_CATEGORY_FIELD.kind === "select" ? WEAPON_CATEGORY_FIELD.options : []}
            placeholder={WEAPON_CATEGORY_FIELD.placeholder}
          />
        </div>

        {form.category && (
          <div className="space-y-1">
            <LabelComponent>{weaponTypeField.label}</LabelComponent>
            <FormSelect
              value={form.weaponType}
              onChange={(value) => update("weaponType", value)}
              options={weaponTypeField.kind === "select" ? weaponTypeField.options : []}
              placeholder={weaponTypeField.placeholder}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <LabelComponent>{WEAPON_ATTACK_TYPE_FIELD.label}</LabelComponent>
          <FormSelect
            value={form.attackType}
            onChange={(value) => update("attackType", value)}
            options={WEAPON_ATTACK_TYPE_FIELD.kind === "select" ? WEAPON_ATTACK_TYPE_FIELD.options : []}
            placeholder={WEAPON_ATTACK_TYPE_FIELD.placeholder}
          />
        </div>

        <div className="space-y-1">
          <LabelComponent>{WEAPON_ELEMENT_FIELD.label}</LabelComponent>
          <FormSelect
            value={form.element}
            onChange={(value) => update("element", value)}
            options={WEAPON_ELEMENT_FIELD.kind === "select" ? WEAPON_ELEMENT_FIELD.options : []}
            placeholder={WEAPON_ELEMENT_FIELD.placeholder}
          />
        </div>
      </div>
    </section>
  );
}
