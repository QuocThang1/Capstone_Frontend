import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Plus, MoreHorizontal, Share2, LayoutDashboard,
  CircuitBoard, Scroll, GitBranch, UserPlus, Columns, Tag, Star
} from 'lucide-react';
import { cn } from '../lib/utils';
import MoreNavDropdown from './MoreNavModal';

const ProjectNavbar = ({
  projectName,
  projectId,
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

  const navItems = [
    { label: 'Summary', icon: LayoutDashboard, path: `${basePath}/overview` },
    { label: 'Board', icon: CircuitBoard, path: `${basePath}/board` },
    { label: 'Backlog', icon: Scroll, path: `${basePath}/backlog` },
    { label: 'Process Flow', icon: GitBranch, path: `${basePath}/process-flow` },
  ];

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
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        <div ref={scrollContainerRef} onScroll={checkScroll} className="no-scrollbar flex flex-1 items-center gap-0.5 overflow-x-auto scroll-smooth">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap rounded-lg ${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 cursor-pointer' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer'}`}
            >
              <item.icon className={`h-4 w-4 ${isActive(item.path) ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
            </button>
          ))}
          <div className="relative">
            <button onClick={() => setIsMoreNavOpen(!isMoreNavOpen)} className={`p-2 rounded-lg ml-1 ${isMoreNavOpen ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer'}`}>
              <Plus className="h-4 w-4" />
            </button>
            <MoreNavDropdown isOpen={isMoreNavOpen} onClose={() => setIsMoreNavOpen(false)} projectId={projectId} />
          </div>
        </div>
        {showRightArrow && (
          <button onClick={() => scroll('right')} className="absolute right-0 z-10 bg-gradient-to-l from-white dark:from-slate-950 to-transparent p-1 cursor-pointer">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default ProjectNavbar;