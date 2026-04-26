import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Share2,
  Zap,
  Activity,
  GitBranch,
  Users,
  Shield,
  FileText,
  Upload,
  Settings,
  LayoutDashboard
} from 'lucide-react';

const ProjectNavbar = ({ projectName, projectId }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const basePath = `/projects/${projectId}`;

  const navItems = [
    { label: 'Summary', icon: LayoutDashboard, path: `${basePath}/overview` },
    { label: 'Real-time Log', icon: Activity, path: `${basePath}/realtime-logs` },
    { label: 'Process Flow', icon: GitBranch, path: `${basePath}/process-flow` },
    { label: 'Bottleneck', icon: Zap, path: `${basePath}/bottleneck-detector`, tag: 'AI' },
    { label: 'Team Health', icon: Users, path: `${basePath}/team-health` },
    { label: 'RBAC', icon: Shield, path: `${basePath}/rbac` },
    { label: 'Audit Logs', icon: FileText, path: `${basePath}/audit-logs` },
    { label: 'Automation', icon: Settings, path: `${basePath}/automation-rules` },
  ];

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-40 w-full border-b transition-colors duration-200 
      ${isDark ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-slate-200 bg-white text-slate-600'}`}>
      
      {/* Top Section: Project Identity & Actions */}
      <div className="flex items-center justify-between px-4 py-2 lg:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-600 text-white shadow-sm">
            <span className="text-xs font-bold">TK</span>
          </div>
          <div className="flex items-center gap-1">
            <h2 className={`text-sm font-medium ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
              {projectName}
            </h2>
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Tabs Navigation (Jira Style) */}
      <div className="relative flex items-center px-2 lg:px-4">
        {showLeftArrow && (
          <button onClick={() => scroll('left')} className="absolute left-0 z-10 bg-gradient-to-r from-white dark:from-slate-950 p-1">
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto scroll-smooth"
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap group
                  ${active 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-t-md'
                  }`}
              >
                <item.icon className={`h-4 w-4 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.tag && (
                  <span className="ml-1 rounded bg-indigo-100 px-1 py-0.5 text-[8px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                    {item.tag}
                  </span>
                )}
                {/* Active Indicator Line */}
                {active && (
                  <div className="absolute bottom-0 left-0 h-0.5 w-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_-2px_8px_rgba(79,70,229,0.4)]" />
                )}
              </button>
            );
          })}
          
          <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {showRightArrow && (
          <button onClick={() => scroll('right')} className="absolute right-0 z-10 bg-gradient-to-l from-white dark:from-slate-950 p-1">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default ProjectNavbar;