"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Filter, Loader2 } from "lucide-react";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Complaint {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  student: { user: { name: string; email: string } };
}

export default function WardenComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchComplaints = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "ALL") params.set("status", statusFilter);

    const res = await fetch(`/api/complaints?${params}`);
    const data = await res.json();
    setComplaints(data.complaints || []);
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, [statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchComplaints();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Complaints</h1>
        <p className="text-muted-foreground mt-1">Review and resolve student complaints</p>
      </div>

      <div className="relative w-fit">
        <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
          <option value="ALL">All Status</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl"><AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No complaints found</p></div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c: Complaint, i: number) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 space-y-3 hover:border-primary/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold">{c.title}</h3>
                    <Badge variant={getStatusVariant(c.priority)}>{c.priority}</Badge>
                    <Badge variant={getStatusVariant(c.status)}>{c.status.replace("_", " ")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{c.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-white">{c.student.user.name}</span> · {formatDate(c.createdAt)}
                </div>
                <div className="flex gap-2">
                  {c.status !== "IN_PROGRESS" && c.status !== "RESOLVED" && (
                    <button onClick={() => updateStatus(c.id, "IN_PROGRESS")} className="px-3 py-1.5 text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/20 transition-colors">Mark In Progress</button>
                  )}
                  {c.status !== "RESOLVED" && (
                    <button onClick={() => updateStatus(c.id, "RESOLVED")} className="px-3 py-1.5 text-xs bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">Resolve</button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
