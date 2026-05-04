import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Search, LogOut, ChevronDown } from "lucide-react";
import { AuthContext } from "../../context/auth.context";
import useDarkMode from "../../hooks/useDarkMode";
import { toast } from "react-toastify";
import { Dropdown } from "antd";
import NotificationDropdown from "./NotificationDropdown";

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext);
  const { isDark, toggle } = useDarkMode();

  const breadcrumbs = {
    "/projects": "Dashboard",
    "/overview": "Overview Dashboard",
    "/events": "Events",
    "/process": "Process Flow",
    "/bottlenecks": "Bottleneck Detector",
    "/users": "Users Management",
    "/admin/users": "Admin Users",
    "/team": "Team Health",
    "/rbac": "RBAC & Permissions",
    "/audit": "Audit Logs",
  };

  const currentPage = breadcrumbs[location.pathname] || "Dashboard";

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
      user: {
        _id: "",
        email: "",
        fullName: "",
        username: "",
        dob: "",
        gender: "",
        phone: "",
        role: "",
      },
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
            {auth.user.fullName || "User"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{auth.user.email}</p>
        </div>
      ),
      disabled: true,
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
    <header className="sticky top-0 z-50 flex items-center justify-between h-16 px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      {/* Logo and Breadcrumb */}
      <div className="flex items-center gap-3 text-sm font-medium text-slate-400 dark:text-slate-500">
        TASKA
        <span className="text-slate-300 dark:text-slate-700">/</span>
        <span className="text-slate-800 dark:text-slate-100 font-semibold">
          {currentPage}
        </span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          <input
            type="text"
            placeholder="Search Projects, Tasks..."
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
                {auth.user.fullName || "User"}
              </span>
              <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5">
                {auth.user.role ? auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1) : "Role"}
              </span>
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm flex-shrink-0 shadow-sm">
              {getInitials(auth.user.fullName)}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
};

export default TopBar;