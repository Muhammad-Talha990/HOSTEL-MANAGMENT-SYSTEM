"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  className?: string;
  delay?: number;
}

export function StatCard({ title, value, icon, trend, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        "glass rounded-2xl p-6 flex items-start justify-between hover:border-primary/20 transition-colors",
        className
      )}
    >
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        {trend && (
          <p className={cn("text-xs", trend.value >= 0 ? "text-green-400" : "text-red-400")}>
            {trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}% {trend.label}
          </p>
        )}
      </div>
      <div className="p-3 bg-primary/10 rounded-xl">{icon}</div>
    </motion.div>
  );
}
