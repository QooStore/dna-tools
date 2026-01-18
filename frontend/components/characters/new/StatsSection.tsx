const STAT_KEYS = ["attack", "hp", "defense", "maxMentality", "resolve", "morale"];

export default function StatsSection({ form, setForm }: any) {
  const update = (key: string, value: number) => {
    setForm((prev: any) => ({
      ...prev,
      stats: { ...prev.stats, [key]: value },
    }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold mb-3">스탯</h2>

      {STAT_KEYS.map((key) => (
        <input
          key={key}
          type="number"
          value={form.stats[key]}
          onChange={(e) => update(key, Number(e.target.value))}
          placeholder={key}
        />
      ))}
    </section>
  );
}
