"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, Loader2, Mail } from "lucide-react";
import { getInitials } from "@/lib/utils";

interface Student {
  id: string;
  phone: string | null;
  user: { name: string; email: string; createdAt: string };
  room: { roomNumber: string; type: string } | null;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchStudents = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("page", page.toString());
    params.set("limit", "10");

    const res = await fetch(`/api/students?${params}`);
    const data = await res.json();
    setStudents(data.students || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchStudents(); }, [search, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Students</h1>
        <p className="text-muted-foreground mt-1">View and manage registered students</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search students by name or email..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : students.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl"><Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No students found</p></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map((s: any, i: number) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{getInitials(s.user.name || "U")}</div>
                        <span className="font-medium">{s.user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex items-center gap-1.5"><Mail className="w-3 h-3" />{s.user.email}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{s.phone || "—"}</td>
                    <td className="px-6 py-4">{s.room ? <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full text-xs font-medium">{s.room.roomNumber} ({s.room.type})</span> : <span className="text-muted-foreground text-xs">Unassigned</span>}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
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
