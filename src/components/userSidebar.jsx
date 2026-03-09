import { useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";

const UserSidebar = ({ isCollapsed, setIsCollapsed }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useContext(AuthContext);
    const [isProjectsOpen, setIsProjectsOpen] = useState(false);

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

    // Sample projects list (replace with real data from API)
    const projects = [
        { id: 1, name: "Capstone Project", color: "#4ADE80" },
        { id: 2, name: "Software Development", color: "#22D3EE" },
        { id: 3, name: "My Scrum Project", color: "#818CF8" },
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
                        <h1 className="text-xl font-bold text-[#4ADE80]">User Panel</h1>
                        <p className="text-xs text-gray-400 mt-1">Personal Dashboard</p>
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
                        {auth.user.fullName?.charAt(0).toUpperCase() || "U"}
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
                {/* For You */}
                <button
                    onClick={() => navigate("/projects")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${isActive("/projects")
                            ? "bg-[#4ADE80] text-[#101A17] font-semibold shadow-lg"
                            : "hover:bg-[#2a3934] text-gray-300 hover:text-white"
                        }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    {!isCollapsed && <span>For You</span>}
                </button>

                {/* Projects with Dropdown */}
                <div>
                    <button
                        onClick={() => !isCollapsed && setIsProjectsOpen(!isProjectsOpen)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#2a3934] text-gray-300 hover:text-white transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        {!isCollapsed && (
                            <>
                                <span className="flex-1 text-left">Projects</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isProjectsOpen ? "rotate-180" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </>
                        )}
                    </button>

                    {/* Projects Dropdown List */}
                    {!isCollapsed && isProjectsOpen && (
                        <div className="mt-2 space-y-1 pl-4">
                            {/* Starred Section */}
                            <div className="px-3 py-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase">Starred</p>
                            </div>

                            {/* Recent Section */}
                            <div className="px-3 py-2">
                                <p className="text-xs font-semibold text-gray-500 uppercase">Recent</p>
                            </div>

                            {projects.map((project) => (
                                <button
                                    key={project.id}
                                    onClick={() => navigate(`/projects/${project.id}`)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${isActive(`/projects/${project.id}`)
                                            ? "bg-[#2a3934] text-white"
                                            : "hover:bg-[#1a2924] text-gray-400 hover:text-white"
                                        }`}
                                >
                                    <div
                                        className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                                        style={{ backgroundColor: project.color }}
                                    >
                                        {project.name.charAt(0)}
                                    </div>
                                    <span className="text-sm truncate">{project.name}</span>
                                </button>
                            ))}

                            {/* More Spaces */}
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#1a2924] text-gray-400 hover:text-white transition-all duration-200 cursor-pointer">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <span className="text-sm flex-1 text-left">More spaces</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </div>
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

export default UserSidebar;