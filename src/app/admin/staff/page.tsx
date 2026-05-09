import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Users, Mail, Phone, Shield } from "lucide-react";
import { getInitials } from "@/lib/utils";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const staff = await prisma.staff.findMany({
    include: { user: { select: { name: true, email: true, createdAt: true } } },
    orderBy: { user: { createdAt: "desc" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Staff</h1>
        <p className="text-muted-foreground mt-1">Manage hostel staff members</p>
      </div>

      {staff.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No staff members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {staff.map((s: any) => (
            <div key={s.id} className="glass rounded-2xl p-6 space-y-4 hover:border-primary/20 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                  {getInitials(s.user.name || "S")}
                </div>
                <div>
                  <p className="font-semibold">{s.user.name}</p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    {s.position}
                  </div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {s.user.email}
                </div>
                {s.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" />
                    {s.phone}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
