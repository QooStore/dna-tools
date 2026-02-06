import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import SelectComponent from "@/components/ui/FormSelect";
import { numberValue } from "@/lib/utils";
import type { Field } from "@/domains/characters/fields";

type Props<T extends object> = {
  title: string;
  fields: readonly Field[];
  value: T | undefined;
  onChange: (key: string, value: string | number) => void;
  columns?: 1 | 2 | 3;
};

export default function FormSectionRenderer<T extends object>({
  title,
  fields,
  value,
  onChange,
  columns = 2,
}: Props<T>) {
  const gridCols =
    columns === 1 ? "grid-cols-1" : columns === 3 ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2";

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">{title}</h2>

      <div className={`grid ${gridCols} gap-4`}>
        {fields.map((f) => (
          <div key={f.key} className="space-y-1">
            <LabelComponent>{f.label}</LabelComponent>

            {f.kind === "select" ? (
              <SelectComponent
                value={(value?.[f.key as keyof T] as string) ?? ""}
                options={f.options}
                placeholder={f.placeholder}
                onChange={(v) => onChange(f.key, v)}
              />
            ) : f.kind === "number" ? (
              <InputComponent
                type="number"
                value={numberValue(value?.[f.key as keyof T] as number)}
                placeholder={f.placeholder ?? f.label}
                onChange={(v) => onChange(f.key, Number(v))}
              />
            ) : (
              <InputComponent
                value={(value?.[f.key as keyof T] as string) ?? ""}
                placeholder={f.placeholder ?? f.label}
                onChange={(v) => onChange(f.key, v)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
