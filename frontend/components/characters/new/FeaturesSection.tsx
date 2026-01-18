export default function FeaturesSection({ form, setForm }: any) {
  const add = () => setForm((p: any) => ({ ...p, features: [...p.features, ""] }));

  const update = (i: number, value: string) => {
    const next = [...form.features];
    next[i] = value;
    setForm((p: any) => ({ ...p, features: next }));
  };

  const remove = (i: number) => {
    setForm((p: any) => ({
      ...p,
      features: p.features.filter((_: any, idx: number) => idx !== i),
    }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold">특징</h2>

      {form.features.map((f: string, i: number) => (
        <div key={i}>
          <input value={f} onChange={(e) => update(i, e.target.value)} />
          <button type="button" onClick={() => remove(i)}>
            삭제
          </button>
        </div>
      ))}

      <button type="button" onClick={add}>
        + 추가
      </button>
    </section>
  );
}
