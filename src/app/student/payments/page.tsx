import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CreditCard } from "lucide-react";

export default async function StudentPaymentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      payments: { orderBy: { createdAt: "desc" } },
    },
  });

  const totalPaid = student?.payments
    .filter((p: any) => p.status === "SUCCESS")
    .reduce((sum: number, p: any) => sum + Number(p.amount), 0) ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-1">View your payment history</p>
      </div>

      <div className="glass rounded-2xl p-6 flex items-center gap-4">
        <div className="p-3 bg-green-500/10 rounded-xl"><CreditCard className="w-6 h-6 text-green-400" /></div>
        <div>
          <p className="text-sm text-muted-foreground">Total Paid</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPaid)}</p>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {student?.payments.length === 0 ? (
          <div className="text-center py-16">
            <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No payment records found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {student?.payments.map((p: any) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-semibold">{formatCurrency(Number(p.amount))}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{p.transactionId || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}</td>
                    <td className="px-6 py-4"><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
