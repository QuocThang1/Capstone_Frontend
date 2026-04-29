import { useState } from "react";
import { ClipboardList, Search, DownloadCloud, Filter } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
const item = { hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } };

const base = new Date();
const ts = (minAgo) => new Date(base.getTime() - minAgo * 60000).toISOString();

const LOGS = [
  { id: 1, user: "Peo", initials: "P", color: "bg-indigo-600", action: "Role Changed", resource: "Aisha Patel → PROJECT_ADMIN", category: "auth", ts: ts(2) },
  { id: 2, user: "Sarah Chen", initials: "SC", color: "bg-emerald-500", action: "Project Created", resource: "Q4 Expansion Plan (QEP)", category: "project", ts: ts(14) },
  { id: 3, user: "Marcus Rivera", initials: "MR", color: "bg-violet-500", action: "Report Exported", resource: "System Health Report — Jul 2025", category: "report", ts: ts(28) },
  { id: 4, user: "Jake Thompson", initials: "JT", color: "bg-amber-500", action: "Task Deleted", resource: "Deploy v2.3.1 (#TKT-441)", category: "task", ts: ts(55) },
  { id: 5, user: "Peo", initials: "P", color: "bg-indigo-600", action: "Automation Rule Enabled", resource: "Auto-close stale tickets after 30d", category: "automation", ts: ts(72) },
  { id: 6, user: "Lena Müller", initials: "LM", color: "bg-rose-500", action: "Settings Changed", resource: "Notification preferences updated", category: "settings", ts: ts(105) },
  { id: 7, user: "Aisha Patel", initials: "AP", color: "bg-cyan-500", action: "Project Edited", resource: "Marketing Campaign — description updated", category: "project", ts: ts(133) },
  { id: 8, user: "Sarah Chen", initials: "SC", color: "bg-emerald-500", action: "Member Invited", resource: "daniel@taska.io → USER role", category: "auth", ts: ts(210) },
  { id: 9, user: "Peo", initials: "P", color: "bg-indigo-600", action: "API Key Generated", resource: "webhook-prod-v2 (read-only)", category: "settings", ts: ts(390) },
  { id: 10, user: "Marcus Rivera", initials: "MR", color: "bg-violet-500", action: "Task Created", resource: "Finalize Q3 OKRs (#TKT-502)", category: "task", ts: ts(480) },
  { id: 11, user: "Jake Thompson", initials: "JT", color: "bg-amber-500", action: "Login", resource: "IP: 192.168.1.44 — Chrome/macOS", category: "auth", ts: ts(510) },
  { id: 12, user: "Lena Müller", initials: "LM", color: "bg-rose-500", action: "Project Archived", resource: "Legacy Migration Sprint (LMS)", category: "project", ts: ts(720) },
];

const categoryConfig = {
  auth: { label: "Auth", color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" },
  project: { label: "Project", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  task: { label: "Task", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
  report: { label: "Report", color: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" },
  automation: { label: "Automation", color: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400" },
  settings: { label: "Settings", color: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
};

const AuditLogs = () => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const categories = ["all", "auth", "project", "task", "report", "automation", "settings"];

  const filtered = LOGS.filter((l) => {
    const matchSearch =
      l.user.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || l.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Audit Logs</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">A tamper-evident record of all significant actions across the platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto">
          <DownloadCloud className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by user, action, or resource..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                categoryFilter === c
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {c === "all" ? "All" : categoryConfig[c]?.label}
            </button>
          ))}
        </div>
      </div>

      {/* Log list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <div className="grid grid-cols-12 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <div className="col-span-2">User</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-4">Action</div>
            <div className="col-span-3 hidden md:block">Resource</div>
            <div className="col-span-1 text-right">Time</div>
          </div>
        </div>
        <motion.div variants={container} initial="hidden" animate="show">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <ClipboardList className="w-10 h-10 opacity-20 mb-3" />
              <p className="text-sm font-medium">No logs match your filters</p>
            </div>
          ) : (
            filtered.map((log, i) => (
              <motion.div
                key={log.id}
                variants={item}
                className={`grid grid-cols-12 items-center px-6 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i !== filtered.length - 1 ? "border-b border-slate-50 dark:border-slate-800/50" : ""}`}
              >
                <div className="col-span-2 flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full ${log.color} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                    {log.initials}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate hidden sm:block">{log.user}</span>
                </div>
                <div className="col-span-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${categoryConfig[log.category]?.color}`}>
                    {categoryConfig[log.category]?.label}
                  </span>
                </div>
                <div className="col-span-4 text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{log.action}</div>
                <div className="col-span-3 text-xs text-slate-400 dark:text-slate-500 truncate hidden md:block">{log.resource}</div>
                <div className="col-span-1 text-right text-xs text-slate-400 dark:text-slate-500 font-mono">
                  {format(new Date(log.ts), "HH:mm")}
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
            Showing {filtered.length} of {LOGS.length} entries
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogs;
