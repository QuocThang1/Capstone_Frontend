import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  FolderKanban, Zap, AlertCircle, Clock, Activity,
  Sparkles, ArrowRight, BarChart3, Globe, TrendingUp, ChevronDown
} from "lucide-react";
import { Link } from "wouter";
import { AuthContext } from "@/context/auth.context";
import { getAllProjectsApi } from "@/utils/Api/projectApi";

// Mock hook for events data (replace with real API when available)
const useListEvents = () => ({
  data: [
    { id: 1, type: "success", message: "Database backup completed", source: "System", timestamp: new Date(Date.now() - 5 * 60000) },
    { id: 2, type: "warning", message: "High memory usage detected on server 3", source: "Monitor", timestamp: new Date(Date.now() - 15 * 60000) },
    { id: 3, type: "success", message: "API deployment finished", source: "CI/CD", timestamp: new Date(Date.now() - 30 * 60000) },
    { id: 4, type: "error", message: "Failed to connect to cache", source: "Redis", timestamp: new Date(Date.now() - 45 * 60000) },
  ]
});

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

const SystemAdminView = () => {
  const { data: events = [] } = useListEvents();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Global Continuity Score */}
      <motion.div variants={item}>
        <Card className="p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-bl-full transition-transform group-hover:scale-125" />
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center mb-4">
            <Globe className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Global Continuity Score</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">87%</span>
            <span className="text-sm text-emerald-600 font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +2.4%
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">Overall system health across all tenants</p>
        </Card>
      </motion.div>

      {/* Total System Activity */}
      <motion.div variants={item}>
        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total System Activity</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">1,204</span>
            <span className="text-sm text-slate-400 font-medium">events today</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[76%] bg-emerald-500 rounded-full" />
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">76% of monthly average</p>
        </Card>
      </motion.div>

      {/* Critical Alerts */}
      <motion.div variants={item}>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 shadow-lg shadow-rose-500/20 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:rotate-12">
            <AlertCircle className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-rose-100 text-sm font-medium">System Alerts</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold">2</span>
            <span className="text-sm text-rose-100">Critical</span>
          </div>
          <Link href="/overview" className="mt-4 flex items-center text-sm font-semibold text-white hover:text-white/80 transition-colors">
            View alerts <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </motion.div>

      {/* Live System Event Stream */}
      <motion.div variants={item} className="md:col-span-2">
        <Card className="p-6 h-full">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">Global Event Stream</h3>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Connected
            </span>
          </div>
          <div className="space-y-3">
            {events.slice(0, 4).map((ev) => (
              <div key={ev.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${ev.type === "error" ? "bg-rose-500" : ev.type === "warning" ? "bg-amber-500" : ev.type === "success" ? "bg-emerald-500" : "bg-indigo-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug">{ev.message}</p>
                  <div className="flex gap-2 text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    <span>{ev.source}</span>
                    <span>•</span>
                    <span>{new Date(ev.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-center text-sm text-slate-400 py-6">No events yet</p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* System Health KPIs */}
      <motion.div variants={item}>
        <Card className="p-6 flex flex-col h-full">
          <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-5">System KPIs</h3>
          <div className="space-y-4 flex-1">
            {[
              { label: "Uptime", value: "99.98%", color: "bg-emerald-500", width: "w-[99%]" },
              { label: "Avg Response", value: "142ms", color: "bg-indigo-500", width: "w-[72%]" },
              { label: "Error Rate", value: "0.02%", color: "bg-rose-500", width: "w-[2%]" },
              { label: "Throughput", value: "4.2K/s", color: "bg-amber-500", width: "w-[84%]" },
            ].map((kpi) => (
              <div key={kpi.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500 dark:text-slate-400">{kpi.label}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{kpi.value}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full ${kpi.color} ${kpi.width} rounded-full`} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

const ProjectAdminView = () => {
  const [projects, setProjects] = useState([]);
  const { data: events = [] } = useListEvents();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getAllProjectsApi();
        if (res && res.EC === 0) {
          setProjects(res.data || []);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
          <Link href="/projects" className="mt-4 flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Card>
      </motion.div>

      {/* Team Velocity */}
      <motion.div variants={item}>
        <Card className="p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <Zap className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Team Velocity</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">87%</span>
            <span className="text-sm text-emerald-600 font-medium">Optimal</span>
          </div>
          <div className="mt-4 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full w-[87%]" />
          </div>
        </Card>
      </motion.div>

      {/* Open Bottlenecks */}
      <motion.div variants={item}>
        <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl p-6 shadow-lg shadow-rose-500/20 text-white relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-10 transition-transform group-hover:rotate-12">
            <AlertCircle className="w-32 h-32" />
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
            <AlertCircle className="w-5 h-5 text-white" />
          </div>
          <p className="text-rose-100 text-sm font-medium">Open Bottlenecks</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold">2</span>
            <span className="text-sm text-rose-100">Critical</span>
          </div>
          <Link href="/overview" className="mt-4 flex items-center text-sm font-semibold text-white hover:text-white/80 transition-colors">
            Resolve now <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </motion.div>

      {/* AI Recommendations */}
      <motion.div variants={item} className="md:col-span-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100">AI Intelligence</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400">Updated just now</span>
          </div>
          <div className="space-y-3">
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Zap className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Re-allocate resources on "Product Launch"</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Design team is at 110% capacity. Shifting 2 QA resources could accelerate phase 2 by 4 days.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <Activity className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Process optimization detected</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Automating the "Invoice Generation" step could save 14 hours/week based on historical data.</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Upcoming Deadlines */}
      <motion.div variants={item}>
        <Card className="p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100">Upcoming</h3>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {[
              { title: "Q3 Review Docs", sub: "Marketing Sprint", date: "Today", time: "5:00 PM", urgent: true },
              { title: "Deploy v2.4.1", sub: "Dev Core", date: "Tomorrow", time: "10:00 AM", urgent: false },
              { title: "Stakeholder Demo", sub: "Product Launch", date: "Fri", time: "2:00 PM", urgent: false },
            ].map((d) => (
              <div key={d.title} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{d.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{d.sub}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-sm ${d.urgent ? "text-rose-500" : "text-slate-700 dark:text-slate-300"}`}>{d.date}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{d.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

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
        const res = await getProjectByIdApi();
        if (res && res.EC === 0) {
          setRecentProjects((res.data || []).slice(0, 6));
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
      <div className="flex items-center justify-between                                pb-6 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recent Projects</h2>
        <Link href="/projects" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
          View all spaces
        </Link>
      </div>

      {recentProjects.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recentProjects.map((project, index) => {
            const colorClass = projectColors[index % projectColors.length];
            const isExpanded = expandedProject === project.id;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <div className={`bg-gradient-to-r ${colorClass} rounded-lg p-0.5`}>
                  <div className="bg-slate-800 dark:bg-slate-900 rounded-md p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`bg-gradient-to-br ${colorClass} rounded-lg p-2 w-16 h-16 flex items-center justify-center flex-shrink-0 text-white`}>
                        <FolderKanban className="w-8 h-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-white">{project.name}</h3>
                        <p className="text-sm text-slate-400 mt-1">
                          {project.description || "Team-managed software"}
                        </p>
                      </div>
                    </div>

                    {/* Quick Links */}
                    <div className="border-t border-slate-700 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-slate-300 mb-3">Quick links</h4>
                      <div className="space-y-2 mb-4">
                        <Link href={`/projects/${project.id}?view=backlog`} className="flex items-center justify-between text-sm text-slate-400 hover:text-indigo-400 transition-colors group">
                          <span className="underline group-hover:no-underline">My open work items</span>
                          <span className="text-xs font-medium bg-slate-700 px-2 py-1 rounded text-slate-300">0</span>
                        </Link>
                        <Link href={`/projects/${project.id}?view=done`} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors underline hover:no-underline">
                          Done work items
                        </Link>
                      </div>

                      {/* Boards Dropdown */}
                      <button
                        onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-300 transition-colors group"
                      >
                        <span>1 board</span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-slate-700 space-y-2"
                        >
                          <Link href={`/projects/${project.id}/board`} className="block text-sm text-slate-400 hover:text-indigo-400 transition-colors underline hover:no-underline pl-0">
                            {project.name} Board
                          </Link>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

const ForYou = () => {
  const { auth } = useContext(AuthContext);
  const user = auth?.user || {};
  const isSysAdmin = user.role === "SYSTEM_ADMIN";
  const [activeTab, setActiveTab] = useState("Viewed");

  const tabs = ["Worked on", "Viewed", "Assigned to me", "Starred", "Boards"];

  return (
    <div className="space-y-8 pb-10">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
          Welcome back, {user.fullName || "User"}! 👋
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 max-w-2xl">
          {isSysAdmin
            ? "Here's your global system overview. Monitor health, activity, and critical alerts across all tenants."
            : "Here's what's happening across your projects today. You have 2 high-priority bottlenecks requiring attention."}
        </p>
      </motion.div>

      {isSysAdmin ? <SystemAdminView /> : <ProjectAdminView />}

      {/* Recent Projects Section */}
      {!isSysAdmin && <RecentProjectsSection />}

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
        className="mt-12"
      >
        {/* Secondary Tab Navigation */}
        <div className="flex gap-6 relative">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[14px] font-medium transition-colors pb-3 whitespace-nowrap ${activeTab === tab
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400 -mb-[1px] relative z-10"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              {tab}
              {tab === "Assigned to me" && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                  0
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Full-Width Divider */}
        <div className="border-b border-slate-200 dark:border-slate-800 mt-0" />

        {/* TODAY Category Label */}
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-8 mb-4">
          TODAY
        </p>

        {/* Recent Activity List */}
        <div className="space-y-2">
          {/* My Software Team */}
          <button className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors text-left cursor-pointer group">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
              M
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                My Software Team
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Team-managed software</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* SCRUM board */}
          <button className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors text-left cursor-pointer group">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              S
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                SCRUM board
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Team-managed software</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Footer Link */}
        <div className="flex justify-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-800">
          <Link
            href="/work-items"
            className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Couldn't find your work item? View all work items
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForYou;
