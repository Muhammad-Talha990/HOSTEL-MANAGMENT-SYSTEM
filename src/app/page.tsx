"use client";

import { motion } from "framer-motion";
import { Building2, ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full -z-10" />

      {/* Hero Section */}
      <section className="max-w-5xl w-full text-center space-y-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            Next-Gen Housing Management
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight"
        >
          Manage your hostel with <br />
          <span className="gradient-text">Elite Intelligence.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
        >
          A premium ERP solution for student housing institutions. Secure, scalable, and designed for the modern era.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            Launch Portal <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 glass rounded-xl font-semibold hover:bg-white/5 transition-all"
          >
            Explore Features
          </Link>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl w-full py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Building2 className="w-6 h-6 text-primary" />}
          title="Room Management"
          description="Automated allocation and real-time occupancy tracking."
          delay={0.4}
        />
        <FeatureCard
          icon={<ShieldCheck className="w-6 h-6 text-primary" />}
          title="Secure Access"
          description="Role-based portals for students, wardens, and admins."
          delay={0.5}
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6 text-primary" />}
          title="Digital Payments"
          description="Integrated billing with automated receipt generation."
          delay={0.6}
        />
        <FeatureCard
          icon={<Users className="w-6 h-6 text-primary" />}
          title="Student Hub"
          description="A centralized portal for complaints, profile, and updates."
          delay={0.7}
        />
      </section>

      {/* Footer */}
      <footer className="w-full py-10 border-t border-white/5 text-center text-sm text-muted-foreground">
        © 2024 EliteHostel Hub. All rights reserved.
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode; title: string; description: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-8 glass rounded-2xl space-y-4 hover:border-primary/30 transition-colors group"
    >
      <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}
