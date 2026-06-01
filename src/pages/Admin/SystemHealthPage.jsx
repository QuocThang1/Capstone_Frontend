import { useCallback, useEffect, useState } from "react";
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
import { App, Button, Empty, Spin } from "antd";
import SectionCard from "@/components/adminPage/SectionCard";
import StatusBadge from "@/components/adminPage/StatusBadge";
import { getSystemHealthApi } from "@/utils/Api/adminApi";
import socket from "@/utils/socket";
import { cn } from "@/lib/utils";

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
  const measured = Number.isFinite(value);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white">{measured ? `${value}%` : "Not Measured"}</span>
      </div>
      <div className="h-1.5 rounded-full bg-indigo-100 dark:bg-indigo-950/50 overflow-hidden">
        <div
          className={cn("h-full rounded-full", tone === "amber" ? "bg-amber-500" : "bg-indigo-600 dark:bg-indigo-500")}
          style={{ width: `${measured ? value : 0}%` }}
        />
      </div>
    </div>
  );
}

function SimpleTable({ columns, rows, renderRow, emptyText }) {
  if (!rows.length) return <Empty description={emptyText} />;
  return (
    <div className="-mx-6 -mb-6 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800">
            {columns.map((column) => <th key={column} className="px-6 py-3 text-left text-sm font-semibold text-slate-500 dark:text-slate-400">{column}</th>)}
          </tr>
        </thead>
        <tbody>{rows.map(renderRow)}</tbody>
      </table>
    </div>
  );
}

const metricText = (value, suffix = "") => value === null || value === undefined ? "Not Measured" : `${value}${suffix}`;

export default function SystemHealthPage() {
  const { message } = App.useApp();
  const [health, setHealth] = useState({ services: [], metrics: {}, incidents: [], backgroundJobs: [] });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHealth = useCallback(async ({ notify = false } = {}) => {
    setIsRefreshing(true);
    const res = await getSystemHealthApi();
    if (res?.EC === 0) {
      setHealth(res.data);
      if (notify) message.success("System status refreshed");
    } else {
      message.error(res?.EM || "Failed to load system health");
    }
    setLoading(false);
    setIsRefreshing(false);
  }, [message]);

  useEffect(() => {
    loadHealth();
  }, [loadHealth]);

  useEffect(() => {
    const handleHealthUpdate = (snapshot) => {
      setHealth(snapshot);
      setLoading(false);
    };
    const joinHealthRoom = () => {
      socket.emit("join_admin_system_health");
    };

    socket.on("system_health_updated", handleHealthUpdate);
    socket.on("connect", joinHealthRoom);
    if (socket.connected) {
      joinHealthRoom();
    } else {
      socket.connect();
    }

    return () => {
      socket.emit("leave_admin_system_health");
      socket.off("connect", joinHealthRoom);
      socket.off("system_health_updated", handleHealthUpdate);
    };
  }, []);

  if (loading) return <div className="flex min-h-[420px] items-center justify-center"><Spin size="large" /></div>;

  const { services, metrics, incidents, backgroundJobs, checkedAt } = health;
  const hasIssues = incidents.length > 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Health</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Runtime monitoring from the active TASKA backend process.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">Last checked: {checkedAt ? new Date(checkedAt).toLocaleTimeString() : "-"}</span>
          <Button onClick={() => loadHealth({ notify: true })} disabled={isRefreshing}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} /> Refresh
          </Button>
        </div>
      </div>

      <div className={cn("p-5 rounded-xl border flex items-start gap-4", hasIssues ? "bg-amber-50/60 border-amber-200" : "bg-emerald-50/70 border-emerald-200")}>
        <AlertCircle className={cn("w-5 h-5 shrink-0 mt-0.5", hasIssues ? "text-amber-600" : "text-emerald-600")} />
        <div>
          <h3 className="font-bold text-base">{hasIssues ? "Runtime anomaly detected" : "Measured services are operational"}</h3>
          <p className="mt-1 text-sm text-slate-600">Unavailable integrations are marked explicitly instead of using estimated values.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {services.map((service) => {
          const Icon = iconMap[service.icon] || Server;
          return (
            <div key={service.id} className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[150px]">
              <div className="flex justify-between items-start mb-5">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" /></div>
                <StatusBadge status={service.status} />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white mb-3">{service.name}</h4>
              <div className="mt-auto grid grid-cols-2 gap-5 text-xs">
                <div><span className="text-slate-500 block">Usage</span><span className="font-mono">{metricText(service.usagePercent, "%")}</span></div>
                <div><span className="text-slate-500 block">Runtime Detail</span><span className="font-mono">{service.responseTime}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <SectionCard title="Core Runtime Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-x-9 gap-y-7">
          <MetricBar label="Process CPU Usage" value={metrics.cpu} />
          <MetricBar label={`Process Memory (${metrics.memoryRssMb || 0} MB RSS)`} value={metrics.memory} tone="amber" />
          <MetricBar label="Disk I/O" value={metrics.disk} />
          <div><span className="text-sm text-slate-500 block">API Snapshot Time</span><span className="text-2xl font-bold font-mono">{metricText(metrics.apiResponseTime, "ms")}</span></div>
          <div><span className="text-sm text-slate-500 block">Active WS Connections</span><span className="text-2xl font-bold font-mono">{metricText(metrics.activeWsConnections)}</span></div>
          <div><span className="text-sm text-slate-500 block">DB Connections</span><span className="text-2xl font-bold font-mono">{metricText(metrics.dbConnections)}</span></div>
          <div><span className="text-sm text-slate-500 block">Error Rate (5xx)</span><span className="text-2xl font-bold font-mono">{metricText(metrics.errorRate, "%")}</span></div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <SectionCard title="Active Runtime Incidents">
          <SimpleTable columns={["Issue", "Service", "Severity", "Status"]} rows={incidents} emptyText="No active runtime incidents" renderRow={(incident) => (
            <tr key={incident.id} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-6 py-2.5 text-sm font-semibold">{incident.title}</td><td className="px-6 py-2.5 text-sm">{incident.affectedService}</td>
              <td className="px-6 py-2.5"><StatusBadge status={incident.severity} /></td><td className="px-6 py-2.5"><StatusBadge status={incident.status} /></td>
            </tr>
          )} />
        </SectionCard>
        <SectionCard title="Registered Background Jobs">
          <SimpleTable columns={["Job Name", "Status", "Cron Schedule"]} rows={backgroundJobs} emptyText="No background jobs registered" renderRow={(job) => (
            <tr key={job.id} className="border-b border-slate-100 dark:border-slate-800">
              <td className="px-6 py-2.5 text-sm font-semibold">{job.name}</td><td className="px-6 py-2.5"><StatusBadge status={job.status} /></td><td className="px-6 py-2.5 text-sm font-mono">{job.schedule}</td>
            </tr>
          )} />
        </SectionCard>
      </div>
    </div>
  );
}
