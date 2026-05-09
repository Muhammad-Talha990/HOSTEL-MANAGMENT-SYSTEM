"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Filter, Loader2 } from "lucide-react";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Booking {
  id: string;
  checkIn: string;
  checkOut: string;
  status: string;
  createdAt: string;
  student: {
    user: { name: string; email: string };
    room: { roomNumber: string; type: string } | null;
  };
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchBookings = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const res = await fetch(`/api/bookings?${params}`);
    const data = await res.json();
    setBookings(data.bookings || []);
    setLoading(false);
  };

  useEffect(() => { fetchBookings(); }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage room reservations and check-ins</p>
      </div>

      <div className="relative w-fit">
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl"><ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No bookings found</p></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Room</th>
                  <th className="px-6 py-4 font-medium">Check-in</th>
                  <th className="px-6 py-4 font-medium">Check-out</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.map((b: any, i: number) => (
                  <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{b.student.user.name}</td>
                    <td className="px-6 py-4">{b.student.room ? <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">{b.student.room.roomNumber}</span> : "—"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(b.checkIn)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{formatDate(b.checkOut)}</td>
                    <td className="px-6 py-4"><Badge variant={getStatusVariant(b.status)}>{b.status}</Badge></td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
