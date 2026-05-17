import { useState } from "react";
import { Zap, TrendingDown, Clock, AlertCircle, ChevronRight, RefreshCw, Brain } from "lucide-react";
import { motion } from "framer-motion";
import {
  bottleneckContainer,
  bottleneckItem,
  summaryItem,
  summaryContainer,
  filterItem,
  filterContainer,
  buttonVariants,
} from "../../../utils/motionVariants";

const BOTTLENECKS = [
  {
    id: 1,
    title: "Inventory Sync Delay",
    system: "Supply Chain",
    impact: "High",
    delay: "45m",
    confidence: 94,
    trend: "worsening",
    description: "Replica-2 latency spike is causing downstream inventory reads to queue up. Approx. 3,200 records affected.",
    suggestion: "Promote replica-3 to primary. Estimated resolution: 8 min.",
    color: "rose",
  },
  {
    id: 2,
    title: "Manual Approval Gate",
    system: "Finance Workflow",
    impact: "Medium",
    delay: "2h 10m",
    confidence: 88,
    trend: "stable",
    description: "Invoice approvals are blocked at the finance manager step. 14 invoices pending over 2 hours.",
    suggestion: "Auto-approve invoices under $500 based on historical approval rate of 99.4%.",
    color: "amber",
  },
  {
    id: 3,
    title: "PDF Generation Timeout",
    system: "Reporting Engine",
    impact: "Low",
    delay: "12m",
    confidence: 76,
    trend: "improving",
    description: "Large report batches (>500 pages) are timing out at 30s. Affects 3 scheduled reports.",
    suggestion: "Split batches into chunks of 200 pages. Add async queue for report delivery.",
    color: "indigo",
  },
  {
    id: 4,
    title: "Auth Token Refresh Storm",
    system: "AuthService",
    impact: "Medium",
    delay: "6m",
    confidence: 91,
    trend: "worsening",
    description: "Session expiry misconfiguration is causing simultaneous token refresh from ~800 clients.",
    suggestion: "Add jitter (0–30s) to token refresh schedule. Deploy hotfix v2.3.1.",
    color: "amber",
  },
];

const impactColors = {
  High: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
  Medium: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Low: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
};

const trendIcon = {
  worsening: <TrendingDown className="w-3 h-3 text-rose-500" />,
  stable: <span className="w-3 h-0.5 bg-slate-400 rounded-full inline-block" />,
  improving: <TrendingDown className="w-3 h-3 text-emerald-500 rotate-180" />,
};

function BottleneckCard({ bn, expanded, onToggle }) {
  return (
    <motion.div variants={bottleneckItem}>
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-sm transition-all ${
          expanded
            ? "border-indigo-300 dark:border-indigo-700 shadow-indigo-100 dark:shadow-none"
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
        }`}
      >
        <button
          className="w-full flex items-start gap-4 p-5 text-left"
          onClick={onToggle}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${bn.color}-100 dark:bg-${bn.color}-900/30`}>
            <Zap className={`w-5 h-5 text-${bn.color}-500`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-slate-900 dark:text-slate-100">{bn.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${impactColors[bn.impact]}`}>
                {bn.impact}
              </span>
              <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                {trendIcon[bn.trend]}
                {bn.trend}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span>{bn.system}</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {bn.delay} delay</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="flex items-center gap-1"><Brain className="w-3 h-3" /> {bn.confidence}% confidence</span>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-slate-400 mt-1 shrink-0 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>

        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">{bn.description}</p>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5">AI Suggestion</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{bn.suggestion}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors">
                Run Diagnostics
              </button>
              <button className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Apply Fix
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

const BottleneckDetector = () => {
  const [expanded, setExpanded] = useState(null);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "High", "Medium", "Low"];
  const filtered = filter === "All" ? BOTTLENECKS : BOTTLENECKS.filter((b) => b.impact === filter);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Bottleneck Detector</h1>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md border border-indigo-200 dark:border-indigo-800">ML</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400">Machine-learning powered detection of process inefficiencies and blockages.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors self-start sm:self-auto">
          <RefreshCw className="w-4 h-4" />
          Re-scan Now
        </button>
      </div>

      {/* Summary row */}
      <motion.div variants={summaryContainer} initial="hidden" animate="show" className="grid grid-cols-3 gap-4">
        {[
          { label: "Critical", count: 1, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900" },
          { label: "Medium", count: 2, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900" },
          { label: "Low", count: 1, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900" },
        ].map((s) => (
          <motion.div key={s.label} variants={summaryItem} className={`rounded-2xl p-5 border ${s.bg}`}>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
            <p className={`text-4xl font-bold mt-1 ${s.color}`}>{s.count}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter + list */}
      <div className="space-y-3">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="flex items-center gap-2">
          <motion.div variants={filterContainer} initial="hidden" animate="show" className="flex items-center gap-2">
            {filters.map((f) => (
              <motion.button
                key={f}
                variants={filterItem}
                onClick={() => setFilter(f)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                }`}
              >
                {f}
              </motion.button>
            ))}
          </motion.div>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="ml-auto text-xs text-slate-400 dark:text-slate-500">{filtered.length} detected</motion.span>
        </motion.div>

        <motion.div variants={bottleneckContainer} initial="hidden" animate="show" className="space-y-3">
          {filtered.map((bn) => (
            <BottleneckCard
              key={bn.id}
              bn={bn}
              expanded={expanded === bn.id}
              onToggle={() => setExpanded(expanded === bn.id ? null : bn.id)}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default BottleneckDetector;