import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles, LayoutDashboard, Activity, GitBranch, Zap,
  Users, Shield, ClipboardList, ArrowLeftRight, Settings2,
  LogOut, Plus, ArrowLeft, FolderOpen
} from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { cn } from "../../lib/utils";
import { AuthContext } from "../../context/auth.context";
import { toast } from "react-toastify";
import { getMyProjectsApi } from "../../utils/Api/projectApi";
import CreateProjectModal from "../../pages/Project/createProjectModal";

const NavItem = ({ to, icon: Icon, label, badge, isActive }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group cursor-pointer",
        isActive
          ? "bg-indigo-600 text-white shadow-sm"
          : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300"
      )}
    >
      <div className="flex items-center gap-2.5">
        <Icon
          className={cn(
            "w-4 h-4 flex-shrink-0",
            isActive ? "text-white" : "text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300"
          )}
        />
        <span>{label}</span>
      </div>
      {badge && (
        <span
          className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded",
            isActive ? "bg-white/25 text-white" : "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300"
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
};

const UserSidebar = ({ isCollapsed = false, setIsCollapsed = () => { } }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { auth, setAuth } = useContext(AuthContext);
  const { user } = auth; // Get user from AuthContext

  // State for projects and create modal
  const [projects, setProjects] = useState([]);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await getMyProjectsApi();
        if (res && res.EC === 0) {
          setProjects(res.data);
        } else {
          toast.error(res.EM || "Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("An error occurred while fetching projects.");
      }
    };

    if (auth.isAuthenticated) {
      fetchProjects();
    }
  }, [auth.isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const handleProjectCreated = (newProject) => {
    setProjects(prevProjects => [newProject, ...prevProjects]);
    // Optionally navigate to the new project page
    // navigate(`/projects/${newProject._id}`);
  };

  const isActiveRoute = (route) => pathname === route;

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-40 transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-800">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400 tracking-wide">TASKA</span>
            </div>
          )}
          {isCollapsed && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 mx-auto">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-700 dark:text-slate-200"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={cn("w-5 h-5 transition-transform duration-300", isCollapsed && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Scrollable Nav */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">

          {/* For You */}
          <div className="space-y-0.5">
            <NavItem
              to="/projects"
              icon={Sparkles}
              label={isCollapsed ? "" : "For You"}
              isActive={isActiveRoute("/projects")}
            />
          </div>

          {/* Projects */}
          <div>
            <div className="flex items-center justify-between px-3 mb-1.5">
              {!isCollapsed && (
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Projects
                </span>
              )}
              <button
                onClick={() => setCreateModalOpen(true)}
                className="p-0.5 rounded text-slate-500 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
                title="New project"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            {!isCollapsed && (
              <div className="space-y-0.5">
                {projects.length === 0 && (
                  <p className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 italic">
                    No projects yet.
                  </p>
                )}
                {projects.slice(0, 3).map((project) => (
                  <button
                    key={project._id}
                    title={project.name}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-600 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 flex-shrink-0 transition-colors">
                      {project.key ? project.key.slice(0, 1).toUpperCase() : project.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
                {projects.length > 3 && (
                  <button
                    onClick={() => navigate("/projects/management")}
                    className="flex items-center gap-2.5 w-full px-3 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>More projects</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Monitor */}
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Monitor
              </p>
            )}
            <div className="space-y-0.5">
              <NavItem
                to="/overview"
                icon={LayoutDashboard}
                label={isCollapsed ? "" : "Overview Dashboard"}
                isActive={isActiveRoute("/overview")}
              />
              <NavItem
                to="/events"
                icon={Activity}
                label={isCollapsed ? "" : "Real-time Event Log"}
                isActive={isActiveRoute("/events")}
              />
            </div>
          </div>

          {/* Intelligence */}
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Intelligence
              </p>
            )}
            <div className="space-y-0.5">
              <NavItem
                to="/process"
                icon={GitBranch}
                label={isCollapsed ? "" : "Process Flow"}
                isActive={isActiveRoute("/process")}
              />
              <NavItem
                to="/bottlenecks"
                icon={Zap}
                label={isCollapsed ? "" : "Bottleneck Detector"}
                badge="ML"
                isActive={isActiveRoute("/bottlenecks")}
              />
            </div>
          </div>

          {/* Management */}
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Management
              </p>
            )}
            <div className="space-y-0.5">
              <NavItem
                to="/team"
                icon={Users}
                label={isCollapsed ? "" : "Team Health"}
                isActive={isActiveRoute("/team")}
              />
              <NavItem
                to="/rbac"
                icon={Shield}
                label={isCollapsed ? "" : "RBAC & Permissions"}
                isActive={isActiveRoute("/rbac")}
              />
              <NavItem
                to="/audit"
                icon={ClipboardList}
                label={isCollapsed ? "" : "Audit Logs"}
                isActive={isActiveRoute("/audit")}
              />
            </div>
          </div>

          {/* Operations */}
          <div>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Operations
              </p>
            )}
            <div className="space-y-0.5">
              <NavItem
                to="/data"
                icon={ArrowLeftRight}
                label={isCollapsed ? "" : "Import/Export Data"}
                isActive={isActiveRoute("/data")}
              />
              <NavItem
                to="/automation"
                icon={Settings2}
                label={isCollapsed ? "" : "Automation Rules"}
                isActive={isActiveRoute("/automation")}
              />
            </div>
          </div>
        </div>

        {/* User block */}
        {!isCollapsed && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex-shrink-0">
                {user.fullName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user.fullName}
                </p>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 truncate">{user.email}</p>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex-shrink-0 whitespace-nowrap">
                {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Role"}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={cn(
          "border-t border-slate-200 dark:border-slate-800 space-y-0.5",
          isCollapsed ? "px-2 py-3" : "px-3 py-4"
        )}>
          <button
            onClick={() => navigate("/")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group cursor-pointer",
              isCollapsed && "justify-center p-2"
            )}
            title="Back to home"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" />
            {!isCollapsed && <span>Home</span>}
          </button>
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group cursor-pointer",
              isCollapsed && "justify-center p-2"
            )}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default UserSidebar;