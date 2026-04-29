import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import MoreNavDropdown from '../components/MoreNavModal';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Share2,
  LayoutDashboard,
  CircuitBoard,
  Scroll,
  GitBranch
} from 'lucide-react';

const ProjectNavbar = ({ projectName, projectId }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const basePath = `/projects/${projectId}`;

  const navItems = [
    { label: 'Summary', icon: LayoutDashboard, path: `${basePath}/overview` },
    { label: 'Board', icon: CircuitBoard, path: `${basePath}/board` },
    { label: 'Backlog', icon: Scroll, path: `${basePath}/backlog` },
    { label: 'Process Flow', icon: GitBranch, path: `${basePath}/process-flow` },
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
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      
      {/* Top Section: Project Identity & Actions */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-300 text-xs font-bold shadow-sm dark:shadow-indigo-500/10">
            <span>TK</span>
          </div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              {projectName}
            </h2>
            <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors duration-200">
              <MoreHorizontal className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-lg transition-colors duration-200">
            <Share2 className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
      </div>

      {/* Bottom Section: Tabs Navigation */}
      <div className="relative flex items-center px-2 lg:px-4 py-1">
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 z-10 bg-gradient-to-r from-white dark:from-slate-950 to-transparent p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="no-scrollbar flex flex-1 items-center gap-0.5 overflow-x-auto scroll-smooth"
        >
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-all duration-200 whitespace-nowrap rounded-lg group
                  ${active 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                  }`}
              >
                <item.icon className={`h-4 w-4 transition-colors ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-500'}`} />
                <span>{item.label}</span>
                {item.tag && (
                  <span className="ml-1 rounded-md bg-indigo-100 dark:bg-indigo-900/50 px-1.5 py-0.5 text-[8px] font-bold text-indigo-700 dark:text-indigo-300">
                    {item.tag}
                  </span>
                )}
              </button>
            );
          })}
          
          <div className="relative">
            <button
              onClick={() => setIsModalOpen(!isModalOpen)}
              className={`p-2 rounded-lg transition-all duration-200 ml-1 ${
                isModalOpen
                  ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30'
                  : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <Plus className="h-4 w-4" />
            </button>
            <MoreNavDropdown
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              projectId={projectId}
            />
          </div>
        </div>

        {showRightArrow && (
          <button 
            onClick={() => scroll('right')} 
            className="absolute right-0 z-10 bg-gradient-to-l from-white dark:from-slate-950 to-transparent p-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default ProjectNavbar;