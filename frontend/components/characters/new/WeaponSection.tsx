export default function WeaponSection({ form, setForm }: any) {
  const w = form.consonanceWeapon;

  const update = (key: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      consonanceWeapon: { ...prev.consonanceWeapon, [key]: value },
    }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold mb-3">공명 무기</h2>

      {[
        "category",
        "weaponType",
        "attackType",
        "attack",
        "critRate",
        "critDamage",
        "attackSpeed",
        "triggerProbability",
      ].map((key) => (
        <input
          key={key}
          value={w[key]}
          onChange={(e) =>
            update(
              key,
              ["attack", "critRate", "critDamage", "attackSpeed", "triggerProbability"].includes(key)
                ? Number(e.target.value)
                : e.target.value,
            )
          }
          placeholder={key}
        />
      ))}
    </section>
  );
}
