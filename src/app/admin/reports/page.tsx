import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatCurrency } from "@/lib/utils";
import { BarChart3, Users, BedDouble, CreditCard, AlertCircle, TrendingUp } from "lucide-react";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [
    totalStudents,
    totalRooms,
    availableRooms,
    totalRevenue,
    successPayments,
    pendingPayments,
    failedPayments,
    openComplaints,
    resolvedComplaints,
    totalBookings,
    confirmedBookings,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.room.count(),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
    prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } }),
    prisma.payment.count({ where: { status: "SUCCESS" } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
    prisma.complaint.count({ where: { status: { not: "RESOLVED" } } }),
    prisma.complaint.count({ where: { status: "RESOLVED" } }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "CONFIRMED" } }),
  ]);

  const occupancyRate = totalRooms > 0 ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Comprehensive overview of hostel operations</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(Number(totalRevenue._sum.amount ?? 0))} icon={<CreditCard className="w-5 h-5 text-primary" />} delay={0} />
        <StatCard title="Occupancy Rate" value={`${occupancyRate}%`} icon={<BedDouble className="w-5 h-5 text-primary" />} delay={0.1} />
        <StatCard title="Total Students" value={totalStudents} icon={<Users className="w-5 h-5 text-primary" />} delay={0.2} />
        <StatCard title="Active Bookings" value={confirmedBookings} icon={<TrendingUp className="w-5 h-5 text-primary" />} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Breakdown */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h2 className="font-semibold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-400" /><span className="text-sm">Successful</span></div>
              <span className="font-semibold">{successPayments}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-green-400 h-2 rounded-full" style={{ width: `${(successPayments / Math.max(successPayments + pendingPayments + failedPayments, 1)) * 100}%` }} /></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-yellow-400" /><span className="text-sm">Pending</span></div>
              <span className="font-semibold">{pendingPayments}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${(pendingPayments / Math.max(successPayments + pendingPayments + failedPayments, 1)) * 100}%` }} /></div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-400" /><span className="text-sm">Failed</span></div>
              <span className="font-semibold">{failedPayments}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2"><div className="bg-red-400 h-2 rounded-full" style={{ width: `${(failedPayments / Math.max(successPayments + pendingPayments + failedPayments, 1)) * 100}%` }} /></div>
          </div>
        </div>

        {/* Complaint Resolution */}
        <div className="glass rounded-2xl p-6 space-y-6">
          <h2 className="font-semibold text-lg flex items-center gap-2"><AlertCircle className="w-5 h-5 text-primary" /> Complaint Resolution</h2>
          <div className="flex items-center justify-center gap-8 py-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-red-400">{openComplaints}</p>
              <p className="text-sm text-muted-foreground mt-1">Open</p>
            </div>
            <div className="w-px h-16 bg-white/10" />
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400">{resolvedComplaints}</p>
              <p className="text-sm text-muted-foreground mt-1">Resolved</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Resolution Rate</span><span className="font-medium">{Math.round((resolvedComplaints / Math.max(openComplaints + resolvedComplaints, 1)) * 100)}%</span></div>
            <div className="w-full bg-white/5 rounded-full h-3"><div className="bg-gradient-to-r from-primary to-green-400 h-3 rounded-full transition-all" style={{ width: `${(resolvedComplaints / Math.max(openComplaints + resolvedComplaints, 1)) * 100}%` }} /></div>
          </div>
        </div>
      </div>

      {/* Room Utilization */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-lg flex items-center gap-2"><BarChart3 className="w-5 h-5 text-primary" /> Room Utilization Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold">{totalRooms}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Rooms</p>
          </div>
          <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-400">{availableRooms}</p>
            <p className="text-xs text-muted-foreground mt-1">Available</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{totalRooms - availableRooms}</p>
            <p className="text-xs text-muted-foreground mt-1">Occupied</p>
          </div>
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-primary">{totalBookings}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Bookings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
