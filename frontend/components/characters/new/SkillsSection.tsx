export default function SkillsSection({ form, setForm }: any) {
  const add = () =>
    setForm((p: any) => ({
      ...p,
      skills: [...p.skills, { name: "", type: "", description: "" }],
    }));

  const update = (i: number, key: string, value: string) => {
    const next = [...form.skills];
    next[i] = { ...next[i], [key]: value };
    setForm((p: any) => ({ ...p, skills: next }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold">스킬</h2>

      {form.skills.map((s: any, i: number) => (
        <div key={i}>
          <input placeholder="이름" value={s.name} onChange={(e) => update(i, "name", e.target.value)} />
          <input placeholder="타입" value={s.type} onChange={(e) => update(i, "type", e.target.value)} />
          <textarea
            placeholder="설명"
            value={s.description}
            onChange={(e) => update(i, "description", e.target.value)}
          />
        </div>
      ))}

      <button type="button" onClick={add}>
        + 추가
      </button>
    </section>
  );
}
