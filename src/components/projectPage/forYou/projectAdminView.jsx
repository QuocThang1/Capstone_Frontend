import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderKanban, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProjectsApi } from "@/utils/Api/projectApi";
import { getUnresolvedBottleneckCountByUserApi } from "@/utils/Api/bottleneckApi";
import { getTop3EarliestDueIssuesApi } from "@/utils/Api/issueApi";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 22 } },
};

const Card = ({ children, className = "" }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      {children}
    </div>
  );
};

const ProjectAdminView = () => {
  const [projects, setProjects] = useState([]);
  const [bottlenecksData, setBottlenecksData] = useState([]);
  const [issuesData, setIssuesData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const resProjects = await getAllProjectsApi({ limit: 100 });
        if (resProjects && resProjects.EC === 0) {
          const data = Array.isArray(resProjects.data) ? resProjects.data : (resProjects.data?.projects || []);
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }

      try {
        const resBottlenecks = await getUnresolvedBottleneckCountByUserApi();
        if (resBottlenecks && resBottlenecks.EC === 0) {
          setBottlenecksData(resBottlenecks.data || []);
        }
      } catch (error) {
        console.error("Error fetching bottlenecks:", error);
      }

      try {
        const resIssues = await getTop3EarliestDueIssuesApi();
        if (resIssues && resIssues.EC === 0) {
          setIssuesData(resIssues.data || []);
        }
      } catch (error) {
        console.error("Error fetching upcoming issues:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const totalBottlenecks = bottlenecksData.reduce((sum, b) => sum + (b.count || 0), 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
      {/* My Active Projects */}
      <motion.div variants={item}>
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-bl-full transition-transform group-hover:scale-125" />
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
            <FolderKanban className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">My Projects</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">{projects.length}</span>
            <span className="text-sm text-emerald-600 font-medium">active</span>
          </div>
          <Link to="/projects/management" className="mt-4 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
            View all projects <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Card>
      </motion.div>

      {/* Open Bottlenecks */}
      <motion.div variants={item}>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 shadow-lg shadow-rose-500/20 text-white relative overflow-hidden group flex flex-col">
          <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:rotate-12">
            <AlertCircle className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-rose-100 text-sm font-medium">Open Bottlenecks</p>
          <div className="mt-2 flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold">{totalBottlenecks}</span>
            <span className="text-sm text-rose-100">Total Unresolved</span>
          </div>

          <div className="flex-1 mt-2 space-y-2 relative z-10 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
            {bottlenecksData.length > 0 ? bottlenecksData.map(b => (
              <div key={b.project?._id || b._id} className="text-sm text-rose-100 flex justify-between items-center bg-rose-700/30 p-2 rounded-lg backdrop-blur-sm border border-rose-400/20">
                <span className="truncate mr-2 font-medium">{b.project?.name || "Unknown Project"}</span>
                <span className="font-bold bg-rose-500/50 px-2 py-0.5 rounded text-white">{b.count}</span>
              </div>
            )) : (
              <div className="text-sm text-rose-200/70 italic mt-2">No active bottlenecks.</div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Upcoming Deadlines */}
      <motion.div variants={item}>
        <Card className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Upcoming Deadlines</h3>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {issuesData.length > 0 ? issuesData.map((d) => (
              <Link
                key={d._id}
                to={`/projects/${d.projectId?._id || d.projectId}/list?issueId=${d._id}`}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="min-w-0 flex-1 mr-3">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{d.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{d.projectId?.name || "Project"}</p>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className={`font-bold text-sm text-slate-700 dark:text-slate-300`}>
                    {new Date(d.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            )) : (
              <div className="text-sm text-slate-500 text-center mt-6">No upcoming deadlines.</div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default ProjectAdminView;
