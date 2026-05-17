import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import useDarkMode from '../hooks/useDarkMode';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  MoreVertical,
  Share2,
  LayoutDashboard,
  CircuitBoard,
  Scroll,
  GitBranch,
  X,
  Edit2,
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const DEFAULT_TABS = [
  { id: 'summary', label: 'Summary', icon: LayoutDashboard, path: '/overview', isDefault: true },
  { id: 'board', label: 'Board', icon: CircuitBoard, path: '/board', isDefault: false },
  { id: 'backlog', label: 'Backlog', icon: Scroll, path: '/backlog', isDefault: false },
  { id: 'process-flow', label: 'Process Flow', icon: GitBranch, path: '/process-flow', isDefault: false },
];

const ProjectNavbar = ({ projectName, projectId }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  const basePath = `/projects/${projectId}`;
  const allTabs = DEFAULT_TABS.map(tab => ({ ...tab, path: `${basePath}${tab.path}` }));

  // State Management
  const [activeTabs, setActiveTabs] = useState(allTabs.slice(0, 3));
  const [defaultTabId, setDefaultTabId] = useState('summary');
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hoveredTabId, setHoveredTabId] = useState(null);
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });
  const [dropdownCoords, setDropdownCoords] = useState({ top: 0, right: 0 });
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const dropdownContentRef = useRef(null);

  const availableTabs = allTabs.filter(tab => !activeTabs.find(active => active.id === tab.id));

  // Check scroll position
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
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', checkScroll);
    return () => {
      window.removeEventListener('resize', checkScroll);
      container?.removeEventListener('scroll', checkScroll);
    };
  }, []);

  // Click outside handler to close menus
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && 
          dropdownContentRef.current && !dropdownContentRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      // Reset hover state if clicking outside tabs
      const tabsContainer = scrollContainerRef.current;
      if (tabsContainer && !tabsContainer.contains(e.target)) {
        setHoveredTabId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll handler
  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  // Tab Actions with proper event handling
  const addTabFromDropdown = useCallback((tab) => {
    setActiveTabs([...activeTabs, tab]);
    setIsDropdownOpen(false);
  }, [activeTabs]);

  const removeTab = useCallback((tabId, e) => {
    e?.stopPropagation();
    setActiveTabs(activeTabs.filter(t => t.id !== tabId));
    setOpenMenuId(null);
  }, [activeTabs]);

  const moveTab = useCallback((tabId, direction, e) => {
    e?.stopPropagation();
    const index = activeTabs.findIndex(t => t.id === tabId);
    if ((direction === 'left' && index > 0) || (direction === 'right' && index < activeTabs.length - 1)) {
      const newTabs = [...activeTabs];
      const swapIndex = direction === 'left' ? index - 1 : index + 1;
      [newTabs[index], newTabs[swapIndex]] = [newTabs[swapIndex], newTabs[index]];
      setActiveTabs(newTabs);
      setOpenMenuId(null);
    }
  }, [activeTabs]);

  const setAsDefault = useCallback((tabId, e) => {
    e?.stopPropagation();
    setDefaultTabId(tabId);
    setOpenMenuId(null);
  }, []);

  const startRenaming = useCallback((tab, e) => {
    e?.stopPropagation();
    setEditingTabId(tab.id);
    setEditingLabel(tab.label);
    setOpenMenuId(null);
  }, []);

  const saveRename = useCallback((tabId) => {
    setActiveTabs(activeTabs.map(t =>
      t.id === tabId ? { ...t, label: editingLabel } : t
    ));
    setEditingTabId(null);
  }, [activeTabs, editingLabel]);

  const isActive = (path) => location.pathname === path;

  // Handle menu open with coordinates
  const handleMenuOpen = (e, tabId) => {
    e.stopPropagation();
    if (openMenuId === tabId) {
      setOpenMenuId(null);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuCoords({
        top: rect.bottom + 8,
        left: rect.right - 180
      });
      setOpenMenuId(tabId);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 overflow-visible ${
      isDark ? 'border-slate-700 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300' 
        : 'border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-600'
    }`}>
      
      {/* Top Section: Project Identity & Actions */}
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 border-b transition-colors duration-200 ${
        isDark ? 'border-slate-800' : 'border-slate-150'
      }">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md">
            <span className="text-xs font-bold">TK</span>
          </div>
          <div className="flex items-center gap-1">
            <h2 className={`text-sm font-semibold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {projectName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
            isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-indigo-400' 
              : 'hover:bg-slate-100 text-slate-500 hover:text-indigo-600'
          }`}>
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation - Dynamic Taskbar */}
      <div className="relative flex items-center px-2 lg:px-4 py-2 gap-1 overflow-visible">
        {/* Left Scroll Arrow */}
        <AnimatePresence>
          {showLeftArrow && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className={`absolute left-0 z-20 p-1 rounded-md transition-all duration-200 flex-shrink-0 ${
                isDark ? 'bg-gradient-to-r from-slate-950 to-transparent hover:text-indigo-400' 
                  : 'bg-gradient-to-r from-white to-transparent hover:text-indigo-600'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Active Tabs Container */}
        <Reorder.Group
          axis="x"
          values={activeTabs}
          onReorder={setActiveTabs}
          className="no-scrollbar flex flex-1 items-center gap-1 scroll-smooth"
          style={{ overflow: 'visible' }}
          ref={scrollContainerRef}
          onScroll={checkScroll}
        >
          <AnimatePresence mode="popLayout">
            {activeTabs.map((tab, index) => {
              const active = isActive(tab.path);
              const isEditing = editingTabId === tab.id;
              const isMenuOpen = openMenuId === tab.id;
              const isHovered = hoveredTabId === tab.id;

              return (
                <Reorder.Item
                  key={tab.id}
                  value={tab}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredTabId(tab.id)}
                  onMouseLeave={() => {
                    // Chỉ xóa hover nếu menu không mở
                    if (openMenuId !== tab.id) {
                      setHoveredTabId(null);
                    }
                  }}
                  className={`relative inline-block flex-shrink-0 transition-all duration-200 ${isMenuOpen ? 'z-[100]' : 'z-auto'}`}
                >
                  <motion.button
                    onClick={() => !isEditing && navigate(tab.path)}
                    layout
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap group cursor-grab active:cursor-grabbing
                      ${active
                        ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }
                    `}
                  >
                    {/* Tab Icon - Replace with 3-dots on Hover */}
                    <div
                      onClick={(e) => {
                        if (isHovered && !isEditing) {
                          e.stopPropagation();
                          // Find parent button to get correct coordinates
                          const button = e.currentTarget.closest('button');
                          if (button) {
                            const rect = button.getBoundingClientRect();
                            setMenuCoords({
                              top: rect.bottom + 8,
                              left: rect.right - 180
                            });
                            setOpenMenuId(tab.id);
                          }
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <AnimatePresence mode="wait">
                        {isHovered && !isEditing ? (
                          <motion.div
                            key="more-icon"
                            initial={{ opacity: 0, scale: 0.8, rotate: 90}}
                            animate={{ opacity: 1, scale: 1 , rotate: 90}}
                            exit={{ opacity: 0, scale: 0.8, rotate: 90}}
                            transition={{ duration: 0.15 }}
                            className="p-0 hover:scale-110 transition-transform"
                          >
                            <MoreVertical className={`h-4 w-4 ${
                              isDark ? 'text-slate-400 hover:text-indigo-400'
                                : 'text-slate-500 hover:text-indigo-600'
                            }`} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="tab-icon"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                          >
                            <tab.icon className={`h-4 w-4 transition-colors duration-200 ${
                              active ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-500'
                            }`} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Tab Label - Edit or Display */}
                    {isEditing ? (
                      <input
                        autoFocus
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onBlur={() => saveRename(tab.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(tab.id);
                          if (e.key === 'Escape') setEditingTabId(null);
                        }}
                        className={`outline-none bg-transparent border-b border-indigo-500 px-1 py-0 min-w-fit ${
                          isDark ? 'text-indigo-300' : 'text-indigo-600'
                        }`}
                      />
                    ) : (
                      <span>{tab.label}</span>
                    )}

                    {/* Default Badge */}
                    {defaultTabId === tab.id && (
                      <motion.span
                        layoutId={`default-badge-${tab.id}`}
                        className="flex items-center gap-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300"
                      >
                        <Star className="h-3 w-3" />
                        Default
                      </motion.span>
                    )}

                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="active-indicator"
                        className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-indigo-600 to-indigo-400 dark:to-indigo-300 rounded-t-lg shadow-lg"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>

                  {/* Tab Actions Dropdown Menu - Rendered via Portal */}
                  <AnimatePresence>
                    {isMenuOpen && openMenuId === tab.id &&
                      createPortal(
                        <motion.div
                          ref={menuRef}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className={`fixed min-w-[180px] rounded-lg border z-[99999] transition-all duration-200 pointer-events-auto isolation-auto ${
                            isDark
                              ? 'bg-slate-800 border-slate-700 shadow-2xl'
                              : 'bg-white border-slate-200 shadow-2xl'
                          }`}
                          style={{
                            top: `${menuCoords.top}px`,
                            left: `${menuCoords.left}px`
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Set as Default Button */}
                          <motion.button
                            whileHover={{ x: 2 }}
                            onClick={(e) => setAsDefault(tab.id, e)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                              defaultTabId === tab.id
                                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                                : isDark
                                  ? 'text-slate-300 hover:bg-slate-700 hover:text-indigo-400'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                            } ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
                          >
                            <Star className="h-4 w-4" />
                            <span>Set as default</span>
                          </motion.button>

                          {/* Rename Button */}
                          <motion.button
                            whileHover={{ x: 2 }}
                            onClick={(e) => startRenaming(tab, e)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                              isDark
                                ? 'text-slate-300 hover:bg-slate-700 hover:text-indigo-400 border-slate-700'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                            }`}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Rename</span>
                          </motion.button>

                          {/* Move Left Button */}
                          {activeTabs.findIndex(t => t.id === tab.id) > 0 && (
                            <motion.button
                              whileHover={{ x: 2 }}
                              onClick={(e) => moveTab(tab.id, 'left', e)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                                isDark
                                  ? 'text-slate-300 hover:bg-slate-700 hover:text-indigo-400 border-slate-700'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                              }`}
                            >
                              <ArrowLeft className="h-4 w-4" />
                              <span>Move left</span>
                            </motion.button>
                          )}

                          {/* Move Right Button */}
                          {activeTabs.findIndex(t => t.id === tab.id) < activeTabs.length - 1 && (
                            <motion.button
                              whileHover={{ x: 2 }}
                              onClick={(e) => moveTab(tab.id, 'right', e)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                                isDark
                                  ? 'text-slate-300 hover:bg-slate-700 hover:text-indigo-400 border-slate-700'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                              }`}
                            >
                              <ArrowRight className="h-4 w-4" />
                              <span>Move right</span>
                            </motion.button>
                          )}

                          {/* Divider */}
                          <div className={`h-px ${isDark ? 'bg-slate-700' : 'bg-slate-200'}`} />

                          {/* Remove Button */}
                          <motion.button
                            whileHover={{ x: 2 }}
                            onClick={(e) => removeTab(tab.id, e)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-b-lg ${
                              isDark
                                ? 'text-red-400 hover:bg-red-900/30 hover:text-red-300'
                                : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            }`}
                          >
                            <X className="h-4 w-4" />
                            <span>Remove</span>
                          </motion.button>
                        </motion.div>,
                        document.body
                      )
                    }
                  </AnimatePresence>
                </Reorder.Item>
              );
            })}
          </AnimatePresence>
        </Reorder.Group>

        {/* Add Tab Button */}
        <div className="flex-shrink-0" ref={dropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              if (!isDropdownOpen && dropdownRef.current) {
                const rect = dropdownRef.current.getBoundingClientRect();
                setDropdownCoords({
                  top: rect.bottom + 8,
                  right: window.innerWidth - rect.right
                });
              }
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
              isDropdownOpen
                ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
            }`}
          >
            <Plus className="h-5 w-5" />
          </motion.button>

          {/* Available Tabs Dropdown - Rendered via Portal */}
          {isDropdownOpen && availableTabs.length > 0 && 
            createPortal(
              <motion.div
                ref={dropdownContentRef}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`fixed min-w-max rounded-lg shadow-2xl border z-[99999] transition-colors duration-200 pointer-events-auto isolation-auto ${
                  isDark
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-slate-200'
                }`}
                style={{
                  top: `${dropdownCoords.top}px`,
                  right: `${dropdownCoords.right}px`
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`px-4 py-2.5 border-b transition-colors duration-200 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Available Tabs
                  </p>
                </div>

                <div className="flex flex-col max-h-80 overflow-y-auto">
                  {availableTabs.map((tab, idx) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ x: 4 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addTabFromDropdown(tab);
                      }}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 text-left ${
                        idx < availableTabs.length - 1 ? `border-b ${isDark ? 'border-slate-700' : 'border-slate-100'}` : ''
                      } ${
                        isDark
                          ? 'text-slate-300 hover:bg-slate-700 hover:text-indigo-400'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600'
                      }`}
                    >
                      <tab.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{tab.label}</span>
                      <Plus className="h-3.5 w-3.5 opacity-50" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>,
              document.body
            )
          }
        </div>

        {/* Right Scroll Arrow */}
        <AnimatePresence>
          {showRightArrow && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('right')}
              className={`absolute right-0 z-20 p-1 rounded-md transition-all duration-200 flex-shrink-0 ${
                isDark ? 'bg-gradient-to-l from-slate-950 to-transparent hover:text-indigo-400' 
                  : 'bg-gradient-to-l from-white to-transparent hover:text-indigo-600'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default ProjectNavbar;