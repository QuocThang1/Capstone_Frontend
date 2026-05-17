import { useState } from "react";
import { motion } from "framer-motion";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Zap, ArrowUpRight, Filter, DownloadCloud, Activity } from "lucide-react";
import {
  containerVariants,
  itemVariants,
  cardVariants,
  headerVariants,
  eventItemVariants,
  buttonVariants,
  gaugeVariants,
} from "../../../utils/motionVariants";

ChartJS.register(ArcElement, Tooltip, Legend);

// Mock hook for events data
const useListEvents = () => ({
  data: [
    { id: 1, type: "success", message: "Database backup completed", source: "System", timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 2, type: "warning", message: "High memory usage detected on server 3", source: "Monitor", timestamp: new Date(Date.now() - 15 * 60000) },
    { id: 3, type: "success", message: "API deployment finished", source: "CI/CD", timestamp: new Date(Date.now() - 30 * 60000) },
    { id: 4, type: "error", message: "Failed to connect to cache", source: "Redis", timestamp: new Date(Date.now() - 45 * 60000) },
  ]
});

const OverviewDashboard = () => {
  const { data: events = [] } = useListEvents();
  const [timeframe, setTimeframe] = useState("24h");

  const gaugeData = {
    labels: ["Health", "Risk"],
    datasets: [{
      data: [87, 13],
      backgroundColor: ["#4F46E5", "#E2E8F0"],
      borderWidth: 0,
      circumference: 180,
      rotation: 270,
      cutout: "80%",
      borderRadius: 10,
    }],
  };

  const bottlenecks = [
    { id: 1, title: "Inventory Sync Delay", impact: "High", delay: "45m", textColor: "text-rose-500", bg: "bg-rose-500/10" },
    { id: 2, title: "Manual Approval Required", impact: "Medium", delay: "2h", textColor: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <motion.div
      className="space-y-6 pb-10 p-2"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4" variants={itemVariants}>
        <motion.div variants={headerVariants} initial="hidden" animate="visible">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Process Overview</h1>
          <motion.p className="mt-1 text-slate-500 dark:text-slate-400">Real-time intelligence on workflow health and bottlenecks.</motion.p>
        </motion.div>
        <motion.div className="flex items-center gap-3" variants={itemVariants}>
          <motion.div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            {["1h", "24h", "7d", "30d"].map((t, idx) => (
              <motion.button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  timeframe === t
                    ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm"
                    : "text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: idx * 0.05 }}
              >
                {t}
              </motion.button>
            ))}
          </motion.div>
          <motion.button
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <DownloadCloud className="w-4 h-4" />
            Generate Report
          </motion.button>
        </motion.div>
      </motion.div>

      {/* 3-Column Panels */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Continuity Score Gauge */}
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.div className="w-full flex justify-between items-start mb-2">
            <motion.h3 className="font-semibold text-slate-800 dark:text-slate-200">Continuity Score</motion.h3>
            <motion.span
              className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-1 rounded-md"
              whileHover={{ scale: 1.1 }}
            >
              <ArrowUpRight className="w-3 h-3 mr-1" /> +2.4%
            </motion.span>
          </motion.div>
          <motion.p className="text-xs text-slate-400 dark:text-slate-500 self-start mb-4">Overall System Health</motion.p>
          <motion.div className="relative w-48 h-48" variants={gaugeVariants} initial="hidden" animate="visible">
            <Doughnut
              data={gaugeData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
              }}
            />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.5 }}
            >
              <motion.span
                className="text-4xl font-bold text-slate-900 dark:text-slate-100"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.6 }}
              >
                87%
              </motion.span>
              <motion.span className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest mt-1">Excellent</motion.span>
            </motion.div>
          </motion.div>
          <motion.p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-3 max-w-[180px]">System is performing optimally with minor localized delays.</motion.p>
        </motion.div>

        {/* Active Bottlenecks */}
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.div className="flex items-center justify-between mb-6">
            <motion.h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              Active Bottlenecks
            </motion.h3>
            <motion.button
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Filter className="w-4 h-4" />
            </motion.button>
          </motion.div>
          <motion.p className="text-xs text-slate-400 dark:text-slate-500 -mt-4 mb-4">ML Detected Anomalies</motion.p>

          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {bottlenecks.map((bn, idx) => (
              <motion.div
                key={bn.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors bg-slate-50/50 dark:bg-slate-800/30"
                variants={itemVariants}
                whileHover={{ y: -4, backgroundColor: "rgba(99, 102, 241, 0.05)" }}
              >
                <motion.div className="flex justify-between items-start">
                  <motion.div>
                    <motion.h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{bn.title}</motion.h4>
                    <motion.p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                      Impact: <motion.span className={`font-semibold ${bn.textColor}`}>{bn.impact}</motion.span>
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className={`px-2.5 py-1 rounded-md text-xs font-bold ${bn.bg} ${bn.textColor}`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {bn.delay} delay
                  </motion.div>
                </motion.div>
                <motion.div
                  className="mt-3 flex gap-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.2 }}
                >
                  <motion.button
                    className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-slate-700 dark:text-slate-300"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Analyze
                  </motion.button>
                  <motion.button
                    className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    Resolve
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Live Event Stream */}
        <motion.div
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[420px]"
          variants={cardVariants}
          whileHover="hover"
        >
          <motion.div className="flex items-center justify-between mb-2">
            <motion.h3 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Live Event Stream
            </motion.h3>
            <motion.span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <motion.span
                className="w-2 h-2 bg-emerald-500 rounded-full"
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              Connected
            </motion.span>
          </motion.div>
          <motion.p className="text-xs text-slate-400 dark:text-slate-500 mb-4">System Activity</motion.p>

          <motion.div
            className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {events.length > 0 ? (
              events.slice(0, 6).map((ev, idx) => (
                <motion.div
                  key={ev.id}
                  className="flex gap-3 text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  variants={eventItemVariants}
                  custom={idx}
                  whileHover="hover"
                >
                  <motion.div className="flex flex-col items-center pt-1.5">
                    <motion.div
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        ev.type === "error" ? "bg-rose-500" :
                        ev.type === "warning" ? "bg-amber-500" :
                        ev.type === "success" ? "bg-emerald-500" :
                        "bg-indigo-500"
                      }`}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                  </motion.div>
                  <motion.div>
                    <motion.p className="text-slate-700 dark:text-slate-300 font-medium leading-snug">{ev.message}</motion.p>
                    <motion.div className="flex gap-2 text-xs text-slate-400 dark:text-slate-500 mt-1">
                      <motion.span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-medium">{ev.source}</motion.span>
                      <span>•</span>
                      <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))
            ) : (
              <motion.div
                className="h-full flex flex-col items-center justify-center text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 12 }}
              >
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                  <Activity className="w-8 h-8 opacity-20 mb-2" />
                </motion.div>
                <motion.p className="text-sm">Waiting for events...</motion.p>
              </motion.div>
            )}
          </motion.div>
          <motion.button
            className="w-full mt-4 py-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:bg-indigo-900/40 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            View All Events
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Historical Flow Analysis */}
      <motion.div
        className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 flex justify-between items-center"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ type: "spring", stiffness: 80, damping: 12, delay: 0.5 }}
      >
        <motion.div>
          <motion.h3 className="font-semibold text-slate-800 dark:text-slate-200">Historical Flow Analysis</motion.h3>
          <motion.p
            className="text-sm text-slate-500 dark:text-slate-400 mt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.6 }}
          >
            Review system throughput over the last 30 days to identify recurring patterns.
          </motion.p>
        </motion.div>
        <motion.button
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          Configure View
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default OverviewDashboard;