import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Building2, Users,
  Settings, Key, ScrollText, Lock, Bell, Activity, LifeBuoy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Building2, label: "Organizations", href: "/admin/organizations" },
  { icon: Users, label: "Platform Users", href: "/admin/users" },
  { icon: Settings, label: "System Settings", href: "/admin/settings" },
  { icon: Key, label: "Roles & Permissions", href: "/admin/roles" },
  { icon: ScrollText, label: "Audit Logs", href: "/admin/audit-logs" },
  { icon: Lock, label: "Data Security", href: "/admin/security" },
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  { icon: Activity, label: "System Health", href: "/admin/health" },
  { icon: LifeBuoy, label: "Support Center", href: "/admin/support" },
];

export default function AdminSidebar({ collapsed }) {
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 360, damping: 36 }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-40 hidden md:flex flex-col flex-shrink-0 overflow-hidden"
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
        <motion.div
          whileHover={{ rotate: [0, -12, 12, -6, 6, 0] }}
          transition={{ duration: 0.5 }}
          className="shrink-0"
        >
          <div className={cn(
            "flex items-center justify-center flex-shrink-0 text-indigo-600 dark:text-indigo-400 transition-all duration-300",
            collapsed ? "w-8 h-8" : "w-7 h-7"
          )}>
            <svg
              version="1.0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1080 1080"
              className="w-full h-full"
            >
              <g
                transform="translate(0,1080) scale(0.1,-0.1)"
                fill="currentColor"
                stroke="none"
              >
                <path d="M1590 10049 c-852 -47 -1500 -755 -1500 -1639 0 -733 442 -1357 1120 -1583 205 -68 209 -69 1071 -74 824 -6 834 -5 864 41 8 12 22 73 30 136 9 63 31 214 50 335 19 121 41 279 50 350 8 72 18 147 21 168 l6 37 -815 0 c-512 0 -834 4 -868 10 -130 25 -245 108 -325 236 -120 193 -136 408 -43 592 78 156 195 253 374 310 44 14 177 17 1165 22 914 4 1120 7 1141 19 15 7 70 63 122 125 115 135 386 418 668 699 115 114 209 212 209 217 0 12 -3132 11 -3340 -1z" />
                <path d="M6870 10050 c-25 -5 -106 -18 -180 -30 -328 -52 -663 -154 -962 -293 -697 -325 -1358 -1013 -1663 -1731 -127 -299 -199 -572 -260 -989 -25 -167 -26 -194 -35 -932 -5 -418 -9 -1437 -9 -2265 -1 -1605 -1 -1606 48 -1797 35 -134 78 -250 152 -399 103 -212 210 -352 389 -511 331 -295 616 -382 1204 -370 226 4 260 7 346 30 198 52 325 130 480 299 523 563 2861 3276 3954 4588 l87 105 -633 3 c-348 1 -643 0 -655 -3 -13 -3 -104 -99 -215 -228 -621 -715 -2606 -3040 -2945 -3448 -67 -81 -146 -165 -175 -189 -113 -90 -230 -130 -383 -130 -171 0 -283 48 -411 176 -68 66 -90 97 -128 175 -29 59 -50 120 -57 164 -9 53 -9 607 -1 2290 11 2417 8 2284 68 2553 65 289 195 591 367 846 346 517 884 875 1482 985 206 38 292 41 1344 41 1148 0 1089 3 1235 -73 444 -230 406 -880 -63 -1069 l-56 -23 -1060 -6 c-1027 -5 -1063 -6 -1170 -27 -253 -49 -439 -146 -613 -320 -207 -207 -322 -429 -352 -677 -9 -77 -10 -516 -5 -1877 4 -978 11 -1778 15 -1778 11 0 170 173 440 480 123 140 278 316 344 390 131 148 184 223 218 309 l23 56 5 1153 5 1154 28 23 c15 13 44 29 65 36 27 9 331 14 1127 18 1074 7 1091 8 1160 29 358 109 574 225 773 416 274 264 427 534 503 886 20 90 23 134 23 310 0 176 -3 220 -23 310 -74 343 -231 624 -484 867 -147 141 -345 275 -517 349 -86 37 -329 107 -430 123 -78 13 -2330 13 -2400 1z" />
              </g>
            </svg>
          </div>
        </motion.div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="logo-text"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="ml-3 flex flex-col overflow-hidden"
            >
              <span className="font-bold text-lg leading-tight tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                TASKA
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider whitespace-nowrap">
                Admin
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2">
        {navItems.map((item, i) => {
          const isActive =
            location.pathname === item.href ||
            (item.href !== "/admin" && location.pathname.startsWith(item.href));

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 30,
                delay: i * 0.045,
              }}
            >
              <Link
                to={item.href}
                style={{ textDecoration: "none" }}
                className={cn(
                  "flex items-center px-2 py-2.5 rounded-lg relative group transition-colors block",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-600 dark:bg-indigo-500 rounded-r-full"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}

                <motion.div
                  whileHover={{ scale: 1.18 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="shrink-0"
                >
                  <item.icon className="w-5 h-5" />
                </motion.div>

                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.span
                      key="label"
                      initial={{ opacity: 0, x: -8, width: 0 }}
                      animate={{ opacity: 1, x: 0, width: "auto" }}
                      exit={{ opacity: 0, x: -8, width: 0 }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="ml-3 text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {collapsed && (
                  <div className="absolute left-14 px-2 py-1 bg-slate-800 dark:bg-slate-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {item.label}
                  </div>
                )}
              </Link>
            </motion.div>
          );
        })}
      </div>

    </motion.aside>
  );
}
