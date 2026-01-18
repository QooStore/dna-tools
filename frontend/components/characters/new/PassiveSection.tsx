export default function PassiveSection({ form, setForm }: any) {
  const add = () =>
    setForm((p: any) => ({
      ...p,
      passiveUpgrades: [
        ...p.passiveUpgrades,
        {
          upgradeKey: "",
          upgradeType: "STAT",
          targetStat: "",
          value: 0,
          name: "",
          description: "",
        },
      ],
    }));

  const update = (i: number, key: string, value: any) => {
    const next = [...form.passiveUpgrades];
    next[i] = { ...next[i], [key]: value };
    setForm((p: any) => ({ ...p, passiveUpgrades: next }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold">패시브 업그레이드</h2>

      {form.passiveUpgrades.map((p: any, i: number) => (
        <div key={i}>
          <input placeholder="key" value={p.upgradeKey} onChange={(e) => update(i, "upgradeKey", e.target.value)} />
          <input placeholder="name" value={p.name} onChange={(e) => update(i, "name", e.target.value)} />
          <input placeholder="type" value={p.upgradeType} onChange={(e) => update(i, "upgradeType", e.target.value)} />
          <input placeholder="stat" value={p.targetStat} onChange={(e) => update(i, "targetStat", e.target.value)} />
          <input type="number" value={p.value} onChange={(e) => update(i, "value", Number(e.target.value))} />
          <textarea value={p.description} onChange={(e) => update(i, "description", e.target.value)} />
        </div>
      ))}

      <button type="button" onClick={add}>
        + 추가
      </button>
    </section>
  );
}
