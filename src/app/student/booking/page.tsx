import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { BedDouble, Users } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Badge, getStatusVariant } from "@/components/ui/Badge";

export default async function StudentBookingPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const student = await prisma.student.findUnique({
    where: { userId: session.user.id },
    include: {
      room: { include: { students: { include: { user: { select: { name: true } } } } } },
      bookings: { orderBy: { createdAt: "desc" } },
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Room</h1>
        <p className="text-muted-foreground mt-1">View your room details and booking history</p>
      </div>

      {/* Current Room */}
      {student?.room ? (
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-xl"><BedDouble className="w-6 h-6 text-primary" /></div>
            <div>
              <h2 className="text-xl font-bold">Room {student.room.roomNumber}</h2>
              <p className="text-sm text-muted-foreground">{student.room.type} Room</p>
            </div>
            <Badge variant={getStatusVariant(student.room.status)} className="ml-auto">{student.room.status}</Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4"><p className="text-xs text-muted-foreground">Capacity</p><p className="text-lg font-bold">{student.room.students.length}/{student.room.capacity}</p></div>
            <div className="bg-white/5 rounded-xl p-4"><p className="text-xs text-muted-foreground">Monthly Rent</p><p className="text-lg font-bold text-primary">{formatCurrency(Number(student.room.price))}</p></div>
            <div className="bg-white/5 rounded-xl p-4"><p className="text-xs text-muted-foreground">Room Type</p><p className="text-lg font-bold">{student.room.type}</p></div>
            <div className="bg-white/5 rounded-xl p-4"><p className="text-xs text-muted-foreground">Status</p><p className="text-lg font-bold">{student.room.status}</p></div>
          </div>

          {/* Roommates */}
          {student.room.students.length > 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Roommates</h3>
              <div className="flex flex-wrap gap-2">
                {student.room.students
                  .filter((s: any) => s.id !== student.id)
                  .map((s: any) => (
                    <span key={s.id} className="px-3 py-1.5 bg-white/5 rounded-full text-sm">{s.user.name}</span>
                  ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16 glass rounded-2xl">
          <BedDouble className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No room assigned yet</p>
          <p className="text-sm text-muted-foreground mt-1">Contact the administration for room allocation</p>
        </div>
      )}

      {/* Booking History */}
      <div className="glass rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold text-lg">Booking History</h2>
        {student?.bookings.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-white/5">
                  <th className="pb-3 font-medium">Check-in</th>
                  <th className="pb-3 font-medium">Check-out</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {student?.bookings.map((b: any) => (
                  <tr key={b.id}>
                    <td className="py-3">{new Date(b.checkIn).toLocaleDateString()}</td>
                    <td className="py-3">{new Date(b.checkOut).toLocaleDateString()}</td>
                    <td className="py-3"><Badge variant={getStatusVariant(b.status)}>{b.status}</Badge></td>
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
