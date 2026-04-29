import { useState } from "react";
import { UploadCloud, DownloadCloud, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const EXPORTS = [
  { id: 1, name: "Full System Backup", format: "JSON", size: "4.2 MB", date: "Today, 06:00 AM", status: "ready" },
  { id: 2, name: "Projects & Tasks", format: "CSV", size: "892 KB", date: "Yesterday, 11:30 PM", status: "ready" },
  { id: 3, name: "Event Logs — July 2025", format: "CSV", size: "1.8 MB", date: "2 Jul, 12:00 AM", status: "ready" },
  { id: 4, name: "Team Permissions Report", format: "XLSX", size: "340 KB", date: "Today, 09:15 AM", status: "processing" },
];

const statusConfig = {
  ready: { icon: CheckCircle2, color: "text-emerald-500", label: "Ready" },
  processing: { icon: Clock, color: "text-amber-500", label: "Processing" },
  failed: { icon: AlertCircle, color: "text-rose-500", label: "Failed" },
};

const IMPORT_FORMATS = [
  { label: "CSV (Tasks / Projects)", icon: "📄", accept: ".csv" },
  { label: "JSON (System Backup)", icon: "🗂️", accept: ".json" },
  { label: "XLSX (Spreadsheet)", icon: "📊", accept: ".xlsx" },
];

const ImportExportData = () => {
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState("export");

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Import / Export Data</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Transfer your data in and out of TASKA securely.</p>
      </div>

      {/* Tab switch */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
        {["export", "import"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
              tab === t
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {t === "export" ? "⬇ Export" : "⬆ Import"}
          </button>
        ))}
      </div>

      {tab === "export" && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {/* Quick export actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "All Projects", desc: "Projects, tasks, metadata", format: "CSV" },
              { label: "Event Logs", desc: "Last 90 days of events", format: "CSV" },
              { label: "Full Backup", desc: "Complete system snapshot", format: "JSON" },
            ].map((exp) => (
              <motion.div key={exp.label} variants={item}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors group">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-4">
                    <DownloadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">{exp.label}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{exp.desc}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{exp.format}</span>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      Export
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Export history */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Export History
                </h2>
              </div>
              {EXPORTS.map((exp, i) => {
                const StatusIcon = statusConfig[exp.status].icon;
                return (
                  <div
                    key={exp.id}
                    className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i !== EXPORTS.length - 1 ? "border-b border-slate-50 dark:border-slate-800/50" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{exp.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">{exp.date} · {exp.size}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">{exp.format}</span>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${statusConfig[exp.status].color}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusConfig[exp.status].label}
                    </div>
                    {exp.status === "ready" && (
                      <button className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors">
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}

      {tab === "import" && (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
          {/* Drop zone */}
          <motion.div variants={item}>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => { e.preventDefault(); setDragging(false); }}
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
                dragging
                  ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20"
                  : "border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UploadCloud className={`w-8 h-8 ${dragging ? "text-indigo-600" : "text-indigo-400"}`} />
              </div>
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-lg">Drop your file here</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">or <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">browse to upload</span></p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">Supported: CSV, JSON, XLSX — max 50 MB</p>
            </div>
          </motion.div>

          {/* Supported formats */}
          <motion.div variants={item}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
              <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Supported Import Formats</h2>
              <div className="space-y-3">
                {IMPORT_FORMATS.map((fmt) => (
                  <div key={fmt.label} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <span className="text-2xl">{fmt.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-slate-700 dark:text-slate-300">{fmt.label}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500">Accepts {fmt.accept} files</p>
                    </div>
                    <button className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 transition-colors">
                      Download Template
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

export default ImportExportData;