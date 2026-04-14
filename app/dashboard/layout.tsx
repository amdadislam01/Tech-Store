import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Ensure role is a string if it's missing or an object
  const user = {
    ...session.user,
    role: (session.user.role as string) || "user"
  };

  return (
    <DashboardShell user={user}>
      {children}
    </DashboardShell>
  );
}
