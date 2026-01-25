import InputComponent from "@/components/ui/FormInput";
import LabelComponent from "@/components/ui/FormLabel";
import type React from "react";

const STAGES = [1, 2, 3, 4, 5, 6];

type IntronItem = {
  stage: number;
  description: string;
};

type Props = {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function IntronSection({ form, setForm }: Props) {
  const introns: IntronItem[] = form?.introns ?? [];

  const getDescription = (stage: number) => introns.find((i) => i.stage === stage)?.description ?? "";

  const updateIntron = (stage: number, description: string) => {
    setForm((prev: any) => {
      const exists = prev.introns?.some((i: IntronItem) => i.stage === stage);

      return {
        ...prev,
        introns: exists
          ? prev.introns.map((i: IntronItem) => (i.stage === stage ? { ...i, description } : i))
          : [...(prev.introns ?? []), { stage, description }],
      };
    });
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
      <h2 className="text-lg font-semibold">근원</h2>

      <div className="space-y-4">
        {STAGES.map((stage) => (
          <div key={stage} className="rounded-lg border border-white/10 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">근원 {stage}단계</span>
            </div>

            <div className="space-y-1">
              <LabelComponent>효과 설명</LabelComponent>
              <InputComponent
                value={getDescription(stage)}
                placeholder={`근원 ${stage}단계 효과 설명`}
                onChange={(v) => updateIntron(stage, v)}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
