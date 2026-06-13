import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderKanban, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllProjectsApi } from "@/utils/Api/projectApi";

const RecentProjectsSection = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState(null);

  const projectColors = [
    "from-indigo-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-purple-500 to-violet-600",
  ];

  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const res = await getAllProjectsApi({ limit: 3 });
        if (res && res.EC === 0) {
          const data = Array.isArray(res.data) ? res.data : (res.data?.projects || []);
          // Chỉ lấy 3 project mới nhất
          setRecentProjects(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching recent projects:", error);
        setRecentProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentProjects();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
      >
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
    >
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Projects</h2>
        <Link to="/projects/management" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          View all spaces
        </Link>
      </div>

      {recentProjects.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {recentProjects.map((project, index) => {
            const colorClass = projectColors[index % projectColors.length];
            const projectId = project._id || project.id;

            return (
              <motion.div
                key={projectId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <Link to={`/projects/${projectId}/overview`} className="block">
                  <div className={`bg-gradient-to-r ${colorClass} rounded-lg p-0.5 hover:scale-[1.02] transition-transform duration-200 cursor-pointer`}>
                    {/* Thay đổi bg-slate-800 thành bg-white để phù hợp với giao diện sáng */}
                    <div className="bg-white dark:bg-slate-900 rounded-md p-4">
                      <div className="flex items-center gap-4">
                        <div className={`bg-gradient-to-br ${colorClass} rounded-lg p-2 w-12 h-12 flex items-center justify-center flex-shrink-0 text-white`}>
                          <FolderKanban className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* Đổi màu chữ sang text-slate-900 để dễ nhìn trên nền trắng */}
                          <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{project.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
                            {project.description || "Team-managed software"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default RecentProjectsSection;
