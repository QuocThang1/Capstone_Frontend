import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FolderKanban,
  Users,
} from "lucide-react";
import { App, Avatar, Button, Empty, Spin } from "antd";
import SectionCard from "@/components/adminPage/SectionCard";
import StatCard from "@/components/adminPage/StatCard";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { getPlatformDashboardApi } from "@/utils/Api/adminApi";
import { cn } from "@/lib/utils";

const activityDotColor = {
  create: "bg-emerald-500",
  update: "bg-indigo-500",
  alert: "bg-amber-500",
  system: "bg-slate-400",
};

const emptyDashboard = {
  dashboardStats: {},
  recentActivities: [],
  systemServices: [],
  organizations: [],
  organizationGrowth: [],
};

const formatChange = (value, suffix) => {
  const numericValue = Number(value || 0);
  return `${numericValue > 0 ? "+" : ""}${numericValue} ${suffix}`;
};

const growthPeriods = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

const growthDescriptions = {
  day: "New organizations over the last 7 days",
  week: "New organizations over the last 8 weeks",
  month: "New organizations over the last 6 months",
  year: "New organizations over the last 5 years",
};

export default function PlatformDashboard() {
  const { message } = App.useApp();
  const [dashboard, setDashboard] = useState(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [growthPeriod, setGrowthPeriod] = useState("month");

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await getPlatformDashboardApi({ growthPeriod });

      if (res?.EC === 0) {
        setDashboard({
          dashboardStats: res.data?.dashboardStats || {},
          recentActivities: res.data?.recentActivities || [],
          systemServices: res.data?.systemServices || [],
          organizations: res.data?.organizations || [],
          organizationGrowth: res.data?.organizationGrowth || [],
        });
      } else {
        message.error(res?.EM || "Failed to load platform dashboard");
      }

      setLoading(false);
    };

    fetchDashboard();
  }, [growthPeriod, message]);

  const { dashboardStats, recentActivities, systemServices, organizations, organizationGrowth } = dashboard;
  const hasIssues = systemServices.some((service) => service.status !== "Operational");
  const topOrgs = [...organizations].sort((a, b) => b.users - a.users).slice(0, 5);
  const maxGrowth = Math.max(...organizationGrowth.map((item) => item.val), 1);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            <Link to="/admin/health">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Total Organizations"
          value={dashboardStats.totalOrganizations || 0}
          change={formatChange(dashboardStats.organizationGrowthThisMonth, "this month")}
          icon={Building2}
          tone="indigo"
          delay={0}
        />
        <StatCard
          title="Active Platform Users"
          value={dashboardStats.activeUsers || 0}
          change={formatChange(dashboardStats.userGrowthThisMonth, "this month")}
          icon={Users}
          tone="emerald"
          delay={0.07}
        />
        <StatCard
          title="Active Projects"
          value={dashboardStats.activeProjects || 0}
          change={formatChange(dashboardStats.projectGrowthThisMonth, "this month")}
          icon={FolderKanban}
          tone="indigo"
          delay={0.14}
        />
        <StatCard
          title="Tasks Completed"
          value={dashboardStats.totalTasks || 0}
          change={formatChange(dashboardStats.completedTasksThisMonth, "this month")}
          icon={CheckCircle2}
          tone="slate"
          delay={0.21}
        />
        <StatCard
          title="Bottlenecks Detected"
          value={dashboardStats.bottlenecksDetected || 0}
          change={formatChange(dashboardStats.bottlenecksThisWeek, "this week")}
          icon={Activity}
          tone="amber"
          delay={0.28}
        />
        <StatCard
          title="System Uptime"
          value={dashboardStats.systemUptime || "N/A"}
          icon={Clock}
          tone="emerald"
          delay={0.35}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard
          title="Organization Growth"
          description={growthDescriptions[growthPeriod]}
          className="lg:col-span-2"
          actions={
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              {growthPeriods.map((period) => (
                <button
                  key={period.value}
                  type="button"
                  onClick={() => setGrowthPeriod(period.value)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    growthPeriod === period.value
                      ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  )}
                >
                  {period.label}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[220px] flex items-end justify-between gap-3 pt-4 pb-2 px-2">
            {organizationGrowth.map(({ month, val }, i) => (
              <div key={`${month}-${i}`} className="flex flex-col items-center gap-2 flex-1 group">
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
                    style={{ height: `${(val / maxGrowth) * 100}%` }}
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
          {recentActivities.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No recent activity" />
          ) : (
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
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(activity.time).toLocaleString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <SectionCard title="Top Active Organizations" description="By number of members" className="lg:col-span-2">
          {topOrgs.length === 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No organizations yet" />
          ) : (
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
                    <p className="text-xs text-slate-500 truncate">{org.owner || "No owner"}</p>
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
          )}
        </SectionCard>

        <SectionCard title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Create Org", href: "/admin/organizations", color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50", icon: Building2 },
              { label: "Send Notification", href: "/admin/notifications", color: "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50", icon: Activity },
              { label: "Audit Logs", href: "/admin/audit-logs", color: "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60", icon: CheckCircle2 },
              { label: "System Health", href: "/admin/health", color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50", icon: Activity },
            ].map(({ label, href, color, icon: Icon }, i) => (
              <Link key={label} to={href}>
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
