"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Filter, Loader2 } from "lucide-react";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Payment {
  id: string;
  amount: number;
  status: string;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  student: { user: { name: string; email: string } };
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    params.set("page", page.toString());

    const res = await fetch(`/api/payments?${params}`);
    const data = await res.json();
    setPayments(data.payments || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchPayments(); }, [statusFilter, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground mt-1">Track all financial transactions</p>
      </div>

      <div className="relative w-fit">
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
          <option value="ALL">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : payments.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl"><CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No payments found</p></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Transaction ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p: any, i: number) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{p.student.user.name}</td>
                    <td className="px-6 py-4 font-semibold text-green-400">{formatCurrency(Number(p.amount))}</td>
                    <td className="px-6 py-4 text-muted-foreground font-mono text-xs">{p.transactionId || "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{p.paidAt ? formatDate(p.paidAt) : formatDate(p.createdAt)}</td>
                    <td className="px-6 py-4"><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-4 py-2 rounded-lg text-sm transition-colors ${page === i + 1 ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10"}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
