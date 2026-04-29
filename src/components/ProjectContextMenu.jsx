import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Star, UserPlus, FilePlus, Settings, Image, Archive, Trash2, ChevronRight } from 'lucide-react';

const menuItems = [
  { label: 'Add to starred', icon: Star },
  { label: 'Add people', icon: UserPlus },
  { label: 'Save as template', icon: FilePlus, tag: 'ENTERPRISE' },
  { label: 'Set space background', icon: Image },
  { label: 'Space settings', icon: Settings },
];

const ProjectContextMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-2xl glass-card shadow-2xl shadow-slate-900/20 dark:shadow-slate-900/40">
          <div className="p-4 space-y-3">
            {menuItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                >
                  <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  {item.label}
                </button>
              );
            })}

            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900/20 p-3 transition-all duration-200">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
              >
                <span className="inline-flex items-center gap-3">
                  <FilePlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  Save as template
                </span>
                <span className="rounded-full bg-indigo-600 dark:bg-indigo-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white">
                  Enterprise
                </span>
              </button>
            </div>

            {menuItems.slice(3).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-slate-700 dark:text-slate-300 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                >
                  <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />
          <div className="p-4 space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-rose-600 dark:text-rose-400 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            >
              <Archive className="w-4 h-4" />
              Archive space
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm text-rose-600 dark:text-rose-400 transition-all duration-200 hover:bg-rose-50 dark:hover:bg-rose-900/20"
            >
              <Trash2 className="w-4 h-4" />
              Delete space
            </button>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />
          <div className="p-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center justify-between gap-3">
              <span>Software space</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <p className="mt-2 text-xs leading-5">Team-managed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectContextMenu;
