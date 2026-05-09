import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { AlertCircle, CheckCircle, Clock, Wrench } from "lucide-react";

export default async function WardenDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [openComplaints, inProgressComplaints, resolvedComplaints, recentComplaints] = await Promise.all([
    prisma.complaint.count({ where: { status: "OPEN" } }),
    prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
    prisma.complaint.count({ where: { status: "RESOLVED" } }),
    prisma.complaint.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { student: { include: { user: { select: { name: true } } } } },
    }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Warden Dashboard</h1>
        <p className="text-muted-foreground mt-1">Monitor and resolve hostel issues</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Open Issues" value={openComplaints} icon={<AlertCircle className="w-5 h-5 text-red-400" />} delay={0} />
        <StatCard title="In Progress" value={inProgressComplaints} icon={<Clock className="w-5 h-5 text-yellow-400" />} delay={0.1} />
        <StatCard title="Resolved" value={resolvedComplaints} icon={<CheckCircle className="w-5 h-5 text-green-400" />} delay={0.2} />
      </div>

      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Recent Complaints</h2>
        <div className="space-y-3">
          {recentComplaints.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No complaints to display</p>
          ) : (
            recentComplaints.map((c: any) => (
              <div key={c.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><p className="font-medium text-sm truncate">{c.title}</p><Badge variant={getStatusVariant(c.priority)}>{c.priority}</Badge></div>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.student.user.name} · {formatDate(c.createdAt)}</p>
                </div>
                <Badge variant={getStatusVariant(c.status)}>{c.status.replace("_", " ")}</Badge>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
