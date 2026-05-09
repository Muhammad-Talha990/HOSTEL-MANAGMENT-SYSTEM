import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Users, BedDouble, CreditCard, AlertCircle, TrendingUp, Home,
} from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  // Fetch all stats in parallel
  const [
    totalStudents,
    totalRooms,
    availableRooms,
    totalRevenue,
    pendingComplaints,
    recentBookings,
    recentPayments,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.room.count(),
    prisma.room.count({ where: { status: "AVAILABLE" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "SUCCESS" },
    }),
    prisma.complaint.count({ where: { status: { not: "RESOLVED" } } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: { include: { user: true } } },
    }),
    prisma.payment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { student: { include: { user: true } } },
    }),
  ]);

  const occupancyRate =
    totalRooms > 0
      ? Math.round(((totalRooms - availableRooms) / totalRooms) * 100)
      : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session.user?.name}. Here&apos;s an overview of your hostel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={<Users className="w-5 h-5 text-primary" />}
          trend={{ value: 12, label: "this month" }}
          delay={0}
        />
        <StatCard
          title="Total Rooms"
          value={`${totalRooms - availableRooms}/${totalRooms}`}
          icon={<BedDouble className="w-5 h-5 text-primary" />}
          trend={{ value: occupancyRate, label: "occupied" }}
          delay={0.1}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(Number(totalRevenue._sum.amount ?? 0))}
          icon={<CreditCard className="w-5 h-5 text-primary" />}
          trend={{ value: 8, label: "this month" }}
          delay={0.2}
        />
        <StatCard
          title="Open Complaints"
          value={pendingComplaints}
          icon={<AlertCircle className="w-5 h-5 text-primary" />}
          trend={{ value: -5, label: "vs last week" }}
          delay={0.3}
        />
      </div>

      {/* Occupancy Bar */}
      <div className="glass rounded-2xl p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            <span className="font-semibold">Room Occupancy</span>
          </div>
          <span className="text-sm text-muted-foreground">{occupancyRate}% occupied</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary to-purple-500 h-3 rounded-full transition-all duration-700"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{totalRooms - availableRooms} Occupied</span>
          <span>{availableRooms} Available</span>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Bookings</h2>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Check-in</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-muted-foreground">No bookings yet</td>
                  </tr>
                ) : (
                  recentBookings.map((b: any) => (
                    <tr key={b.id}>
                      <td className="py-3">{b.student.user.name}</td>
                      <td className="py-3 text-muted-foreground">{formatDate(b.checkIn)}</td>
                      <td className="py-3">
                        <Badge variant={getStatusVariant(b.status)}>{b.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Payments</h2>
            <CreditCard className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="pb-3 font-medium">Student</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentPayments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-muted-foreground">No payments yet</td>
                  </tr>
                ) : (
                  recentPayments.map((p: any) => (
                    <tr key={p.id}>
                      <td className="py-3">{p.student.user.name}</td>
                      <td className="py-3">{formatCurrency(Number(p.amount))}</td>
                      <td className="py-3">
                        <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
