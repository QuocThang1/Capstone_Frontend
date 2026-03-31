import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/mainPage/topBar";
import UserSidebar from "../components/mainPage/userSidebar";
import { cn } from "../lib/utils";

const UserLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className={cn(
            "min-h-screen bg-white dark:bg-slate-950 transition-all duration-300",
            isCollapsed ? "ml-20" : "ml-64"
        )}>
            {/* Sidebar */}
            <UserSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content */}
            <div className="flex flex-col h-screen overflow-hidden">
                {/* Topbar */}
                <TopBar currentPageTitle="Workspaces" />

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;