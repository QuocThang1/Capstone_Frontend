import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Plus, MoreHorizontal, Share2, LayoutDashboard,
  CircuitBoard, Scroll, GitBranch, UserPlus, Columns, Tag, Star, LayoutList,
  Activity, Zap, Users, Shield, FileText, Settings, X
} from 'lucide-react';
import { toast } from 'react-toastify';
import { cn } from '../lib/utils';
import MoreNavDropdown from './MoreNavModal';
import SelectDropdown from './selectDropdown';
import { updateProjectApi } from '../utils/Api/projectApi';

const ProjectNavbar = ({
  projectName,
  projectId,
  projectTimezone,
  fetchProjectData,
  fetchIssuesData,
  onAddMember,
  onEditBoard,
  onEditIssueTypes,
  isStarred,
  onToggleStar,
  starLoading
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const menuRef = useRef(null);

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMoreNavOpen, setIsMoreNavOpen] = useState(false);
  const [isProjectMenuOpen, setProjectMenuOpen] = useState(false);

  const basePath = `/projects/${projectId}`;

  // KHỞI TẠO CẤU HÌNH CHO TẤT CẢ CÁC NAV ITEMS GỒM MẶC ĐỊNH VÀ MỞ RỘNG
  const allNavItems = useMemo(() => [
    { id: 'overview', label: 'Summary', icon: LayoutDashboard, path: `${basePath}/overview`, fixed: true },
    { id: 'board', label: 'Board', icon: CircuitBoard, path: `${basePath}/board`, fixed: true },
    { id: 'backlog', label: 'Backlog', icon: Scroll, path: `${basePath}/backlog`, fixed: true },
    { id: 'process-flow', label: 'Process Flow', icon: GitBranch, path: `${basePath}/process-flow`, fixed: true },
    { id: 'list', label: 'List', icon: LayoutList, path: `${basePath}/list`, fixed: true },

    // Các tùy chọn nâng cao có thể Pin / Unpin
    { id: 'realtime-logs', label: 'Real-time Log', icon: Activity, path: `${basePath}/realtime-logs`, description: 'Monitor real-time events', fixed: false },
    { id: 'bottleneck-detector', label: 'Bottleneck', icon: Zap, path: `${basePath}/bottleneck-detector`, description: 'AI-powered analysis', tag: 'AI', fixed: false },
    { id: 'team-health', label: 'Team Health', icon: Users, path: `${basePath}/team-health`, description: 'Team metrics', fixed: false },
    { id: 'rbac', label: 'RBAC', icon: Shield, path: `${basePath}/rbac`, description: 'Manage permissions', fixed: false },
    { id: 'audit-logs', label: 'Audit Logs', icon: FileText, path: `${basePath}/audit-logs`, description: 'View audit trail', fixed: false },
    { id: 'automation-rules', label: 'Automation', icon: Settings, path: `${basePath}/automation-rules`, description: 'Set automation rules', fixed: false },
  ], [basePath]);

  const timezoneOptions = [
    { label: 'UTC (GMT+0)', value: 'UTC' },
    { label: 'Việt Nam (GMT+7)', value: 'Asia/Ho_Chi_Minh' },
    { label: 'Singapore (GMT+8)', value: 'Asia/Singapore' },
  ];

  const TIMEZONE_LABELS = {
    UTC: 'UTC (GMT+0)',
    'Asia/Ho_Chi_Minh': 'Việt Nam (GMT+7)',
    'Asia/Singapore': 'Singapore (GMT+8)',
  };

  const timezoneLabel = TIMEZONE_LABELS[projectTimezone] || projectTimezone || 'UTC';
  const [isTimezoneSaving, setIsTimezoneSaving] = useState(false);

  const handleTimezoneChange = async (timezone) => {
    if (!projectId || timezone === projectTimezone) return;

    setIsTimezoneSaving(true);
    try {
      const res = await updateProjectApi(projectId, { timezone });
      if (res?.EC === 0) {
        toast.success(res.EM || 'Timezone updated');
        fetchProjectData();
        fetchIssuesData();
      } else {
        toast.error(res?.EM || 'Failed to update timezone');
      }
    } catch (error) {
      toast.error(error?.response?.data?.EM || 'Failed to update timezone');
    } finally {
      setIsTimezoneSaving(false);
    }
  };

  // Quản lý Pinned state qua LocalStorage (Mặc định pin những cái fixed)
  const defaultPinnedIds = allNavItems.filter(item => item.fixed).map(item => item.id);

  const [pinnedIds, setPinnedIds] = useState(() => {
    const saved = localStorage.getItem(`pinned_nav_${projectId}`);
    return saved ? JSON.parse(saved) : defaultPinnedIds;
  });

  const togglePin = (id) => {
    setPinnedIds(prev => {
      let next = [...prev];
      if (next.includes(id)) {
        next = next.filter(i => i !== id);
      } else {
        next.push(id);
      }
      localStorage.setItem(`pinned_nav_${projectId}`, JSON.stringify(next));
      return next;
    });
  };

  // Phân loại list ra thanh nav và modal More
  const pinnedItems = allNavItems.filter(item => item.fixed || pinnedIds.includes(item.id));
  const unpinnedItems = allNavItems.filter(item => !item.fixed && !pinnedIds.includes(item.id));

  const projectMenuItems = [
    { label: 'Add members', icon: UserPlus, action: onAddMember },
    { label: 'Edit board columns', icon: Columns, action: onEditBoard },
    { label: 'Edit issue types', icon: Tag, action: onEditIssueTypes },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProjectMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  }, [pinnedItems]); // Trigger lại check scroll khi pin state đổi

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
            <span>TK</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">{projectName}</h1>
            <button
              onClick={onToggleStar}
              disabled={starLoading}
              className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:cursor-wait cursor-pointer transition-colors duration-200"
              aria-label={isStarred ? "Unstar project" : "Star project"}
            >
              <Star className={cn("w-5 h-5 transition-colors", isStarred ? "text-yellow-400 fill-current" : "text-slate-400 hover:text-slate-600")} />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {timezoneLabel}
            </span>
          </div>
          <div className="w-44">
            <SelectDropdown
              value={projectTimezone || 'UTC'}
              options={timezoneOptions}
              onChange={handleTimezoneChange}
              placeholder="Select timezone"
              size="sm"
              width="w-44"
            />
          </div>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg cursor-pointer">
            <Share2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </button>
          <div className="relative" ref={menuRef}>
            <button onClick={() => setProjectMenuOpen(prev => !prev)} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {isProjectMenuOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 z-20">
                <div className="py-1">
                  {projectMenuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setProjectMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer "
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex items-center px-2 lg:px-4 py-1">
        {showLeftArrow && (
          <button onClick={() => scroll('left')} className="absolute left-0 z-10 bg-gradient-to-r from-white dark:from-slate-950 to-transparent p-1 cursor-pointer">
            <ChevronLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        )}
        <div ref={scrollContainerRef} onScroll={checkScroll} className="no-scrollbar flex flex-1 items-center gap-1 overflow-x-auto scroll-smooth">
          {pinnedItems.map((item) => (
            <div key={item.path} className="group relative flex items-center shrink-0">
              <button
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg cursor-pointer ${isActive(item.path)
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  } ${!item.fixed && 'pr-7'}`} // Tạo biên dư bên phải cho nút unpin
              >
                <item.icon className={`h-4 w-4 ${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>

              {/* Nút Unpin */}
              {!item.fixed && (
                <button
                  onClick={(e) => { e.stopPropagation(); togglePin(item.id); }}
                  className="absolute right-1 w-5 h-5 flex items-center justify-center rounded bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/50 dark:hover:text-rose-400 cursor-pointer"
                  title="Remove from navigation"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}

          <div className="relative ml-1 shrink-0">
            <button
              onClick={() => setIsMoreNavOpen(!isMoreNavOpen)}
              className={`p-2 rounded-lg cursor-pointer ${isMoreNavOpen ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400'}`}
              title="More Options"
            >
              <Plus className="h-4 w-4" />
            </button>
            <MoreNavDropdown
              isOpen={isMoreNavOpen}
              onClose={() => setIsMoreNavOpen(false)}
              items={unpinnedItems}
              onPin={togglePin}
            />
          </div>
        </div>
        {showRightArrow && (
          <button onClick={() => scroll('right')} className="absolute right-0 z-10 bg-gradient-to-l from-white dark:from-slate-950 to-transparent p-1 cursor-pointer">
            <ChevronRight className="h-4 w-4 text-slate-600 dark:text-slate-300" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default ProjectNavbar;