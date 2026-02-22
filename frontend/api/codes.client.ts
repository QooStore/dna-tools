export type CodeOption = { value: string; label: string };

export async function fetchCodeOptions(codeType: string): Promise<CodeOption[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/codes/${codeType}`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}
