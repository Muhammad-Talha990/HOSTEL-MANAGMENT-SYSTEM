import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function WardenLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "WARDEN" && role !== "ADMIN") redirect("/unauthorized");

  return (
    <div className="flex min-h-screen">
      <Sidebar
        role="WARDEN"
        userName={session.user?.name ?? undefined}
        userEmail={session.user?.email ?? undefined}
      />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
