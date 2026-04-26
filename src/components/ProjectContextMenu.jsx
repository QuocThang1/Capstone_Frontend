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
        className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-indigo-400"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-80 rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-950">
          <div className="p-4 space-y-3">
            {menuItems.slice(0, 2).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}

            <div className="rounded-3xl bg-slate-100 p-3 dark:bg-slate-900">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <span className="inline-flex items-center gap-3">
                  <FilePlus className="w-4 h-4" />
                  Save as template
                </span>
                <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  ENTERPRISE
                </span>
              </button>
            </div>

            {menuItems.slice(3).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-700 transition-colors duration-200 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800" />
          <div className="p-4 space-y-2">
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
            >
              <Archive className="w-4 h-4" />
              Archive space
            </button>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
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
