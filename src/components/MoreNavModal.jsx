import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useDarkMode from '../hooks/useDarkMode';
import { Pin } from 'lucide-react';

const MoreNavDropdown = ({ isOpen, onClose, items, onPin }) => {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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
      className={`fixed top-20 right-6 sm:right-10 rounded-xl shadow-2xl w-72 max-w-[calc(100vw-32px)] z-[9999] origin-top-right transform transition-all duration-200 ease-out
        ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        ${isDark ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'}`}
    >
      <div className="p-2 grid grid-cols-1 gap-1 max-h-[400px] overflow-y-auto custom-scrollbar">
        {items.length === 0 ? (
          <p className="text-sm text-center py-4 text-slate-500">All features are on the navbar!</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`group flex items-stretch px-2 py-2 rounded-lg transition-all duration-200 text-left
                ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              {/* Click to Navigate */}
              <button
                onClick={() => handleNavigation(item.path)}
                className="flex-1 flex items-start gap-3 cursor-pointer min-w-0 pb-1"
              >
                <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${isDark ? 'bg-slate-700/50' : 'bg-slate-200/50'}`}>
                  <item.icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="text-left flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-900'} truncate`}>
                      {item.label}
                    </p>
                    {item.tag && (
                      <span className="rounded bg-indigo-100 px-1.5 py-[1px] text-[9px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 whitespace-nowrap">
                        {item.tag}
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>

              {/* Pin Button */}
              <button
                onClick={(e) => { e.stopPropagation(); onPin(item.id); }}
                title="Pin to navbar"
                className="flex items-center justify-center p-2 mt-0.5 ml-1 self-start rounded-md hover:bg-indigo-100 hover:text-indigo-700 dark:hover:bg-indigo-900/50 dark:hover:text-indigo-300 opacity-20 sm:opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500 transition-all cursor-pointer"
              >
                <Pin className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MoreNavDropdown;