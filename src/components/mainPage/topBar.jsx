import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Search, LogOut, ChevronDown, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/auth.context";
import useDarkMode from "../../hooks/useDarkMode";
import { toast } from "react-toastify";
import { Dropdown } from "antd";
import NotificationDropdown from "./NotificationDropdown";

// Helper function to validate URL
function isValidUrl(str) {
  if (!str) return false;
  try { new URL(str); return true; } catch { return false; }
}

const adminRoutes = {
  "/admin": "Platform Dashboard",
  "/admin/organizations": "Organizations",
  "/admin/users": "Platform Users",
  "/admin/platform-users": "Platform Users",
  "/admin/settings": "System Settings",
  "/admin/roles": "Roles & Permissions",
  "/admin/audit-logs": "Audit Logs",
  "/admin/security": "Data Security",
  "/admin/notifications": "Global Notifications",
  "/admin/health": "System Health",
  "/admin/support": "Support Center",
};

const projectRoutes = {
  "/projects": "Dashboard",
  "/overview": "Overview Dashboard",
  "/events": "Events",
  "/process": "Process Flow",
  "/bottlenecks": "Bottleneck Detector",
  "/users": "Users Management",
  "/team": "Team Health",
  "/rbac": "RBAC & Permissions",
  "/audit": "Audit Logs",
  "/profile": "Profile Settings",
};

function getRouteTitle(pathname, routes, fallback) {
  let title = fallback;
  for (const [path, name] of Object.entries(routes)) {
    if (pathname === path || (path !== "/" && pathname.startsWith(path))) {
      title = name;
    }
  }
  return title;
}

const TopBar = ({
  currentPageTitle,
  onMobileMenuClick,
  onSidebarToggle,
  searchPlaceholder,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);
  const { isDark, toggle } = useDarkMode();

  const isAdminRoute = location.pathname.startsWith("/admin");
  const canToggleSidebar = Boolean(onSidebarToggle || onMobileMenuClick);
  const currentPage = getRouteTitle(
    location.pathname,
    isAdminRoute ? adminRoutes : projectRoutes,
    currentPageTitle || (isAdminRoute ? "Platform Dashboard" : "Dashboard")
  );
  const effectiveSearchPlaceholder = searchPlaceholder || (isAdminRoute ? "Search platform..." : "Search Projects, Tasks...");

  const getInitials = (fullName) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setAuth({
      isAuthenticated: false,
      user: null,
    });
    toast.success("Logged out successfully!");
    navigate("/");
  };

  const userMenuItems = [
    {
      key: "info",
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {auth.user?.fullName || "User"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{auth.user?.email || "email@example.com"}</p>
        </div>
      ),
      disabled: true,
    },
    { type: "divider" },
    {
      key: "profile",
      label: (
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Profile Settings</span>
        </div>
      ),
      onClick: () => navigate("/profile"),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: (
        <div className="flex items-center gap-2">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </div>
      ),
      onClick: handleLogout,
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, translateY: -16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="sticky top-0 z-50 flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex items-center gap-4 min-w-0">
        {canToggleSidebar && (
          <motion.button
            type="button"
            onClick={() => {
              if (window.innerWidth >= 768) {
                onSidebarToggle?.();
                return;
              }
              onMobileMenuClick?.();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        )}

        <div className="flex items-center gap-3 text-sm font-medium text-slate-400 dark:text-slate-500 min-w-0">
          <span>TASKA</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={currentPage}
              initial={{ opacity: 0, translateY: -8 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: 8 }}
              transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
              className="inline-block text-slate-800 dark:text-slate-100 font-semibold truncate"
            >
              {currentPage}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-4 md:mx-8 hidden md:block">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder={effectiveSearchPlaceholder}
            className="w-full h-10 pl-10 pr-4 text-sm bg-slate-100 dark:bg-slate-800 border border-transparent rounded-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Thông báo - Notification Dropdown mới tạo */}
        <NotificationDropdown />

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

        {/* User avatar dropdown */}
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="flex items-center gap-2.5 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold leading-none text-slate-800 dark:text-slate-100">
                {auth.user?.fullName || "User"}
              </span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                {auth.user?.role ? auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1) : "Role"}
              </span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex-shrink-0 shadow-sm overflow-hidden">
              {auth.user?.avatar && isValidUrl(auth.user.avatar) ? (
                <img src={auth.user.avatar} alt={auth.user?.fullName || "User"} className="w-full h-full object-cover" />
              ) : (
                getInitials(auth.user?.fullName)
              )}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </Dropdown>
      </div>
    </motion.header>
  );
};

export default TopBar;
