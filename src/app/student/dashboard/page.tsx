import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { BedDouble, CreditCard, AlertCircle, ClipboardList } from "lucide-react";

export default async function StudentDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      room: true,
      bookings: { orderBy: { createdAt: "desc" }, take: 3 },
      payments: { orderBy: { createdAt: "desc" }, take: 5 },
      complaints: { orderBy: { createdAt: "desc" }, take: 5 },
    },
  });

  const totalPaid = student?.payments
    .filter((p: any) => p.status === "SUCCESS")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0;

  const openComplaints = student?.complaints.filter((c: any) => c.status !== "RESOLVED").length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {session.user?.name}</h1>
        <p className="text-muted-foreground mt-1">Here&apos;s your hostel overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="My Room"
          value={student?.room ? `Room ${student.room.roomNumber}` : "Not Assigned"}
          icon={<BedDouble className="w-5 h-5 text-primary" />}
          delay={0}
        />
        <StatCard
          title="Total Paid"
          value={formatCurrency(totalPaid)}
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          delay={0.1}
        />
        <StatCard
          title="Active Bookings"
          value={student?.bookings.filter((b: any) => b.status === "CONFIRMED").length ?? 0}
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          delay={0.2}
        />
        <StatCard
          title="Open Complaints"
          value={openComplaints}
          icon={<AlertCircle className="w-5 h-5 text-primary" />}
          delay={0.3}
        />
      </div>

      {/* Room Info Card */}
      {student?.room && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold text-lg">Room Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground text-xs">Room Number</p><p className="font-semibold">{student.room.roomNumber}</p></div>
            <div><p className="text-muted-foreground text-xs">Type</p><p className="font-semibold">{student.room.type}</p></div>
            <div><p className="text-muted-foreground text-xs">Capacity</p><p className="font-semibold">{student.room.capacity}</p></div>
            <div><p className="text-muted-foreground text-xs">Monthly Rent</p><p className="font-semibold text-primary">{formatCurrency(Number(student.room.price))}</p></div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">Payment History</h2>
          <div className="space-y-2">
            {student?.payments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No payments yet</p>
            ) : (
              student?.payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{formatCurrency(Number(p.amount))}</p>
                    <p className="text-xs text-muted-foreground">{p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}</p>
                  </div>
                  <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Complaints */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <h2 className="font-semibold">My Complaints</h2>
          <div className="space-y-2">
            {student?.complaints.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No complaints filed</p>
            ) : (
              student?.complaints.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant={getStatusVariant(c.priority)}>{c.priority}</Badge>
                    <Badge variant={getStatusVariant(c.status)}>{c.status.replace("_", " ")}</Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
