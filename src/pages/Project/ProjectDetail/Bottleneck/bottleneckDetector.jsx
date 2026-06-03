import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Brain, RefreshCw, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

import {
  getBottlenecksByProjectApi,
  requestResolveBottleneckApi,
  approveResolveBottleneckApi,
  analyzeIntelligenceDetectApi,
  detectIntelligenceDetectApi,
  generateIntelligenceDetectReportApi
} from '../../../../utils/Api/bottleneckApi';
import BottleneckCard from '../../../../components/projectPage/Bottleneck/bottleneckCard';
import SelectDropdown from '../../../../components/selectDropdown';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const severityClass = {
  CRITICAL: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",
  HIGH: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  LOW: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
};

const BottleneckDetector = () => {
  const { project, socket } = useOutletContext();
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [aiQuery, setAiQuery] = useState("Task nào đang bị kẹt trong project này?");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  // States for filters
  const [filterLevel, setFilterLevel] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterAssignee, setFilterAssignee] = useState("");

  const fetchBottlenecks = async () => {
    setLoading(true);
    try {
      const activeFilters = {};
      if (filterLevel) activeFilters.level = filterLevel;
      if (filterStatus) activeFilters.status = filterStatus;
      if (filterAssignee) activeFilters.assigneeId = filterAssignee;

      const res = await getBottlenecksByProjectApi(project._id, activeFilters);
      if (res && res.EC === 0) {
        setBottlenecks(res.data);
      }
    } catch (error) {
      console.error("Failed to load bottlenecks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?._id) fetchBottlenecks();
  }, [project?._id, filterLevel, filterStatus, filterAssignee]);

  useEffect(() => {
    if (!socket) return;

    const handleNewBottleneck = (newBottleneck) => {
      toast.warn(`New Bottleneck Detected: ${newBottleneck.name}`, { theme: "colored" });
      fetchBottlenecks();
    };

    socket.on('bottleneck_alert', handleNewBottleneck);
    return () => socket.off('bottleneck_alert', handleNewBottleneck);
  }, [socket, project?._id]);

  const handleRequestResolve = async (bottleneckId) => {
    try {
      const res = await requestResolveBottleneckApi(bottleneckId);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Request sent successfully!");
        fetchBottlenecks(); // Refresh list to update status
      } else {
        toast.error(res.EM || "Failed to make request.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.EM || "Error making resolve request.");
    }
  };

  const handleApproveResolve = async (bottleneckId, isApproved) => {
    try {
      const res = await approveResolveBottleneckApi(bottleneckId, isApproved);
      if (res && res.EC === 0) {
        toast.success(res.EM || "Action processed successfully!");
        fetchBottlenecks(); // Refresh list to update status
      } else {
        toast.error(res.EM || "Failed to process action.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.EM || "Error approving/rejecting request.");
    }
  };

  // Đếm các mục chưa resolve (unresolved hoặc đang chờ pending)
  const runIntelligenceDetect = async (mode = "analyze") => {
    if (!project?._id) return;
    setAiLoading(true);
    try {
      const payload = {
        query: aiQuery,
        projectId: project._id,
      };
      const res = mode === "report"
        ? await generateIntelligenceDetectReportApi({ ...payload, reportType: "detailed" })
        : mode === "detect"
          ? await detectIntelligenceDetectApi(payload)
          : await analyzeIntelligenceDetectApi(payload);

      if (res && res.EC === 0) {
        setAiResult(res.data);
        toast.success(res.EM || "Intelligence Detect analysis completed");
      } else {
        setAiResult(res?.data || null);
        toast.error(res?.EM || "Intelligence Detect analysis failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.EM || "Error running Intelligence Detect analysis.");
    } finally {
      setAiLoading(false);
    }
  };

  const activeCount = bottlenecks.filter(b => b.status !== 'resolved').length;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6 pb-20"
    >
      <motion.header variants={itemVariants} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Activity className="w-8 h-8 text-indigo-500" />
            Bottleneck Detector
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
            Real-time flow analysis to identify blockers and inefficiencies.
          </p>
        </div>
      </motion.header>

      <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Intelligence Detect AI Analysis</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          <input
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Vi du: Sprint nay co bottleneck khong?"
          />
          <div className="flex gap-2">
            <button
              onClick={() => runIntelligenceDetect("analyze")}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Analyze
            </button>
            <button
              onClick={() => runIntelligenceDetect("detect")}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              <Activity className="w-4 h-4" />
              Detect
            </button>
            <button
              onClick={() => runIntelligenceDetect("report")}
              disabled={aiLoading}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              Report
            </button>
          </div>
        </div>

        {aiResult && (
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-3">
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">Summary</p>
                <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{aiResult.summary}</p>
              </div>

              <div className="space-y-2">
                {(aiResult.bottlenecks || []).slice(0, 6).map((item, index) => (
                  <div key={`${item.type}-${item.affectedEntityId}-${index}`} className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.type}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.reason}</p>
                      </div>
                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-black ${severityClass[item.severity] || severityClass.LOW}`}>
                        {item.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 p-4">
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Recommendations</p>
              <div className="mt-3 space-y-3">
                {(aiResult.recommendations || []).slice(0, 5).map((item, index) => (
                  <div key={`${item.action}-${index}`} className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{item.action}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.expectedImpact}</p>
                  </div>
                ))}
                {(aiResult.recommendations || []).length === 0 && (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No action needed from the current rule results.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.section>


      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 shrink-0">
          <Activity className="w-4 h-4 text-indigo-500" />
          Filters:
        </div>

        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="w-48">
            <SelectDropdown
              value={filterLevel}
              options={[
                { value: "", label: "All Levels" },
                { value: "Highest", label: "Highest" },
                { value: "High", label: "High" },
                { value: "Medium", label: "Medium" },
                { value: "Low", label: "Low" },
                { value: "Lowest", label: "Lowest" },
              ]}
              onChange={setFilterLevel}
              placeholder="Level"
              size="sm"
            />
          </div>

          <div className="w-48">
            <SelectDropdown
              value={filterStatus}
              options={[
                { value: "", label: "All Statuses" },
                { value: "unresolved", label: "Unresolved" },
                { value: "pending", label: "Pending" },
                { value: "resolved", label: "Resolved" },
              ]}
              onChange={setFilterStatus}
              placeholder="Status"
              size="sm"
            />
          </div>

          <div className="w-56">
            <SelectDropdown
              value={filterAssignee}
              options={[
                { value: "", label: "All Assignees" },
                ...(project?.members || []).map(m => ({
                  value: m.accountId._id,
                  label: m.accountId.fullName
                }))
              ]}
              onChange={setFilterAssignee}
              placeholder="Assignee"
              size="sm"
            />
          </div>

          {(filterLevel || filterStatus || filterAssignee) && (
            <button
              onClick={() => {
                setFilterLevel("");
                setFilterStatus("");
                setFilterAssignee("");
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <motion.div variants={itemVariants} className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </motion.div>
      ) : bottlenecks.length === 0 ? (
        <motion.div variants={itemVariants} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 py-16 px-6 text-center rounded-2xl flex flex-col items-center justify-center">
          <ShieldAlert className="w-12 h-12 text-emerald-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No bottlenecks detected</h3>
          <p className="text-slate-500 max-w-md mx-auto mt-2">Your project workflow is running smoothly right now. System is actively listening for potential blockages.</p>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="text-sm font-semibold text-slate-500 mb-4 px-1">{activeCount} active issues require attention</div>
          <AnimatePresence>
            {bottlenecks.map((bn) => (
              <BottleneckCard
                key={bn._id}
                bn={bn}
                expanded={expandedId}
                onToggle={setExpandedId}
                onRequestResolve={handleRequestResolve}
                onApproveResolve={handleApproveResolve}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BottleneckDetector;
