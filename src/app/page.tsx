import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as { role?: string })?.role;
  if (role === "STUDENT") redirect("/student/dashboard");
  if (role === "INSTRUCTOR") redirect("/instructor/dashboard");
  if (role === "ADMIN") redirect("/admin/dashboard");

  redirect("/login");
}
