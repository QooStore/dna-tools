export default function IntronsSection({ form, setForm }: any) {
  const add = () =>
    setForm((p: any) => ({
      ...p,
      introns: [...p.introns, { stage: 1, description: "" }],
    }));

  const update = (i: number, key: string, value: any) => {
    const next = [...form.introns];
    next[i] = { ...next[i], [key]: value };
    setForm((p: any) => ({ ...p, introns: next }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold">인트론</h2>

      {form.introns.map((it: any, i: number) => (
        <div key={i}>
          <input type="number" value={it.stage} onChange={(e) => update(i, "stage", Number(e.target.value))} />
          <textarea value={it.description} onChange={(e) => update(i, "description", e.target.value)} />
        </div>
      ))}

      <button type="button" onClick={add}>
        + 추가
      </button>
    </section>
  );
}
