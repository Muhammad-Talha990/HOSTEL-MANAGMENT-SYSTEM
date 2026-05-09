import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { Wrench } from "lucide-react";

export default async function MaintenancePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Maintenance</h1>
        <p className="text-muted-foreground mt-1">Track facility maintenance schedules</p>
      </div>

      <div className="text-center py-20 glass rounded-2xl space-y-4">
        <Wrench className="w-16 h-16 text-muted-foreground mx-auto" />
        <div>
          <p className="text-lg font-semibold">Maintenance Module</p>
          <p className="text-muted-foreground mt-1 max-w-md mx-auto">
            Facility maintenance tracking is linked to the complaints system.
            Resolved complaints with facility-related issues are automatically tracked here.
          </p>
        </div>
        <a href="/warden/complaints" className="inline-block mt-4 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          Go to Complaints →
        </a>
      </div>
    </div>
  );
}
