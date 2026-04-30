import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import {
  Activity,
  Zap,
  Users,
  Shield,
  FileText,
  Settings,
} from 'lucide-react';

const MoreNavDropdown = ({ isOpen, onClose, projectId }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const basePath = `/projects/${projectId}`;

  const additionalItems = [
    { label: 'Real-time Log', icon: Activity, path: `${basePath}/realtime-logs`, description: 'Monitor real-time events' },
    { label: 'Bottleneck', icon: Zap, path: `${basePath}/bottleneck-detector`, description: 'AI-powered analysis', tag: 'AI' },
    { label: 'Team Health', icon: Users, path: `${basePath}/team-health`, description: 'Team performance metrics' },
    { label: 'RBAC', icon: Shield, path: `${basePath}/rbac`, description: 'Manage permissions' },
    { label: 'Audit Logs', icon: FileText, path: `${basePath}/audit-logs`, description: 'View audit trail' },
    { label: 'Automation', icon: Settings, path: `${basePath}/automation-rules`, description: 'Set automation rules' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className={`fixed top-20 right-6 rounded-lg shadow-2xl min-w-max z-[9999] origin-top-right
        transform transition-all duration-200 ease-out
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}
    >
      {/* Items Grid */}
      <div className="p-3 grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
        {additionalItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-left
              ${isDark
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-slate-100 text-slate-700'
              }`}
          >
            <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0
              ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <item.icon className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`font-medium text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                  {item.label}
                </p>
                {item.tag && (
                  <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 whitespace-nowrap">
                    {item.tag}
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {item.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoreNavDropdown;
