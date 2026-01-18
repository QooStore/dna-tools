export default function BasicSection({ form, setForm }: any) {
  const update = (key: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="border p-4 rounded">
      <h2 className="font-bold mb-3">기본 정보</h2>

      <input placeholder="slug" value={form.slug} onChange={(e) => update("slug", e.target.value)} />

      <input placeholder="이름" value={form.name} onChange={(e) => update("name", e.target.value)} />

      <input placeholder="속성 코드" value={form.element} onChange={(e) => update("element", e.target.value)} />

      <input placeholder="이미지 URL" value={form.image} onChange={(e) => update("image", e.target.value)} />

      <input
        placeholder="속성 아이콘"
        value={form.elementImage}
        onChange={(e) => update("elementImage", e.target.value)}
      />

      <input placeholder="리스트 이미지" value={form.listImage} onChange={(e) => update("listImage", e.target.value)} />

      <input
        placeholder="근접 숙련"
        value={form.meleeProficiency}
        onChange={(e) => update("meleeProficiency", e.target.value)}
      />

      <input
        placeholder="원거리 숙련"
        value={form.rangedProficiency}
        onChange={(e) => update("rangedProficiency", e.target.value)}
      />
    </section>
  );
}
