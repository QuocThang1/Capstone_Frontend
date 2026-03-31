import { useNavigate, useLocation } from "react-router-dom";
import {
  Sparkles, LayoutDashboard, Activity, GitBranch, Zap,
  Users, Shield, ClipboardList, ArrowLeftRight, Settings2,
  LogOut, Plus, ArrowLeft, FolderOpen
} from "lucide-react";
import { useContext, useState } from "react";
import { cn } from "../../lib/utils";
import { AuthContext } from "../../context/auth.context";
import { ProjectContext } from "../../context/project.context"; // Import ProjectContext
import { toast } from "react-toastify";
import CreateProjectModal from "../../pages/Project/createProjectModal";
import useDarkMode from "../../hooks/useDarkMode";

const NavItem = ({ to, icon: Icon, label, badge, isActive, isCollapsed }) => {
  const navigate = useNavigate();
  const [tooltipPos, setTooltipPos] = useState(null);
  const buttonRef = useState(null)[1];

  if (isCollapsed) {
    return (
      <div 
        className="relative group"
        onMouseEnter={(e) => {
          const rect = e.currentTarget.querySelector('button').getBoundingClientRect();
          setTooltipPos({
            top: rect.top + rect.height / 2,
            left: rect.right + 8
          });
        }}
        onMouseLeave={() => setTooltipPos(null)}
      >
        <button
          onClick={() => navigate(to)}
          className={cn(
            "relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 flex-shrink-0",
            isActive
              ? "bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
              : "text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
          )}
          title={label}
        >
          {/* Left indicator line for active state */}
          {isActive && <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />}
          
          <Icon className="w-5 h-5" />
          
          {/* Badge overlay - constrained within button */}
          {badge && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
              {badge.charAt(0)}
            </span>
          )}
        </button>
        
        {/* Tooltip - using fixed positioning to escape sidebar overflow clipping */}
        {tooltipPos && (
          <div 
            className="pointer-events-none fixed z-50 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{
              top: `${tooltipPos.top}px`,
              left: `${tooltipPos.left}px`,
              transform: 'translateY(-50%)'
            }}
          >
            <div className="bg-slate-900 dark:bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded whitespace-nowrap shadow-lg">
              {label}
              {/* Tooltip arrow pointing left */}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900 dark:border-r-slate-800" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => navigate(to)}
      className={cn(
        "relative w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-indigo-50/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
      )}
    >
      {/* Left indicator line for active state */}
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 dark:bg-indigo-400 rounded-r-full" />}
      
      <Icon className="w-5 h-5 flex-shrink-0" />
      
      {/* Label with visibility transition */}
      <span className="text-[13px] font-medium transition-opacity duration-300">{label}</span>
      
      {/* Badge with visibility transition */}
      {badge && (
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500 text-white flex-shrink-0 transition-opacity duration-300">
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
  const { isDark } = useDarkMode(); // Get dark mode state
  const { user } = auth;

  // Get projects and creation function from context
  const { allProjects, createProject } = useContext(ProjectContext);
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    toast.success("Logged out successfully!");
    navigate("/");
  };

  // Use the createProject function from context
  const handleProjectCreated = async (projectData) => {
    const newProject = await createProject(projectData);
    if (newProject) {
      setCreateModalOpen(false);
      // Optionally navigate to the new project page
      // navigate(`/projects/${newProject._id}`);
    }
  };

  const isActiveRoute = (route) => pathname === route;

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <aside
        className={cn(
          "relative bg-white dark:bg-black border-r border-slate-100 dark:border-slate-800 flex flex-col flex-shrink-0 z-40 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out group",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo Section Header */}
        <div className="h-16 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          {/* Logo and Brand */}
          <div className={cn(
            "flex items-center gap-3 transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-8" : "flex-1"
          )}>
            {/* Logo SVG */}
            <div className={cn(
              "flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400 transition-all duration-300",
              isCollapsed ? "w-8 h-8" : "w-7 h-7"
            )}>
              <svg
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1080 1080"
                className="w-full h-full"
              >
                <g
                  transform="translate(0,1080) scale(0.1,-0.1)"
                  fill="currentColor"
                  stroke="none"
                >
                  <path d="M1590 10049 c-852 -47 -1500 -755 -1500 -1639 0 -733 442 -1357 1120 -1583 205 -68 209 -69 1071 -74 824 -6 834 -5 864 41 8 12 22 73 30 136 9 63 31 214 50 335 19 121 41 279 50 350 8 72 18 147 21 168 l6 37 -815 0 c-512 0 -834 4 -868 10 -130 25 -245 108 -325 236 -120 193 -136 408 -43 592 78 156 195 253 374 310 44 14 177 17 1165 22 914 4 1120 7 1141 19 15 7 70 63 122 125 115 135 386 418 668 699 115 114 209 212 209 217 0 12 -3132 11 -3340 -1z" />
                  <path d="M6870 10050 c-25 -5 -106 -18 -180 -30 -328 -52 -663 -154 -962 -293 -697 -325 -1358 -1013 -1663 -1731 -127 -299 -199 -572 -260 -989 -25 -167 -26 -194 -35 -932 -5 -418 -9 -1437 -9 -2265 -1 -1605 -1 -1606 48 -1797 35 -134 78 -250 152 -399 103 -212 210 -352 389 -511 331 -295 616 -382 1204 -370 226 4 260 7 346 30 198 52 325 130 480 299 523 563 2861 3276 3954 4588 l87 105 -633 3 c-348 1 -643 0 -655 -3 -13 -3 -104 -99 -215 -228 -621 -715 -2606 -3040 -2945 -3448 -67 -81 -146 -165 -175 -189 -113 -90 -230 -130 -383 -130 -171 0 -283 48 -411 176 -68 66 -90 97 -128 175 -29 59 -50 120 -57 164 -9 53 -9 607 -1 2290 11 2417 8 2284 68 2553 65 289 195 591 367 846 346 517 884 875 1482 985 206 38 292 41 1344 41 1148 0 1089 3 1235 -73 444 -230 406 -880 -63 -1069 l-56 -23 -1060 -6 c-1027 -5 -1063 -6 -1170 -27 -253 -49 -439 -146 -613 -320 -207 -207 -322 -429 -352 -677 -9 -77 -10 -516 -5 -1877 4 -978 11 -1778 15 -1778 11 0 170 173 440 480 123 140 278 316 344 390 131 148 184 223 218 309 l23 56 5 1153 5 1154 28 23 c15 13 44 29 65 36 27 9 331 14 1127 18 1074 7 1091 8 1160 29 358 109 574 225 773 416 274 264 427 534 503 886 20 90 23 134 23 310 0 176 -3 220 -23 310 -74 343 -231 624 -484 867 -147 141 -345 275 -517 349 -86 37 -329 107 -430 123 -78 13 -2330 13 -2400 1z" />
                </g>
              </svg>
            </div>

            {/* Brand Text - hidden when collapsed */}
            {!isCollapsed && (
              <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400 tracking-wide whitespace-nowrap transition-opacity duration-300">
                TASKA
              </span>
            )}
          </div>

          {/* Toggle Button - positioned absolutely at the sidebar edge */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "absolute -right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-200 flex-shrink-0 z-50 shadow-md hover:shadow-lg"
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <svg
              className={cn("w-4 h-4 transition-transform duration-300", isCollapsed && "rotate-180")}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Scrollable Nav - optimized for collapsed/expanded states */}
        <div className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
          isCollapsed ? "px-2 py-4 flex flex-col gap-2 items-center" : "px-4 py-4 space-y-6"
        )}>

          {/* For You */}
          <NavItem
            to="/projects"
            icon={Sparkles}
            label="For You"
            isActive={isActiveRoute("/projects")}
            isCollapsed={isCollapsed}
          />

          {/* Divider - responsive sizing */}
          <div className={cn(
            "bg-slate-200 dark:bg-slate-800 transition-all duration-300",
            isCollapsed ? "w-8 h-px" : "w-full h-px"
          )} />

          {/* Projects Section */}
          {isCollapsed ? (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 rounded-lg flex-shrink-0"
              title="New project"
            >
              <Plus className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Projects
                </span>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  title="New project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {projects.length === 0 && (
                  <p className="px-3 py-2 text-[13px] text-slate-400 dark:text-slate-500 italic">
                    No projects yet.
                  </p>
                )}
                {allProjects.slice(0, 3).map((project) => (
                  <button
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-900 text-[11px] font-bold text-slate-500 dark:text-slate-500 flex-shrink-0">
                      {project.key ? project.key.slice(0, 1).toUpperCase() : project.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
                {allProjects.length > 3 && (
                  <button
                    onClick={() => navigate("/projects/management")}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    <FolderOpen className="w-4 h-4" />
                    <span>More projects</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Divider - responsive sizing */}
          <div className={cn(
            "bg-slate-200 dark:bg-slate-800 flex-shrink-0 transition-all duration-300",
            isCollapsed ? "w-8 h-px" : "w-full h-px"
          )} />

          {/* Monitor */}
          <div className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-full flex flex-col gap-1 items-center" : "w-full"
          )}>
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Monitor
              </p>
            )}
            <div className={isCollapsed ? "w-full flex flex-col gap-1 items-center" : "space-y-1"}>
              <NavItem
                to="/overview"
                icon={LayoutDashboard}
                label="Overview Dashboard"
                isActive={isActiveRoute("/overview")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/events"
                icon={Activity}
                label="Real-time Event Log"
                isActive={isActiveRoute("/events")}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>

          {/* Intelligence */}
          <div className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-full flex flex-col gap-1 items-center" : "w-full"
          )}>
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Intelligence
              </p>
            )}
            <div className={isCollapsed ? "w-full flex flex-col gap-1 items-center" : "space-y-1"}>
              <NavItem
                to="/process"
                icon={GitBranch}
                label="Process Flow"
                isActive={isActiveRoute("/process")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/bottlenecks"
                icon={Zap}
                label="Bottleneck Detector"
                badge="ML"
                isActive={isActiveRoute("/bottlenecks")}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>

          {/* Management */}
          <div className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-full flex flex-col gap-1 items-center" : "w-full"
          )}>
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Management
              </p>
            )}
            <div className={isCollapsed ? "w-full flex flex-col gap-1 items-center" : "space-y-1"}>
              <NavItem
                to="/team"
                icon={Users}
                label="Team Health"
                isActive={isActiveRoute("/team")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/rbac"
                icon={Shield}
                label="RBAC & Permissions"
                isActive={isActiveRoute("/rbac")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/audit"
                icon={ClipboardList}
                label="Audit Logs"
                isActive={isActiveRoute("/audit")}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>

          {/* Operations */}
          <div className={cn(
            "transition-all duration-300",
            isCollapsed ? "w-full flex flex-col gap-1 items-center" : "w-full"
          )}>
            {!isCollapsed && (
              <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Operations
              </p>
            )}
            <div className={isCollapsed ? "w-full flex flex-col gap-1 items-center" : "space-y-1"}>
              <NavItem
                to="/data"
                icon={ArrowLeftRight}
                label="Import/Export Data"
                isActive={isActiveRoute("/data")}
                isCollapsed={isCollapsed}
              />
              <NavItem
                to="/automation"
                icon={Settings2}
                label="Automation Rules"
                isActive={isActiveRoute("/automation")}
                isCollapsed={isCollapsed}
              />
            </div>
          </div>
        </div>



        {/* Footer Section - User Profile & Actions */}
        <div className={cn(
          "mt-auto transition-all duration-300 flex flex-col gap-3",
          isCollapsed ? "px-2 py-4 items-center" : "px-4 py-4 border-t border-slate-100 dark:border-slate-800"
        )}>
          {/* User Profile Card - Expanded Only */}
          {!isCollapsed && (
            <div className="px-3 py-3 mb-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all duration-300">
              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                </div>
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-slate-900 dark:text-white truncate">
                    {user?.fullName || "User"}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.email || "email@example.com"}
                  </p>
                </div>
                {/* Role Badge - on the right */}
                {user?.role && (
                  <div className="px-2.5 py-1 rounded-full bg-purple-500/20 dark:bg-purple-500/30 text-[10px] font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider flex-shrink-0">
                    {user.role}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Avatar - Collapsed Only */}
          {isCollapsed && (
            <div className="mb-3 flex justify-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:shadow-indigo-500/30" title={user?.fullName || "User"}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          )}

          {/* Footer Action Buttons - smooth transitions */}
          <div className={cn(
            "flex gap-2 transition-all duration-300",
            isCollapsed ? "flex-col items-center justify-center w-full" : "flex-row"
          )}>
            <button
              onClick={() => navigate("/")}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200",
                isCollapsed ? "p-2 w-10 h-10" : "flex-1 px-3 py-2"
              )}
              title={isCollapsed ? "Home" : "Back to Home"}
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">Home</span>}
            </button>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200",
                isCollapsed ? "p-2 w-10 h-10" : "flex-1 px-3 py-2"
              )}
              title={isCollapsed ? "Logout" : "Logout"}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
            </button>
          </div>
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