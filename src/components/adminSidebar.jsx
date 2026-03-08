import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AuthContext);

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

    // Check if current path matches menu item
    const isActive = (path) => location.pathname === path;

    // Menu items
    const menuItems = [
        {
            title: "Dashboard",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
            path: "/admin",
        },
        {
            title: "User Management",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            path: "/admin/users",
        },
        {
            title: "Settings",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            path: "/admin/settings",
        },
    ];

    return (
        <aside
            className={`bg-[#101A17] text-white transition-all duration-300 flex flex-col ${isCollapsed ? "w-20" : "w-64"
                }`}
        >
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                {!isCollapsed && (
                    <div>
                        <h1 className="text-xl font-bold text-[#4ADE80]">Admin Panel</h1>
                        <p className="text-xs text-gray-400 mt-1">Management Dashboard</p>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 hover:bg-[#2a3934] rounded-lg transition-colors duration-200 cursor-pointer"
                >
                    <svg
                        className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""
                            }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#4ADE80] to-[#22D3EE] rounded-full flex items-center justify-center font-bold text-[#101A17] flex-shrink-0">
                        {auth.user.fullName?.charAt(0).toUpperCase() || "A"}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{auth.user.fullName}</p>
                            <p className="text-xs text-gray-400 truncate">{auth.user.email}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive(item.path)
                            ? "bg-[#4ADE80] text-[#101A17] font-semibold shadow-lg"
                            : "hover:bg-[#2a3934] text-gray-300 hover:text-white"
                            }`}
                    >
                        {item.icon}
                        {!isCollapsed && <span>{item.title}</span>}
                    </button>
                ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-700 space-y-2">
                {/* Back to Home */}
                <button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2a3934] text-gray-300 hover:text-white transition-all duration-200 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {!isCollapsed && <span>Back to Home</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500 hover:bg-opacity-20 text-red-400 hover:text-red-300 transition-all duration-200 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;