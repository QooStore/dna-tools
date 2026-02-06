export async function adminLogin(userId: string, password: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lee/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, password }),
  });

  if (!res.ok) {
    throw new Error("LOGIN_FAILED");
  }

  return { result: "success" };
}
