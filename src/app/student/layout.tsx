import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "STUDENT") redirect("/unauthorized");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role="STUDENT"
        userName={session.user?.name ?? undefined}
        userEmail={session.user?.email ?? undefined}
      />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
