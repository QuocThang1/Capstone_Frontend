import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { toast } from "react-toastify";

const Header = () => {
    const navigate = useNavigate();
    const { auth, setAuth } = useContext(AuthContext);
    const [showDropdown, setShowDropdown] = useState(false);

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
        setShowDropdown(false);
    };

    return (
        <header className="bg-[#101A17] text-white py-4 px-8 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <span className="font-bold text-lg">Capstone</span>
            </div>

            <nav className="flex gap-6">
                <a href="#" className="hover:text-[#4ADE80] transition-colors duration-300">Home</a>
                <a href="#" className="hover:text-[#4ADE80] transition-colors duration-300">Features</a>
                <a href="#" className="hover:text-[#4ADE80] transition-colors duration-300">Pricing</a>
                <a href="#" className="hover:text-[#4ADE80] transition-colors duration-300">About</a>
                <a href="#" className="hover:text-[#4ADE80] transition-colors duration-300">Support</a>
            </nav>

            <div className="flex items-center gap-3">
                {auth.isAuthenticated ? (
                    // User authenticated - Show welcome message and dropdown
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-2 bg-[#1a2924] px-4 py-2 rounded-lg hover:bg-[#2a3934] transition-all duration-300"
                        >
                            {/* Avatar */}
                            <div className="w-8 h-8 bg-gradient-to-br from-[#4ADE80] to-[#22D3EE] rounded-full flex items-center justify-center font-bold text-[#101A17]">
                                {auth.user.fullName?.charAt(0).toUpperCase() || auth.user.username?.charAt(0).toUpperCase() || "U"}
                            </div>

                            {/* Welcome text */}
                            <div className="flex flex-col items-start">
                                <span className="text-xs text-gray-400">Welcome</span>
                                <span className="text-sm font-semibold text-[#4ADE80]">
                                    {auth.user.fullName || auth.user.username}
                                </span>
                            </div>

                            {/* Dropdown icon */}
                            <svg
                                className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown Menu */}
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50">
                                {/* User Info */}
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="text-sm font-semibold text-[#101A17]">{auth.user.fullName}</p>
                                    <p className="text-xs text-gray-500">{auth.user.email}</p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {auth.user.role === "admin" ? "Administrator" : "User"}
                                    </p>
                                </div>

                                {/* Menu Items */}
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setShowDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#4ADE80] hover:bg-opacity-10 hover:text-[#4ADE80] transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        My Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/settings");
                                            setShowDropdown(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#4ADE80] hover:bg-opacity-10 hover:text-[#4ADE80] transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </button>

                                    {auth.user.role === "admin" && (
                                        <button
                                            onClick={() => {
                                                navigate("/admin");
                                                setShowDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#4ADE80] hover:bg-opacity-10 hover:text-[#4ADE80] transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Admin Dashboard
                                        </button>
                                    )}
                                </div>

                                {/* Logout */}
                                <div className="border-t border-gray-200 pt-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center gap-2 cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // User not authenticated - Show Sign In and Sign Up buttons
                    <>
                        <button
                            className="text-white hover:text-[#4ADE80] transition-all duration-300 font-medium hover:scale-110 cursor-pointer"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                        <button
                            className="bg-[#4ADE80] text-[#101A17] px-5 py-2 rounded font-semibold hover:bg-[#22D3EE] hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer"
                            onClick={() => navigate("/register")}
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Header;