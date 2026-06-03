import { motion } from "framer-motion";
import { useEffect, useState, useContext } from "react";
import { FolderKanban, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProjectContext } from "@/context/project.context";
import { getMyIssuesApi } from "@/utils/Api/issueApi";
import { getStarredProjectsApi } from "@/utils/Api/accountApi";
import { getAllProjectsApi } from "@/utils/Api/projectApi";
import Spinner from "@/components/spinner";
import SelectDropdown from "@/components/selectDropdown";

const UserActivitySection = () => {
  const { allProjects, pagination, fetchAllProjects, loading } = useContext(ProjectContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Assigned to me");
  const tabs = ["Worked on", "Starred", "Assigned to me"];

  const [myIssues, setMyIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState("all");

  const [starredProjects, setStarredProjects] = useState([]);
  const [loadingStarred, setLoadingStarred] = useState(false);

  const [fullProjects, setFullProjects] = useState([]);

  useEffect(() => {
    if (activeTab === "Worked on") {
      fetchAllProjects({ page: 1, limit: 5 });
    } else if (activeTab === "Assigned to me") {
      fetchMyIssues();
      fetchAllProjectsForDropdown();
    } else if (activeTab === "Starred") {
      fetchStarredProjects();
    }
  }, [activeTab]);

  const fetchMyIssues = async () => {
    setLoadingIssues(true);
    try {
      const res = await getMyIssuesApi();
      if (res && res.EC === 0) {
        setMyIssues(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching my issues:", error);
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchStarredProjects = async () => {
    setLoadingStarred(true);
    try {
      const res = await getStarredProjectsApi();
      if (res && res.EC === 0) {
        setStarredProjects(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching starred projects:", error);
    } finally {
      setLoadingStarred(false);
    }
  };

  const fetchAllProjectsForDropdown = async () => {
    try {
      const res = await getAllProjectsApi({ limit: 1000 });
      if (res && res.EC === 0) {
        setFullProjects(res.data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching full projects:", error);
    }
  };

  const filteredIssues = selectedProjectId === "all"
    ? myIssues
    : myIssues.filter(issue => issue.projectId?._id === selectedProjectId || issue.projectId === selectedProjectId);

  const projectColors = [
    "from-indigo-500 to-indigo-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-purple-500 to-violet-600",
  ];

  // Chuẩn bị options cho SelectDropdown từ danh sách fullProjects
  const projectOptions = [
    { value: "all", label: "All Projects" },
    ...fullProjects.map(p => ({ value: p._id, label: p.name }))
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
      className="mt-12"
    >
      {/* Secondary Tab Navigation */}
      <div className="flex gap-6 relative overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[14px] font-medium transition-colors pb-3 whitespace-nowrap cursor-pointer ${activeTab === tab
              ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[1px] relative z-10"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
          >
            {tab}
            {tab === "Assigned to me" && (
              <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                {myIssues.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Full-Width Divider */}
      <div className="border-b border-slate-200 dark:border-slate-800 mt-0" />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "Worked on" && (
          <div className="space-y-2">
            {loading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : allProjects.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No projects found.</p>
            ) : (
              <>
                <div className="flex flex-col max-h-[400px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/30">
                  {allProjects.map((project, index) => {
                    const colorClass = projectColors[index % projectColors.length];
                    return (
                      <button
                        key={project._id}
                        onClick={() => navigate(`/projects/${project._id}/overview`)}
                        className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer group"
                      >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                          <FolderKanban className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{project.key} • {project.description || "Team-managed software"}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                      </button>
                    );
                  })}
                </div>
                {/* Pagination Controls */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <button
                      onClick={() => fetchAllProjects({ page: pagination.page - 1, limit: 5 })}
                      disabled={pagination.page <= 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Prev
                    </button>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => fetchAllProjects({ page: pagination.page + 1, limit: 5 })}
                      disabled={pagination.page >= pagination.totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "Starred" && (
          <div className="space-y-2">
            {loadingStarred ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : starredProjects.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No starred projects found.</p>
            ) : (
              <div className="flex flex-col max-h-[400px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/30">
                {starredProjects.map((project, index) => {
                  const colorClass = projectColors[index % projectColors.length];
                  return (
                    <button
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}/overview`)}
                      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer group"
                    >
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        <FolderKanban className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {project.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{project.key}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "Assigned to me" && (
          <div>
            {/* Project Filter */}
            <div className="mb-4 flex items-center gap-3">
              <SelectDropdown
                value={selectedProjectId}
                options={projectOptions}
                onChange={setSelectedProjectId}
                placeholder="All Projects"
                width="w-64"
              />
              <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100/50 dark:border-indigo-800/40">
                {filteredIssues.length} {filteredIssues.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            {loadingIssues ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : filteredIssues.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-4">No issues assigned to you.</p>
            ) : (
              <div className="flex flex-col max-h-[500px] overflow-y-auto pr-2 custom-scrollbar divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/30">
                {filteredIssues.map((issue) => (
                  <button
                    key={issue._id}
                    onClick={() => navigate(`/projects/${issue.projectId?._id || issue.projectId}/list?issueId=${issue._id}`)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                          {issue.summary}
                        </p>
                        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider whitespace-nowrap border ${issue.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' :
                          issue.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800' :
                            'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}>
                          {issue.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 truncate flex items-center gap-1.5">
                        <FolderKanban className="w-3.5 h-3.5 opacity-70" />
                        <span className="font-medium text-slate-600 dark:text-slate-300">{issue.projectId?.name || "Unknown Project"}</span>
                        <span className="opacity-40">•</span>
                        <span className="font-medium">{issue.issueKey}</span>
                        {issue.parentId && (
                          <>
                            <span className="opacity-40">•</span>
                            <span className="font-medium text-indigo-500 dark:text-indigo-400 truncate">
                              Parent: {issue.parentId.issueKey} {issue.parentId.title ? `- ${issue.parentId.title}` : ""}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default UserActivitySection;
