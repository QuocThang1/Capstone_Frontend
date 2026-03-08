import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import AdminTopBar from "../components/AdminTopBar";

const AdminLayout = () => {
    const location = useLocation();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Menu items for title display
    const menuItems = [
        { title: "Dashboard", path: "/admin" },
        { title: "User Management", path: "/admin/users" },
        { title: "Settings", path: "/admin/settings" },
    ];

    // Get current page title based on path
    const getCurrentPageTitle = () => {
        const currentItem = menuItems.find((item) => location.pathname === item.path);
        return currentItem?.title || "Dashboard";
    };

    return (
        <div className="flex h-screen bg-[#F6F8F7]">
            {/* Sidebar Component */}
            <AdminSidebar
                isCollapsed={isSidebarCollapsed}
                setIsCollapsed={setIsSidebarCollapsed}
            />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Top Bar Component */}
                <AdminTopBar currentPageTitle={getCurrentPageTitle()} />

                {/* Content Area */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;