"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Plus, X, Loader2 } from "lucide-react";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface Complaint {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
}

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", priority: "MEDIUM" });

  const fetchComplaints = async () => {
    setLoading(true);
    const res = await fetch("/api/complaints");
    const data = await res.json();
    setComplaints(data.complaints || []);
    setLoading(false);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/complaints", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    setShowModal(false);
    setSubmitting(false);
    setFormData({ title: "", description: "", priority: "MEDIUM" });
    fetchComplaints();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <p className="text-muted-foreground mt-1">Report and track issues</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> New Complaint
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No complaints filed yet</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-primary hover:underline text-sm">File your first complaint →</button>
        </div>
      ) : (
        <div className="space-y-3">
          {complaints.map((c: any, i: number) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-2xl p-5 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold">{c.title}</h3>
                <div className="flex gap-1.5 shrink-0">
                  <Badge variant={getStatusVariant(c.priority)}>{c.priority}</Badge>
                  <Badge variant={getStatusVariant(c.status)}>{c.status.replace("_", " ")}</Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <p className="text-xs text-muted-foreground">{formatDate(c.createdAt)}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Complaint Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md space-y-5 border border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">New Complaint</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Title</label><input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Brief title of the issue" required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Description</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the issue in detail..." rows={4} required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" /></div>
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Priority</label><select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
                <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : "Submit Complaint"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
