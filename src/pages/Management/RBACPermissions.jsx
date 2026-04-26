import { useState } from "react";
import { Shield, Plus, Search, ChevronDown, Check, X } from "lucide-react";
import { motion } from "framer-motion";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const USERS = [
  { id: 1, name: "Peo", email: "peo@taska.io", role: "SYSTEM_ADMIN", initials: "P", color: "bg-indigo-600", lastActive: "Active now" },
  { id: 2, name: "Sarah Chen", email: "sarah@taska.io", role: "PROJECT_ADMIN", initials: "SC", color: "bg-emerald-500", lastActive: "2m ago" },
  { id: 3, name: "Marcus Rivera", email: "marcus@taska.io", role: "PROJECT_ADMIN", initials: "MR", color: "bg-violet-500", lastActive: "1h ago" },
  { id: 4, name: "Aisha Patel", email: "aisha@taska.io", role: "USER", initials: "AP", color: "bg-amber-500", lastActive: "3h ago" },
  { id: 5, name: "Jake Thompson", email: "jake@taska.io", role: "USER", initials: "JT", color: "bg-rose-500", lastActive: "Yesterday" },
  { id: 6, name: "Lena Müller", email: "lena@taska.io", role: "USER", initials: "LM", color: "bg-cyan-500", lastActive: "2 days ago" },
];

const PERMISSIONS = [
  { module: "Projects", actions: ["View", "Create", "Edit", "Delete"] },
  { module: "Events", actions: ["View", "Create", "Export"] },
  { module: "Team", actions: ["View", "Manage"] },
  { module: "Audit Logs", actions: ["View", "Export"] },
  { module: "Automation", actions: ["View", "Create", "Edit", "Delete"] },
  { module: "Settings", actions: ["View", "Edit"] },
];

const ROLE_PERMS = {
  SYSTEM_ADMIN: "all",
  PROJECT_ADMIN: ["Projects:View","Projects:Create","Projects:Edit","Events:View","Events:Create","Events:Export","Team:View","Audit Logs:View"],
  USER: ["Projects:View","Events:View","Team:View"],
};

const roleColors = {
  SYSTEM_ADMIN: "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400",
  PROJECT_ADMIN: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
  USER: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
};

const roleLabels = {
  SYSTEM_ADMIN: "System Admin",
  PROJECT_ADMIN: "Project Admin",
  USER: "User",
};

const RBACPermissions = () => {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  const roles = ["All", "SYSTEM_ADMIN", "PROJECT_ADMIN", "USER"];

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = selectedRole === "All" || u.role === selectedRole;
    return matchSearch && matchRole;
  });

  const hasPermission = (role, module, action) => {
    const perms = ROLE_PERMS[role];
    if (perms === "all") return true;
    return perms.includes(`${module}:${action}`);
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">RBAC & Permissions</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Manage role-based access control for your organization.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20 self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Role summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { role: "SYSTEM_ADMIN", count: USERS.filter((u) => u.role === "SYSTEM_ADMIN").length, desc: "Full system access" },
          { role: "PROJECT_ADMIN", count: USERS.filter((u) => u.role === "PROJECT_ADMIN").length, desc: "Project-level access" },
          { role: "USER", count: USERS.filter((u) => u.role === "USER").length, desc: "Read & create access" },
        ].map((r) => (
          <div key={r.role} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${roleColors[r.role]}`}>{roleLabels[r.role]}</span>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-3">{r.count}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{r.desc}</p>
          </div>
        ))}
      </div>

      {/* User table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="flex gap-2">
            {roles.map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRole(r)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedRole === r
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                {r === "All" ? "All" : roleLabels[r]}
              </button>
            ))}
          </div>
        </div>

        <motion.div variants={container} initial="hidden" animate="show">
          {filtered.map((user, i) => (
            <motion.div
              key={user.id}
              variants={item}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i !== filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
            >
              <div className={`w-9 h-9 rounded-full ${user.color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                {user.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:block">{user.lastActive}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded ${roleColors[user.role]}`}>
                {roleLabels[user.role]}
              </span>
              <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                Change <ChevronDown className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Permission matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Permission Matrix
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Module / Action</th>
                {["SYSTEM_ADMIN", "PROJECT_ADMIN", "USER"].map((r) => (
                  <th key={r} className="text-center px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{roleLabels[r]}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((perm) =>
                perm.actions.map((action, ai) => (
                  <tr key={`${perm.module}-${action}`} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-2.5">
                      {ai === 0 && <span className="font-semibold text-slate-700 dark:text-slate-300">{perm.module}</span>}
                      <span className="ml-2 text-slate-400 dark:text-slate-500">{action}</span>
                    </td>
                    {["SYSTEM_ADMIN", "PROJECT_ADMIN", "USER"].map((r) => (
                      <td key={r} className="text-center px-4 py-2.5">
                        {hasPermission(r, perm.module, action)
                          ? <Check className="w-4 h-4 text-emerald-500 mx-auto" />
                          : <X className="w-4 h-4 text-slate-200 dark:text-slate-700 mx-auto" />
                        }
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RBACPermissions;
