import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
import CreateProjectModal from "../../pages/Project/ProjectManagement/createProjectModal";
import useDarkMode from "../../hooks/useDarkMode";

// Helper function to validate URL
function isValidUrl(str) {
  if (!str) return false;
  try { new URL(str); return true; } catch { return false; }
}

function getInitials(name) {
  if (!name) return "U";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}


const NavItem = ({ to, icon: Icon, label, badge, isActive, isCollapsed }) => {
  const navigate = useNavigate();
  const [tooltipPos, setTooltipPos] = useState(null);
  const buttonRef = useState(null)[1];

  if (isCollapsed) {
    return (
      <motion.div
        className="relative group"
        initial={false}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onMouseEnter={(e) => {
          const rect = e.currentTarget.querySelector('button').getBoundingClientRect();
          setTooltipPos({
            top: rect.top + rect.height / 2,
            left: rect.right + 8
          });
        }}
        onMouseLeave={() => setTooltipPos(null)}
      >
        <motion.button
          onClick={() => navigate(to)}
          className={cn(
            "relative w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 flex-shrink-0",
            isActive
              ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
          )}
          title={label}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
        >
          {/* Left indicator line for active state */}
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />}

          <Icon className="w-5 h-5" />

          {/* Badge overlay - constrained within button */}
          {badge && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center flex-shrink-0">
              {badge.charAt(0)}
            </span>
          )}
        </motion.button>

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
      </motion.div>
    );
  }

  return (
    <motion.button
      onClick={() => navigate(to)}
      className={cn(
        "relative w-full flex items-center gap-3 px-2 py-2.5 rounded-lg transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
      )}
      initial={false}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      {/* Left indicator line for active state */}
      {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />}

      <Icon className="w-5 h-5 flex-shrink-0" />

      {/* Label with visibility transition */}
      <AnimatePresence initial={false}>
        <motion.span
          key="label"
          initial={{ opacity: 0, x: -8, width: 0 }}
          animate={{ opacity: 1, x: 0, width: "auto" }}
          exit={{ opacity: 0, x: -8, width: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          className="text-[13px] font-medium whitespace-nowrap overflow-hidden"
        >
          {label}
        </motion.span>
      </AnimatePresence>

      {/* Badge with visibility transition */}
      {badge && (
        <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-purple-500 text-white flex-shrink-0 transition-opacity duration-300">
          {badge}
        </span>
      )}
    </motion.button>
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
    Object.keys(localStorage).forEach((key) => {
      // Quét tìm tất cả các key bắt đầu bằng "pinned_nav_" và xóa chúng
      if (key.startsWith('pinned_nav_')) {
        localStorage.removeItem(key);
      }
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
  const isAdmin = user?.role?.toLowerCase() === "admin";

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 256 }}
        transition={{ type: "spring", stiffness: 360, damping: 36 }}
        className={cn(
          "relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col flex-shrink-0 z-40 overflow-x-hidden overflow-y-auto group"
        )}
      >
        {/* Logo Section Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          {/* Logo and Brand */}
          <motion.div
            initial={false}
            animate={{ width: isCollapsed ? 32 : "auto" }}
            transition={{ type: "spring", stiffness: 360, damping: 32 }}
            className={cn(
              "flex items-center gap-3 transition-all duration-300 overflow-hidden",
              isCollapsed ? "w-8" : "flex-1"
            )}>
            {/* Logo SVG */}
            <motion.div
              whileHover={{ rotate: [0, -12, 12, -6, 6, 0] }}
              transition={{ duration: 0.5 }}
              className="shrink-0"
            >
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
            </motion.div>

            {/* Brand Text - hidden when collapsed */}
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.span
                  key="brand"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="flex flex-col whitespace-nowrap"
                >
                  <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white">
                    TASKA
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
                    Workspace
                  </span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

        </div>

        {/* Scrollable Nav - optimized for collapsed/expanded states */}
        <div className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300",
          isCollapsed ? "px-2 py-4 flex flex-col gap-2 items-center" : "px-2 py-4 space-y-4"
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
            <motion.button
              onClick={() => setCreateModalOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200 rounded-lg flex-shrink-0 cursor-pointer"
              title="New project"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.div
              className="w-full overflow-hidden"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            >
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Projects
                </span>
                <button
                  onClick={() => setCreateModalOpen(true)}
                  className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200 cursor-pointer"
                  title="New project"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {allProjects.length === 0 && (
                  <p className="px-3 py-2 text-[13px] text-slate-400 dark:text-slate-500 italic">
                    No projects yet.
                  </p>
                )}
                {allProjects.slice(0, 3).map((project) => (
                  <button
                    key={project._id}
                    onClick={() => navigate(`/projects/${project._id}/overview`)}
                    className="w-full flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-[13px] text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-100 dark:bg-slate-900 text-[11px] font-bold text-slate-500 dark:text-slate-500 flex-shrink-0">
                      {project.key ? project.key.slice(0, 1).toUpperCase() : project.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate">{project.name}</span>
                  </button>
                ))}
                <button
                  onClick={() => navigate("/projects/management")}
                  className="w-full flex items-center gap-2 px-2 py-2.5 text-[12px] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200 transition-colors duration-200 cursor-pointer rounded-lg"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>More projects</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
        {/* Footer Section - User Profile & Actions */}
        <div className={cn(
          "mt-auto transition-all duration-300 flex flex-col gap-3",
          isCollapsed ? "px-2 py-4 items-center" : "px-4 py-4 border-t border-slate-100 dark:border-slate-800"
        )}>
          {/* Admin Switch - Admin Users Only */}
          {isAdmin && (
            <button
              onClick={() => navigate("/admin")}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-lg font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all duration-200 cursor-pointer",
                isCollapsed ? "p-2 w-10 h-10" : "w-full px-3 py-2"
              )}
              title={isCollapsed ? "Switch to Admin" : undefined}
            >
              <Shield className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    key="admin-switch-label"
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -8, width: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="text-sm whitespace-nowrap overflow-hidden cursor-pointer"
                  >
                    Switch to Admin
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* User Profile Card - Expanded Only */}
          <AnimatePresence initial={false}>
            {!isCollapsed && (
              <motion.button
                key="profile-card"
                onClick={() => navigate("/profile")}
                className="w-full px-3 py-3 mb-3 rounded-xl border bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 transition-all duration-300 cursor-pointer text-left hover:shadow-md"
                initial={{ opacity: 0, x: -12, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -12, height: 0 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              >
                <div className="flex items-center gap-2.5">
                  {/* Avatar */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-transparent">
                    {auth.user.avatar && isValidUrl(auth.user.avatar) ? (
                      <img
                        src={auth.user.avatar}
                        alt={auth.user.fullName || "User"}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
                        {getInitials(auth.user.fullName)}
                      </span>
                    )}
                  </div>
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate text-slate-900 dark:text-white">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-[10px] truncate text-slate-500 dark:text-slate-400">
                      {user?.email || "email@example.com"}
                    </p>
                  </div>
                  {/* Role Badge - on the right */}
                  {user?.role && (
                    <div className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider flex-shrink-0 bg-purple-500/20 dark:bg-purple-500/30 text-purple-700 dark:text-purple-300">
                      {user.role}
                    </div>
                  )}
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* User Avatar - Collapsed Only */}
          <AnimatePresence initial={false}>
            {isCollapsed && (
              <motion.div
                key="profile-avatar"
                className="mb-3 flex justify-center"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ type: "spring", stiffness: 420, damping: 24 }}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:shadow-indigo-500/30 overflow-hidden" title={user?.fullName || "User"}>
                  {user?.avatar && isValidUrl(user.avatar) ? (
                    <img src={user.avatar} alt={user?.fullName || "User"} className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Action Buttons - smooth transitions */}
          <div className={cn(
            "flex gap-2 transition-all duration-300",
            isCollapsed ? "flex-col items-center justify-center w-full" : "flex-row"
          )}>
            <button
              onClick={() => navigate("/")}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all duration-200 cursor-pointer",
                isCollapsed ? "p-2 w-10 h-10" : "flex-1 px-3 py-2"
              )}
              title={isCollapsed ? "Home" : "Back to Home"}
            >
              <ArrowLeft className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    key="home-label"
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -8, width: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden cursor-pointer"
                  >
                    Home
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={handleLogout}
              className={cn(
                "flex items-center justify-center gap-2.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-200 cursor-pointer",
                isCollapsed ? "p-2 w-10 h-10" : "flex-1 px-3 py-2"
              )}
              title={isCollapsed ? "Logout" : "Logout"}
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.span
                    key="logout-label"
                    initial={{ opacity: 0, x: -8, width: 0 }}
                    animate={{ opacity: 1, x: 0, width: "auto" }}
                    exit={{ opacity: 0, x: -8, width: 0 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden cursor-pointer"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.aside>

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
};

export default UserSidebar;
