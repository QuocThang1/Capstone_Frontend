import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import useDarkMode from '../hooks/useDarkMode';
import PROJECT_TABS from '../config/projectTabs';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  MoreHorizontal,
  MoreVertical,
  Share2,
  X,
  Edit2,
  Star,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const ProjectNavbar = ({ projectName, projectId }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();
  const scrollContainerRef = useRef(null);

  const basePath = `/projects/${projectId}`;
  const allTabs = PROJECT_TABS.map(tab => ({ ...tab, path: `${basePath}${tab.path}` }));
  const STORAGE_KEY = `project-navbar-settings-${projectId}`;

  // State Management - khởi tạo với 3 tab mặc định (overview, board, backlog)
  const [activeTabs, setActiveTabs] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const savedTabIds = parsed.activeTabIds || [];

        const restoredTabs = savedTabIds
          .map(id => allTabs.find(tab => tab.id === id))
          .filter(Boolean);

        if (restoredTabs.length > 0) {
          return restoredTabs;
        }
      } catch (error) {
        console.error("Failed to load navbar settings:", error);
      }
    }

    return allTabs.slice(0, 3);
  });

  const [defaultTabId, setDefaultTabId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.defaultTabId || 'board';
    }

    return 'board';
  });
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  
  // Dropdown state - chỉ mở một dropdown tại một thời điểm
  const [openAddDropdown, setOpenAddDropdown] = useState(false);
  const [activeTabMenuId, setActiveTabMenuId] = useState(null);
  
  // Position state for dropdowns
  const [addDropdownPos, setAddDropdownPos] = useState({ top: 0, right: 0 });
  const [tabMenuPos, setTabMenuPos] = useState({ top: 0, left: 0 });
  
  // Refs for click-outside detection
  const addDropdownRef = useRef(null);
  const addDropdownContentRef = useRef(null);
  const tabMenuContentRef = useRef(null);
  
  const [hoveredTabId, setHoveredTabId] = useState(null);
  const [editingTabId, setEditingTabId] = useState(null);
  const [editingLabel, setEditingLabel] = useState('');


  const availableTabs = React.useMemo(() => {
    return allTabs.filter(
      tab => !activeTabs.some(active => active.id === tab.id)
    );
  }, [allTabs, activeTabs]);

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

  // Click outside handler to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedAddButton =
        addDropdownRef.current && addDropdownRef.current.contains(e.target);

      const clickedAddDropdown =
        addDropdownContentRef.current && addDropdownContentRef.current.contains(e.target);

      const clickedTabMenu =
        tabMenuContentRef.current && tabMenuContentRef.current.contains(e.target);

      const clickedTabTrigger = e.target.closest?.("[data-tab-menu-trigger]");

      if (!clickedAddButton && !clickedAddDropdown) {
        setOpenAddDropdown(false);
      }

      if (!clickedTabTrigger && !clickedTabMenu) {
        setActiveTabMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdowns on scroll and resize
  useEffect(() => {
    const handleScrollOrResize = (e) => {
      const isScrollingAddDropdown =
        addDropdownContentRef.current &&
        addDropdownContentRef.current.contains(e.target);

      const isScrollingTabMenu =
        tabMenuContentRef.current &&
        tabMenuContentRef.current.contains(e.target);

      if (isScrollingAddDropdown || isScrollingTabMenu) {
        return;
      }

      setOpenAddDropdown(false);
      setActiveTabMenuId(null);
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, []);

  useEffect(() => {
    const data = {
      activeTabIds: activeTabs.map(tab => tab.id),
      defaultTabId
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [STORAGE_KEY, activeTabs, defaultTabId]);

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
    setActiveTabs(prevTabs => {
      if (prevTabs.some(t => t.id === tab.id)) return prevTabs;
      return [...prevTabs, tab];
    });

    setOpenAddDropdown(false);
  }, []);

  const removeTab = useCallback((tabId, e) => {
    e?.stopPropagation();

    setActiveTabs(prevTabs => {
      const nextTabs = prevTabs.filter(t => t.id !== tabId);

      // Nếu muốn cho phép xoá hết tab thì bỏ if này
      if (nextTabs.length === 0) return prevTabs;

      return nextTabs;
    });

    if (defaultTabId === tabId) {
      setDefaultTabId(null);
    }

    setActiveTabMenuId(null);
    setHoveredTabId(null);
  }, [defaultTabId]);

  const moveTab = useCallback((tabId, direction, e) => {
    e?.stopPropagation();

    setActiveTabs(prevTabs => {
      const index = prevTabs.findIndex(t => t.id === tabId);
      if (index === -1) return prevTabs;

      const swapIndex = direction === "left" ? index - 1 : index + 1;

      if (swapIndex < 0 || swapIndex >= prevTabs.length) {
        return prevTabs;
      }

      const newTabs = [...prevTabs];

      [newTabs[index], newTabs[swapIndex]] = [
        newTabs[swapIndex],
        newTabs[index]
      ];

      return newTabs;
    });

    setActiveTabMenuId(null);
  }, []);

  const setAsDefault = useCallback((tabId, e) => {
    e?.stopPropagation();

    setDefaultTabId(tabId);
    setActiveTabMenuId(null);
  }, []);

  const startRenaming = useCallback((tab, e) => {
    e?.stopPropagation();

    setEditingTabId(tab.id);
    setEditingLabel(tab.label);
    setActiveTabMenuId(null);
  }, []);

  const saveRename = useCallback((tabId) => {
    const newLabel = editingLabel.trim();

    if (!newLabel) {
      setEditingTabId(null);
      return;
    }

    setActiveTabs(prevTabs =>
      prevTabs.map(t =>
        t.id === tabId ? { ...t, label: newLabel } : t
      )
    );

    setEditingTabId(null);
    setEditingLabel("");
  }, [editingLabel]);

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  // Open tab action menu with proper positioning
  const openTabMenu = useCallback((e, tabId) => {
    e.stopPropagation();
    if (activeTabMenuId === tabId) {
      setActiveTabMenuId(null);
    } else {
      // Đóng dropdown Add trước
      setOpenAddDropdown(false);
      
      // Tìm button parent từ event target
      let button = e.target;
      while (button && button.tagName !== 'BUTTON') {
        button = button.parentElement;
      }
      
      if (button) {
        const rect = button.getBoundingClientRect();
        setTabMenuPos({
          top: rect.bottom + 8,
          left: rect.left
        });
      }
      setActiveTabMenuId(tabId);
    }
  }, [activeTabMenuId]);

  // Open add tabs dropdown with proper positioning
  const openAddDropdownHandler = useCallback((e) => {
    e?.stopPropagation();
    if (openAddDropdown) {
      setOpenAddDropdown(false);
    } else {
      // Đóng tab menu trước
      setActiveTabMenuId(null);
      
      if (addDropdownRef.current) {
        const rect = addDropdownRef.current.getBoundingClientRect();
        setAddDropdownPos({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right
        });
      }
      setOpenAddDropdown(true);
    }
  }, [openAddDropdown]);

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-colors duration-200 overflow-visible ${
      isDark ? 'border-slate-700 bg-slate-900 text-slate-100' 
        : 'border-slate-200 bg-white text-slate-600'
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
            isDark ? 'hover:bg-slate-800 text-slate-300 hover:text-indigo-300' 
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
                isDark ? 'hover:text-indigo-300' 
                  : 'hover:text-indigo-600'
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
                      if (activeTabMenuId !== tab.id) {
                        setHoveredTabId(null);
                      }
                    }}
                    className={`relative inline-block flex-shrink-0 transition-all duration-200`}
                  >
                  <motion.button
                    onClick={() => !isEditing && navigate(tab.path)}
                    layout
                    className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg whitespace-nowrap group cursor-grab active:cursor-grabbing
                      ${active
                        ? 'text-indigo-600 dark:text-indigo-200 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }
                    `}
                  >
                    {/* Tab Icon - Replace with 3-dots on Hover */}
                    <div
                      onClick={(e) => {
                        if (isHovered && !isEditing) {
                          openTabMenu(e, tab.id);
                        }
                      }}
                      className="cursor-pointer"
                      data-tab-menu-trigger
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
                              isDark ? 'text-slate-300 hover:text-indigo-300'
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
                              active ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-500 dark:text-slate-400'
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
                          isDark ? 'text-indigo-200' : 'text-indigo-600'
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
                  {activeTabMenuId === tab.id &&
                    createPortal(
                      <motion.div
                        ref={tabMenuContentRef}
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className={`fixed min-w-[200px] rounded-lg border z-[9999] transition-all duration-200 pointer-events-auto shadow-2xl ${
                          isDark
                            ? 'bg-slate-800/95 border-slate-600'
                            : 'bg-white border-slate-200'
                        }`}
                        style={{
                          top: `${tabMenuPos.top}px`,
                          left: `${tabMenuPos.left}px`
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                          {/* Set as Default Button */}
                          <button
                            whileHover={{ x: 2 }}
                            onClick={(e) => {
                              e.stopPropagation();

                              if (defaultTabId === tab.id) {
                                setDefaultTabId(null);
                              } else {
                                setDefaultTabId(tab.id);
                              }

                              setActiveTabMenuId(null);
                            }}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                              defaultTabId === tab.id
                                ? isDark
                                  ? 'text-red-300 hover:bg-red-900/40 hover:text-red-200 border-slate-700'
                                  : 'text-red-600 hover:bg-red-50 hover:text-red-700 border-slate-200'
                                : isDark
                                  ? 'text-slate-200 hover:bg-slate-700 hover:text-indigo-300 border-slate-700'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                            }`}
                          >
                            {defaultTabId === tab.id ? (
                              <>
                                <X className="h-4 w-4" />
                                <span>Remove default</span>
                              </>
                            ) : (
                              <>
                                <Star className="h-4 w-4" />
                                <span>Set as default</span>
                              </>
                            )}
                          </button>

                          {/* Rename Button */}
                          <button
                            whileHover={{ x: 2 }}
                            onClick={(e) => startRenaming(tab, e)}
                            className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                              isDark
                                ? 'text-slate-200 hover:bg-slate-700 hover:text-indigo-300 border-slate-700'
                                : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                            }`}
                          >
                            <Edit2 className="h-4 w-4" />
                            <span>Rename</span>
                          </button>

                          {/* Move Left Button */}
                          {activeTabs.findIndex(t => t.id === tab.id) > 0 && (
                            <button
                              whileHover={{ x: 2 }}
                              onClick={(e) => moveTab(tab.id, 'left', e)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                                isDark
                                  ? 'text-slate-200 hover:bg-slate-700 hover:text-indigo-300 border-slate-700'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                              }`}
                            >
                              <ArrowLeft className="h-4 w-4" />
                              <span>Move left</span>
                            </button>
                          )}

                          {/* Move Right Button */}
                          {activeTabs.findIndex(t => t.id === tab.id) < activeTabs.length - 1 && (
                            <button
                              whileHover={{ x: 2 }}
                              onClick={(e) => moveTab(tab.id, 'right', e)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 border-b ${
                                isDark
                                  ? 'text-slate-200 hover:bg-slate-700 hover:text-indigo-300 border-slate-700'
                                  : 'text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border-slate-200'
                              }`}
                            >
                              <ArrowRight className="h-4 w-4" />
                              <span>Move right</span>
                            </button>
                          )}

                          {/* Remove Button */}
                          {defaultTabId !== tab.id && (
                            <button
                              whileHover={{ x: 2 }}
                              onClick={(e) => removeTab(tab.id, e)}
                              className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-b-lg ${
                                isDark
                                  ? 'text-red-300 hover:bg-red-900/40 hover:text-red-200'
                                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                              }`}
                            >
                              <X className="h-4 w-4" />
                              <span>Remove</span>
                            </button>
                          )}
                      </motion.div>,
                      document.body
                    )
                  }
                </Reorder.Item>
              );
            })}
          </AnimatePresence>
        </Reorder.Group>

        {/* Add Tab Button */}
        <div className="flex-shrink-0" ref={addDropdownRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddDropdownHandler}
            className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
              openAddDropdown
                ? 'text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30'
                : 'text-slate-400 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
            }`}
          >
            <Plus className="h-5 w-5" />
          </motion.button>

          {/* Available Tabs Dropdown - Rendered via Portal */}
          {openAddDropdown && availableTabs.length > 0 && 
            createPortal(
              <motion.div
                ref={addDropdownContentRef}
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`fixed min-w-max rounded-lg shadow-2xl border z-[9999] transition-colors duration-200 pointer-events-auto isolation-auto ${
                  isDark
                    ? 'bg-slate-800/95 border-slate-600'
                    : 'bg-white border-slate-200'
                }`}
                style={{
                  top: `${addDropdownPos.top}px`,
                  right: `${addDropdownPos.right}px`
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                onWheel={(e) => e.stopPropagation()}
              >
                <div className={`px-4 py-2.5 border-b transition-colors duration-200 ${
                  isDark ? 'border-slate-700' : 'border-slate-200'
                }`}>
                  <p className={`text-xs font-bold uppercase tracking-wider ${
                    isDark ? 'text-slate-300' : 'text-slate-500'
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
                          ? 'text-slate-200 hover:bg-slate-700 hover:text-indigo-300'
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
                isDark ? 'hover:text-indigo-300' 
                  : 'hover:text-indigo-600'
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