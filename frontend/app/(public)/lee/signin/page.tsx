import LoginForm from "./_components/LoginForm";

import { getAdminMe } from "@/api/admin";
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
