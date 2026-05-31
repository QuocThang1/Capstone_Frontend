import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "../components/mainPage/AdminSidebar";
import TopBar from "../components/mainPage/topBar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans">
      <AdminSidebar collapsed={collapsed} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar
          onMobileMenuClick={() => setMobileMenuOpen(true)}
          onSidebarToggle={() => setCollapsed(!collapsed)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
