import { useState } from "react";
import { Settings2, Plus, Zap, PlayCircle, PauseCircle, Trash2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const INITIAL_RULES = [
  {
    id: 1,
    name: "Auto-close Stale Tickets",
    trigger: "Task inactive for 30 days",
    action: "Set status → Closed, notify assignee",
    enabled: true,
    runs: 142,
    lastRun: "2h ago",
    category: "tasks",
  },
  {
    id: 2,
    name: "High-Priority Escalation",
    trigger: "Task priority = Critical AND unassigned > 1h",
    action: "Assign to on-call lead, send Slack alert",
    enabled: true,
    runs: 18,
    lastRun: "Yesterday",
    category: "alerts",
  },
  {
    id: 3,
    name: "Sprint Auto-kickoff",
    trigger: "Every Monday at 9:00 AM",
    action: "Create Sprint board, assign unfinished tasks",
    enabled: false,
    runs: 8,
    lastRun: "7 days ago",
    category: "schedule",
  },
  {
    id: 4,
    name: "Invoice Auto-Approve",
    trigger: "Invoice amount < $500 AND sender is whitelisted",
    action: "Approve invoice, update finance ledger",
    enabled: true,
    runs: 1204,
    lastRun: "4m ago",
    category: "finance",
  },
  {
    id: 5,
    name: "Weekly Digest Email",
    trigger: "Every Friday at 5:00 PM",
    action: "Generate summary report → email to all admins",
    enabled: true,
    runs: 24,
    lastRun: "3 days ago",
    category: "schedule",
  },
];

const categoryConfig = {
  tasks: { color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400", label: "Tasks" },
  alerts: { color: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400", label: "Alerts" },
  schedule: { color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400", label: "Schedule" },
  finance: { color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400", label: "Finance" },
};

function Toggle({ enabled, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${enabled ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-700"}`}
      style={{ height: "22px" }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow-sm transition-transform ${enabled ? "translate-x-[18px]" : "translate-x-0"}`}
        style={{ width: "18px", height: "18px" }}
      />
    </button>
  );
}

const AutomationRules = () => {
  const [rules, setRules] = useState(INITIAL_RULES);
  const [filter, setFilter] = useState("all");

  const categories = ["all", "tasks", "alerts", "schedule", "finance"];

  const filtered = filter === "all" ? rules : rules.filter((r) => r.category === filter);

  const toggleRule = (id) => {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r));
  };

  const deleteRule = (id) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const enabledCount = rules.filter((r) => r.enabled).length;
  const totalRuns = rules.reduce((a, r) => a + r.runs, 0);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Automation Rules</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Trigger-based workflows that run automatically across your system.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Rule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Rules", value: enabledCount, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { label: "Total Executions", value: totalRuns.toLocaleString(), color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { label: "Rules Paused", value: rules.length - enabledCount, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-50 dark:bg-slate-800" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm`}>
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
              <Zap className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-3xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filter + list */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                filter === c
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700"
              }`}
            >
              {c === "all" ? "All" : categoryConfig[c]?.label}
            </button>
          ))}
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {filtered.map((rule) => (
            <motion.div key={rule.id} variants={item}>
              <div className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm transition-all hover:shadow-md ${rule.enabled ? "border-slate-200 dark:border-slate-800" : "border-slate-100 dark:border-slate-800/50 opacity-60"}`}>
                <div className="flex items-start gap-4 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${rule.enabled ? "bg-indigo-100 dark:bg-indigo-900/30" : "bg-slate-100 dark:bg-slate-800"}`}>
                    <Settings2 className={`w-5 h-5 ${rule.enabled ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{rule.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${categoryConfig[rule.category].color}`}>
                        {categoryConfig[rule.category].label}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase pt-0.5 w-12 shrink-0">Trigger</span>
                        <span className="text-slate-600 dark:text-slate-400">{rule.trigger}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase pt-0.5 w-12 shrink-0">Action</span>
                        <span className="text-slate-600 dark:text-slate-400">{rule.action}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                      <span>{rule.runs.toLocaleString()} runs</span>
                      <span className="text-slate-200 dark:text-slate-700">•</span>
                      <span>Last: {rule.lastRun}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <Toggle enabled={rule.enabled} onToggle={() => toggleRule(rule.id)} />
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 dark:text-slate-600">
              <Settings2 className="w-10 h-10 opacity-30 mx-auto mb-3" />
              <p className="text-sm font-medium">No rules in this category</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AutomationRules;