"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const variants = {
  default: "bg-white/10 text-white",
  success: "bg-green-500/15 text-green-400 border border-green-500/20",
  warning: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/20",
  danger: "bg-red-500/15 text-red-400 border border-red-500/20",
  info: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function getStatusVariant(
  status: string
): BadgeProps["variant"] {
  const s = status.toUpperCase();
  if (["AVAILABLE", "SUCCESS", "CONFIRMED", "RESOLVED", "ACTIVE"].includes(s)) return "success";
  if (["MAINTENANCE", "PENDING", "IN_PROGRESS"].includes(s)) return "warning";
  if (["FULL", "FAILED", "CANCELLED", "OPEN", "HIGH"].includes(s)) return "danger";
  return "info";
}
