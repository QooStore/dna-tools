import LoginForm from "@/components/signin/LoginForm";

import { getAdminMe } from "@/lib/api/admin";
import { redirect } from "next/navigation";

export default async function AdminLoginPage() {
  const isAdmin = await getAdminMe();

  if (isAdmin) {
    redirect("/");
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
