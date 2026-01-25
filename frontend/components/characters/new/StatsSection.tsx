import FormSectionRenderer from "@/components/characters/new/FormSectionRenderer";
import { STATS_FIELDS } from "@/domains/fields/statsFields";
import type React from "react";

type Props = {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function StatsSection({ form, setForm }: Props) {
  return (
    <FormSectionRenderer
      title="스탯"
      fields={STATS_FIELDS}
      value={form?.stats}
      onChange={(key, value) =>
        setForm((prev: any) => ({
          ...prev,
          stats: {
            ...prev.stats,
            [key]: value,
          },
        }))
      }
    />
  );
}
