import { useState } from "react";
import { Checkbox, Button, ConfigProvider, message } from "antd";
import { cn } from "@/lib/utils";

const platformRoles = [
  {
    id: "super-admin",
    name: "Platform Super Admin",
    description: "Full access to all platform settings, organizations, and data.",
    userCount: 3,
    color: "bg-red-100 text-red-600",
  },
  {
    id: "support-admin",
    name: "Support Admin",
    description: "Access to user support, troubleshooting tools, and system health monitoring.",
    userCount: 8,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    id: "system-operator",
    name: "System Operator",
    description: "Operational access for monitoring services, incidents, and scheduled jobs.",
    userCount: 5,
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    id: "billing-manager",
    name: "Billing Manager",
    description: "Manages subscriptions, plans, invoices, and organization billing status.",
    userCount: 4,
    color: "bg-amber-100 text-amber-700",
  },
  {
    id: "read-only-auditor",
    name: "Read-only Auditor",
    description: "View-only access to all platform data and audit logs.",
    userCount: 12,
    color: "bg-slate-100 text-slate-700",
  },
];

const permissions = [
  "Manage Organizations",
  "Manage Platform Users",
  "Manage Subscriptions",
  "Manage System Settings",
  "Manage Platform Roles",
  "View Audit Logs",
  "Monitor System Health",
  "Manage Data Security",
  "Manage Global Notifications",
  "Support and Troubleshooting",
];

const initialMatrix = {
  "Platform Super Admin": Object.fromEntries(permissions.map(permission => [permission, true])),
  "Support Admin": {
    "View Audit Logs": true,
    "Monitor System Health": true,
    "Support and Troubleshooting": true,
  },
  "System Operator": {
    "Manage System Settings": true,
    "View Audit Logs": true,
    "Monitor System Health": true,
  },
  "Billing Manager": {
    "Manage Organizations": true,
    "Manage Subscriptions": true,
    "View Audit Logs": true,
  },
  "Read-only Auditor": {
    "View Audit Logs": true,
    "Monitor System Health": true,
  },
};

export default function RolesPermissionsPage() {
  const [selectedRole, setSelectedRole] = useState(platformRoles[0]);
  const [matrix, setMatrix] = useState(initialMatrix);

  const handleToggle = (permission) => {
    if (!selectedRole) return;

    setMatrix(prev => ({
      ...prev,
      [selectedRole.name]: {
        ...prev[selectedRole.name],
        [permission]: !prev[selectedRole.name]?.[permission]
      }
    }));
  };

  const handleSave = () => {
    if (!selectedRole) return;

    message.success(`Permissions updated for ${selectedRole.name}`);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6366f1",
          colorPrimaryHover: "#4f46e5",
          colorPrimaryActive: "#4338ca",
        },
      }}
    >
    <div className="roles-permissions-page flex flex-col h-[calc(100vh-120px)]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Roles & Permissions</h2>
        <Button
          type="primary"
          onClick={handleSave}
          className="role-save-button h-10 px-6 shadow-sm"
        >
          Save Changes
        </Button>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        <div className="w-64 flex flex-col gap-3 overflow-y-auto">
          {platformRoles.map(role => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={cn(
                "role-card text-left p-4 rounded-xl border transition-colors min-h-[88px] focus:outline-none",
                selectedRole.id === role.id 
                  ? "role-card-active bg-indigo-50 border-indigo-200 dark:bg-indigo-900/30 dark:border-indigo-800"
                  : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
              )}
            >
              <div className="font-semibold text-slate-900 dark:text-slate-100">{role.name}</div>
              <div className="text-sm text-slate-500 mt-2">{role.userCount} users</div>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
            <div className={cn("inline-block px-2.5 py-1 rounded-full text-xs font-semibold mb-3", selectedRole.color)}>
              {selectedRole.name}
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-base">{selectedRole.description}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                  <th className="text-left py-4 px-6 font-medium text-slate-500">Permission</th>
                  <th className="py-4 px-6 text-center font-medium text-slate-500 w-32">Access</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, idx) => (
                  <tr key={perm} className={cn("border-b border-slate-100 dark:border-slate-800/50", idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/20")}>
                    <td className="py-4 px-6 text-sm font-medium text-slate-700 dark:text-slate-300">{perm}</td>
                    <td className="py-4 px-6 text-center">
                      <Checkbox 
                        checked={matrix[selectedRole.name]?.[perm] || false}
                        onChange={() => handleToggle(perm)}
                        className="role-checkbox mx-auto"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    </ConfigProvider>
  );
}
