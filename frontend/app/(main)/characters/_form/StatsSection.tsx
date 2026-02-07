import type React from "react";

import FormSectionRenderer from "./FormSectionRenderer";
import { CharacterFormState } from "@/domains/characterForm";
import { STATS_FIELDS } from "@/config/fields";

type Props = {
  form: CharacterFormState;
  setForm: React.Dispatch<React.SetStateAction<CharacterFormState>>;
};

export default function StatsSection({ form, setForm }: Props) {
  return (
    <FormSectionRenderer
      title="스탯"
      fields={STATS_FIELDS}
      value={form?.stats}
      onChange={(key, value) =>
        setForm((prev) => ({
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
