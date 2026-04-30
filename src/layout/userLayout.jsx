import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/mainPage/topBar";
import UserSidebar from "../components/mainPage/userSidebar";
import { cn } from "../lib/utils";

const UserLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            {/* Sidebar with flex-shrink-0 to prevent collapse */}
            <UserSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content Wrapper - flex-1 and min-w-0 allow proper shrinking */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
                {/* Topbar */}
                <TopBar currentPageTitle="Workspaces" />

                {/* Content Area - min-w-0 ensures cards shrink during sidebar transition */}
                <main className="flex-1 min-w-0 overflow-auto p-6 bg-slate-50 dark:bg-slate-950">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default UserLayout;