import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { Input, Button, Badge, Avatar, Dropdown, Space } from "antd";
import { useState } from "react";

const routes = {
  "/admin": "Platform Dashboard",
  "/admin/organizations": "Organizations",
  "/admin/users": "Platform Users",
  "/admin/settings": "System Settings",
  "/admin/roles": "Roles & Permissions",
  "/admin/audit-logs": "Audit Logs",
  "/admin/security": "Data Security",
  "/admin/notifications": "Global Notifications",
  "/admin/health": "System Health",
  "/admin/support": "Support Center",
};

export default function AdminTopbar({ onMobileMenuClick, onSidebarToggle }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  let title = "Platform Dashboard";
  for (const [path, name] of Object.entries(routes)) {
    if (location.pathname === path || (path !== "/admin" && location.pathname.startsWith(path))) {
      title = name;
    }
  }

  const userMenuItems = [
    {
      label: "Profile Settings",
      key: "profile",
    },
    {
      label: "Sign out",
      key: "logout",
    },
  ];

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6"
    >
      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="text"
            icon={<Menu className="w-5 h-5" />}
            onClick={() => {
              if (window.innerWidth >= 768) {
                onSidebarToggle?.();
                return;
              }
              onMobileMenuClick?.();
            }}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.h1
            key={title}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block"
          >
            {title}
          </motion.h1>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="relative hidden md:block w-64"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search platform..."
            prefix={null}
            className="pl-9 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700 h-9"
            style={{ paddingLeft: "36px" }}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="relative"
        >
          <Button type="text" icon={null} className="relative p-0 h-auto w-auto">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 2, duration: 0.5, repeat: Infinity, repeatDelay: 8 }}
            >
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 500 }}
              className="absolute top-0 right-0"
            >
              <Badge count={3} className="bg-indigo-600" />
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            type="text"
            icon={null}
            onClick={() => setIsDark(!isDark)}
            className="relative overflow-hidden p-0 h-auto w-auto"
          >
            <motion.div
              animate={isDark ? { rotate: -90, scale: 0 } : { rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-block"
            >
              <Sun className="h-5 w-5 text-slate-600" />
            </motion.div>
            <motion.div
              animate={isDark ? { rotate: 0, scale: 1 } : { rotate: 90, scale: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="absolute"
            >
              <Moon className="h-5 w-5 text-slate-300" />
            </motion.div>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
        >
          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="cursor-pointer"
            >
              <Avatar size={32} style={{ backgroundColor: "#818cf8", verticalAlign: "middle" }}>
                AC
              </Avatar>
            </motion.div>
          </Dropdown>
        </motion.div>
      </div>
    </motion.header>
  );
}
