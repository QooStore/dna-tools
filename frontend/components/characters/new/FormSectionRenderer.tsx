import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import SelectComponent from "@/components/ui/FormSelect";
import { numberValue } from "@/lib/utils";

type Option = { value: string; label: string };

export type Field =
  | {
      key: string;
      label: string;
      kind: "text";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      kind: "number";
      placeholder?: string;
    }
  | {
      key: string;
      label: string;
      kind: "select";
      options: readonly Option[];
      placeholder?: string;
    };

type Props = {
  title: string;
  fields: readonly Field[];
  value: any;
  onChange: (key: string, value: any) => void;
  columns?: 1 | 2 | 3;
};

export default function FormSectionRenderer({ title, fields, value, onChange, columns = 2 }: Props) {
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
                value={value?.[f.key] ?? ""}
                options={f.options}
                placeholder={f.placeholder}
                onChange={(v) => onChange(f.key, v)}
              />
            ) : f.kind === "number" ? (
              <InputComponent
                type="number"
                value={numberValue(value?.[f.key])}
                placeholder={f.placeholder ?? f.label}
                onChange={(v) => onChange(f.key, Number(v))}
              />
            ) : (
              <InputComponent
                value={value?.[f.key] ?? ""}
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
