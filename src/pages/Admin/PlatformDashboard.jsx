import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, FolderKanban, CheckCircle2, Activity, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import StatCard from "@/components/adminPage/StatCard";
import SectionCard from "@/components/adminPage/SectionCard";
import StatusBadge from "@/components/adminPage/StatusBadge";

const dashboardStats = [];
const recentActivities = [];
const systemServices = [];
const organizations = [];
import { Card, Button, Avatar, Row, Col, Space } from "antd";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

const activityDotColor = {
  create: "bg-emerald-500",
  update: "bg-indigo-500",
  alert: "bg-amber-500",
  system: "bg-slate-400",
};

export default function PlatformDashboard() {
  const hasIssues = systemServices.some((s) => s.status !== "Operational");
  const topOrgs = [...organizations].sort((a, b) => b.users - a.users).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Critical alert banner */}
      <AnimatePresence>
        {hasIssues && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <AlertTriangle className="text-amber-600 dark:text-amber-400 w-5 h-5" />
              </motion.div>
              <div>
                <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">System Degraded</h4>
                <p className="text-xs text-amber-700 dark:text-amber-400/80">
                  Some services are experiencing issues. Check System Health for details.
                </p>
              </div>
            </div>
            <Link href="/admin/health">
              <Button
                size="small"
                className="bg-white/60 dark:bg-black/20 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 hover:bg-white dark:hover:bg-black/40 gap-1.5"
              >
                View Status <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stat cards — staggered */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard title="Total Organizations" value={dashboardStats.totalOrganizations} change="+12% this month" icon={Building2} tone="indigo" delay={0} />
        <StatCard title="Active Platform Users" value={dashboardStats.activeUsers} change="+5% this month" icon={Users} tone="emerald" delay={0.07} />
        <StatCard title="Active Projects" value={dashboardStats.activeProjects} change="+8% this month" icon={FolderKanban} tone="indigo" delay={0.14} />
        <StatCard title="Tasks Completed" value={dashboardStats.totalTasks} change="+15% this month" icon={CheckCircle2} tone="slate" delay={0.21} />
        <StatCard title="Bottlenecks Detected" value={dashboardStats.bottlenecksDetected} change="-2 this week" icon={Activity} tone="amber" delay={0.28} />
        <StatCard title="System Uptime" value={dashboardStats.systemUptime} icon={Clock} tone="emerald" delay={0.35} />
      </div>

      {/* Growth chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Organization Growth" description="New workspaces over the last 6 months" className="lg:col-span-2">
          <div className="h-[220px] flex items-end justify-between gap-3 pt-4 pb-2 px-2">
            {[
              { month: "Jan", val: 45 },
              { month: "Feb", val: 62 },
              { month: "Mar", val: 85 },
              { month: "Apr", val: 110 },
              { month: "May", val: 168 },
              { month: "Jun", val: 247 },
            ].map(({ month, val }, i) => (
              <div key={month} className="flex flex-col items-center gap-2 flex-1 group">
                <motion.span
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, delay: 0.5 + i * 0.07 }}
                  className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                >
                  {val}
                </motion.span>
                <div className="w-full relative" style={{ height: "160px" }}>
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.55, delay: 0.2 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                    className="absolute bottom-0 w-full rounded-t-md bg-indigo-100 dark:bg-indigo-900/40 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800/50 transition-colors origin-bottom"
                    style={{ height: `${(val / 247) * 100}%` }}
                  >
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.4, delay: 0.35 + i * 0.08, ease: [0.34, 1.56, 0.64, 1] }}
                      className="absolute bottom-0 w-full rounded-t-md bg-indigo-500 dark:bg-indigo-500 origin-bottom"
                      style={{ height: "6px" }}
                    />
                  </motion.div>
                </div>
                <span className="text-xs text-slate-500 font-medium">{month}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity">
          <div className="space-y-4">
            {recentActivities.slice(0, 7).map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ x: 14 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, delay: i * 0.05 }}
                className="relative flex gap-3"
              >
                {i !== recentActivities.slice(0, 7).length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-px bg-slate-200 dark:bg-slate-800" />
                )}
                <motion.div
                  className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 border-white dark:border-slate-900 z-10 mt-0.5",
                    activityDotColor[activity.type] || "bg-slate-400"
                  )}
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </motion.div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200 leading-snug">
                    <span className="font-semibold">{activity.actor}</span>{" "}
                    <span className="text-slate-500 dark:text-slate-400">{activity.action}</span>{" "}
                    <span className="font-medium text-indigo-600 dark:text-indigo-400 truncate">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Top Orgs + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Top Active Organizations" description="By number of members" className="lg:col-span-2">
          <div className="space-y-3">
            {topOrgs.map((org, i) => (
              <motion.div
                key={org.id}
                initial={{ x: -16 }}
                animate={{ x: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28, delay: i * 0.06 }}
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-default"
              >
                <Avatar className={cn("h-9 w-9 shrink-0 text-sm font-semibold", org.avatarColor)}>
                  {org.name.slice(0, 2).toUpperCase()}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{org.name}</p>
                  <p className="text-xs text-slate-500">{org.plan}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                    {org.users} users
                  </span>
                  <span className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                    {org.projects} projects
                  </span>
                  <StatusBadge status={org.status} />
                </div>
              </motion.div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Create Org", href: "/admin/organizations", color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50", icon: Building2 },
              { label: "Send Notification", href: "/admin/notifications", color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50", icon: Activity },
              { label: "Audit Logs", href: "/admin/audit-logs", color: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60", icon: CheckCircle2 },
              { label: "System Health", href: "/admin/health", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50", icon: Activity },
            ].map(({ label, href, color, icon: Icon }, i) => (
              <Link key={label} href={href}>
                <motion.div
                  initial={{ scale: 0.88 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22, delay: i * 0.07 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn("flex flex-col items-center gap-2 p-4 rounded-xl cursor-pointer transition-colors text-center", color)}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
