import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AuditOutlined,
  BellOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  HeartOutlined,
  LockOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const AdminSidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/admin'
    },
    {
      key: 'users',
      icon: <UserOutlined />,
      label: 'User Management',
      path: '/admin/users'
    },
    {
      key: 'platform-users',
      icon: <TeamOutlined />,
      label: 'Platform Users',
      path: '/admin/platform-users'
    },
    {
      key: 'organizations',
      icon: <DatabaseOutlined />,
      label: 'Organizations',
      path: '/admin/organizations'
    },
    {
      key: 'support',
      icon: <HeartOutlined />,
      label: 'Support Center',
      path: '/admin/support'
    },
    {
      key: 'health',
      icon: <HeartOutlined />,
      label: 'System Health',
      path: '/admin/health'
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Notifications',
      path: '/admin/notifications'
    },
    {
      key: 'security',
      icon: <LockOutlined />,
      label: 'Data Security',
      path: '/admin/security'
    },
    {
      key: 'audit-logs',
      icon: <AuditOutlined />,
      label: 'Audit Logs',
      path: '/admin/audit-logs'
    },
    {
      key: 'roles',
      icon: <SafetyCertificateOutlined />,
      label: 'Roles',
      path: '/admin/roles'
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
      path: '/admin/settings'
    }
  ];

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
