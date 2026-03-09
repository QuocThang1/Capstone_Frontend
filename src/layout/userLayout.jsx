import { useState } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../components/topBar";
import UserSidebar from "../components/userSidebar";

const UserLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <UserSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
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