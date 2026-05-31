import { useState } from "react";
import {
  Activity,
  AlertCircle,
  Bell,
  Cpu,
  Database,
  HardDrive,
  Layout,
  RefreshCw,
  Server,
} from "lucide-react";
import { Button, message } from "antd";
import SectionCard from "@/components/adminPage/SectionCard";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { cn } from "@/lib/utils";

const systemServices = [
  { id: "backend", name: "Backend API", status: "Operational", uptime: "99.99%", responseTime: "124ms", icon: "server" },
  { id: "frontend", name: "Frontend App", status: "Operational", uptime: "100%", responseTime: "45ms", icon: "layout" },
  { id: "database", name: "Database", status: "Operational", uptime: "99.95%", responseTime: "12ms", icon: "database" },
  { id: "websocket", name: "WebSocket Server", status: "Degraded", uptime: "98.50%", responseTime: "350ms", icon: "activity" },
  { id: "notifications", name: "Notification Service", status: "Operational", uptime: "99.90%", responseTime: "85ms", icon: "bell" },
  { id: "jobs", name: "Background Jobs", status: "Operational", uptime: "99.98%", responseTime: "-", icon: "cpu" },
  { id: "storage", name: "File Storage", status: "Operational", uptime: "100%", responseTime: "210ms", icon: "hard-drive" },
];

const systemMetrics = {
  cpu: 34,
  memory: 61,
  disk: 48,
  apiResponseTime: 145,
  activeWsConnections: 1243,
  dbConnections: 47,
  errorRate: "0.02",
};

const incidents = [
  { id: "inc-1", title: "High WebSocket Latency", affectedService: "WebSocket Server", severity: "Medium", status: "Investigating" },
  { id: "inc-2", title: "Database Cleanup Job Failure", affectedService: "Background Jobs", severity: "Low", status: "Open" },
  { id: "inc-3", title: "API Outage (US East)", affectedService: "Backend API", severity: "Critical", status: "Resolved" },
  { id: "inc-4", title: "Delayed Notifications", affectedService: "Notification Service", severity: "Medium", status: "Resolved" },
  { id: "inc-5", title: "S3 Storage Quota Warning", affectedService: "File Storage", severity: "High", status: "Monitoring" },
];

const backgroundJobs = [
  { id: "job-1", name: "Bottleneck Detection", status: "Running", duration: "45m", nextRun: "05:00 PM" },
  { id: "job-2", name: "Report Generation", status: "Scheduled", duration: "12m", nextRun: "06:00 AM" },
  { id: "job-3", name: "Notification Dispatch", status: "Completed", duration: "4s", nextRun: "05:45 PM" },
  { id: "job-4", name: "Database Cleanup", status: "Failed", duration: "35s", nextRun: "09:00 AM" },
];

const iconMap = {
  server: Server,
  layout: Layout,
  database: Database,
  activity: Activity,
  bell: Bell,
  cpu: Cpu,
  "hard-drive": HardDrive,
};

function MetricBar({ label, value, tone = "indigo" }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            tone === "amber" ? "bg-amber-500" : "bg-indigo-600 dark:bg-indigo-500"
          )}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function SimpleTable({ columns, rows, renderRow }) {
  return (
    <div className="-mx-6 -mb-6 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {columns.map((column) => (
              <th key={column} className="px-6 py-3 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

export default function SystemHealthPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastChecked, setLastChecked] = useState("Just now");

  const hasIssues = systemServices.some((service) => service.status !== "Operational");

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastChecked("Just now");
      message.success("System status refreshed");
    }, 1000);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Health</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time monitoring of TASKA infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">Last checked: {lastChecked}</span>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 px-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm"
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "p-5 rounded-xl border flex items-start gap-4",
          hasIssues
            ? "bg-amber-50/60 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800"
            : "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800"
        )}
      >
        <AlertCircle className={cn("w-5 h-5 shrink-0 mt-0.5", hasIssues ? "text-amber-600" : "text-emerald-600")} />
        <div>
          <h3 className={cn("font-bold text-base", hasIssues ? "text-amber-800 dark:text-amber-300" : "text-emerald-800 dark:text-emerald-300")}>
            {hasIssues ? "System experiencing degraded performance" : "All Systems Operational"}
          </h3>
          <p className={cn("mt-1 text-sm", hasIssues ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300")}>
            {hasIssues
              ? "Our monitoring has detected anomalies in some services. Engineers have been notified."
              : "All core infrastructure and backend services are running smoothly with normal latency."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {systemServices.map((service) => {
          const Icon = iconMap[service.icon] || Server;

          return (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[150px]"
            >
              <div className="flex justify-between items-start mb-5">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <StatusBadge status={service.status} />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3">{service.name}</h4>
              <div className="mt-auto grid grid-cols-2 gap-5 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">Uptime</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{service.uptime}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-medium">Latency</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{service.responseTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <SectionCard title="Core Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-9 gap-y-7">
          <MetricBar label="CPU Usage" value={systemMetrics.cpu} />
          <MetricBar label="Memory Usage" value={systemMetrics.memory} tone="amber" />
          <MetricBar label="Disk I/O" value={systemMetrics.disk} />
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium block">API Response Time</span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{systemMetrics.apiResponseTime}ms</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium block">Active WS Connections</span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {systemMetrics.activeWsConnections.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium block">DB Connections</span>
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">{systemMetrics.dbConnections}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium block">Error Rate (5xx)</span>
            <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">{systemMetrics.errorRate}%</span>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Active Incidents" className="system-health-table-card">
          <SimpleTable
            columns={["Issue", "Service", "Severity", "Status"]}
            rows={incidents}
            renderRow={(incident) => (
              <tr key={incident.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-white">{incident.title}</td>
                <td className="px-6 py-2.5 text-sm text-slate-600 dark:text-slate-300">{incident.affectedService}</td>
                <td className="px-6 py-2.5"><StatusBadge status={incident.severity} /></td>
                <td className="px-6 py-2.5"><StatusBadge status={incident.status} /></td>
              </tr>
            )}
          />
        </SectionCard>

        <SectionCard title="Background Jobs" className="system-health-table-card">
          <SimpleTable
            columns={["Job Name", "Status", "Duration", "Next Run"]}
            rows={backgroundJobs}
            renderRow={(job) => (
              <tr key={job.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                <td className="px-6 py-2.5 text-sm font-semibold text-slate-900 dark:text-white">{job.name}</td>
                <td className="px-6 py-2.5"><StatusBadge status={job.status} /></td>
                <td className="px-6 py-2.5 text-sm text-slate-600 dark:text-slate-300">{job.duration}</td>
                <td className="px-6 py-2.5 text-sm text-slate-600 dark:text-slate-300">{job.nextRun}</td>
              </tr>
            )}
          />
        </SectionCard>
      </div>
    </div>
  );
}
