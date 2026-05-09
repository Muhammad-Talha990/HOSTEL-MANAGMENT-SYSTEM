"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Mail, Shield, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export default function StudentProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8 max-w-xl space-y-6"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold">{session?.user?.name}</h2>
            <Badge variant="info" className="mt-1">{(session?.user as any)?.role || "STUDENT"}</Badge>
          </div>
        </div>

        {/* Info Fields */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <User className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="font-medium">{session?.user?.name || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <Mail className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="font-medium">{session?.user?.email || "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl">
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-medium">{(session?.user as any)?.role || "STUDENT"}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
