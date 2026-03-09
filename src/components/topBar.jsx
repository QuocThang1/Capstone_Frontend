import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

const TopBar = ({ currentPageTitle }) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    return (
        <div className="bg-white shadow-sm px-8 py-4 flex items-center justify-between sticky top-0 z-10">
            {/* Page Title & Welcome Message */}
            <div>
                <h2 className="text-2xl font-bold text-[#101A17]">
                    {currentPageTitle || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Welcome back, {auth.user.fullName}!
                </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer relative">
                    <svg
                        className="w-6 h-6 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    {/* Notification Badge */}
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Button */}
                <button
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-[#4ADE80] to-[#22D3EE] rounded-full flex items-center justify-center font-bold text-[#101A17] text-sm">
                        {auth.user.fullName?.charAt(0).toUpperCase() || "A"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                </button>
            </div>
        </div>
    );
};

export default TopBar;