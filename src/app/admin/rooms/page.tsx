"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BedDouble, Plus, Search, Filter, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Badge, getStatusVariant } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface Room {
  id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  price: number;
  status: string;
  students: { id: string; user: { name: string } }[];
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    roomNumber: "", type: "Single", capacity: 1, price: 5000, status: "AVAILABLE",
  });
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRooms = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    params.set("page", page.toString());
    params.set("limit", "8");

    const res = await fetch(`/api/rooms?${params}`);
    const data = await res.json();
    setRooms(data.rooms || []);
    setTotalPages(data.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => { fetchRooms(); }, [search, statusFilter, page]);

  const openCreateModal = () => {
    setEditingRoom(null);
    setFormData({ roomNumber: "", type: "Single", capacity: 1, price: 5000, status: "AVAILABLE" });
    setShowModal(true);
  };

  const openEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      roomNumber: room.roomNumber, type: room.type,
      capacity: room.capacity, price: room.price, status: room.status,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const url = editingRoom ? `/api/rooms/${editingRoom.id}` : "/api/rooms";
    const method = editingRoom ? "PUT" : "POST";

    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData) });
    setShowModal(false);
    setSubmitting(false);
    fetchRooms();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    await fetch(`/api/rooms/${id}`, { method: "DELETE" });
    fetchRooms();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Rooms</h1>
          <p className="text-muted-foreground mt-1">Manage hostel rooms and allocations</p>
        </div>
        <button id="add-room-btn" onClick={openCreateModal} className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Add Room
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by room number..." className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
        </div>
        <div className="relative">
          <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="pl-10 pr-8 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
            <option value="ALL">All Status</option>
            <option value="AVAILABLE">Available</option>
            <option value="FULL">Full</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl"><BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-3" /><p className="text-muted-foreground">No rooms found</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {rooms.map((room: any, i: number) => (
            <motion.div key={room.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }} className="glass rounded-2xl p-5 space-y-4 hover:border-primary/20 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg"><BedDouble className="w-5 h-5 text-primary" /></div>
                  <div>
                    <p className="font-bold text-lg">Room {room.roomNumber}</p>
                    <p className="text-xs text-muted-foreground">{room.type}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(room.status)}>{room.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground text-xs">Capacity</p><p className="font-medium">{room.students.length}/{room.capacity}</p></div>
                <div><p className="text-muted-foreground text-xs">Price/Month</p><p className="font-medium">{formatCurrency(room.price)}</p></div>
              </div>
              {room.students.length > 0 && (
                <div className="pt-3 border-t border-white/5">
                  <p className="text-xs text-muted-foreground mb-1.5">Occupants</p>
                  <div className="flex flex-wrap gap-1">
                    {room.students.map((s: any) => (<span key={s.id} className="text-xs bg-white/5 px-2 py-0.5 rounded-full">{s.user.name}</span>))}
                  </div>
                </div>
              )}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEditModal(room)} className="flex-1 py-1.5 text-xs border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center gap-1"><Pencil className="w-3 h-3" /> Edit</button>
                <button onClick={() => handleDelete(room.id)} className="flex-1 py-1.5 text-xs border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/5 transition-colors flex items-center justify-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
              </div>
            </motion.div>
          ))}
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

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="glass rounded-2xl p-6 w-full max-w-md space-y-5 border border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingRoom ? "Edit Room" : "Add New Room"}</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2"><label className="text-sm text-muted-foreground">Room Number</label><input value={formData.roomNumber} onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })} required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><label className="text-sm text-muted-foreground">Type</label><select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"><option>Single</option><option>Double</option><option>Triple</option><option>Quad</option><option>Suite</option></select></div>
                  <div className="space-y-2"><label className="text-sm text-muted-foreground">Capacity</label><input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })} min={1} required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2"><label className="text-sm text-muted-foreground">Price/Month (PKR)</label><input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} min={0} required className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" /></div>
                  <div className="space-y-2"><label className="text-sm text-muted-foreground">Status</label><select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-2.5 rounded-xl bg-[#0d0d14] border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"><option value="AVAILABLE">Available</option><option value="FULL">Full</option><option value="MAINTENANCE">Maintenance</option></select></div>
                </div>
                <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : editingRoom ? "Update Room" : "Create Room"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
