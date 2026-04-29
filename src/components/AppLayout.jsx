import { useState } from 'react';
import { Outlet, NavLink, useMatch } from 'react-router-dom';
import {
  Home,
  Sparkles,
  Layers,
  Clock3,
  Target,
  Users,
  Folder,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import ProjectSubHeader from './ProjectSubHeader';

const sidebarItems = [
  { label: 'For You', icon: Sparkles, to: '/projects' },
  { label: 'Spaces', icon: Layers, to: '/spaces' },
  { label: 'Recent', icon: Clock3, to: '/recent' },
  { label: 'Recommended', icon: Target, to: '/recommended' },
  { label: 'Goals', icon: Target, to: '/goals' },
  { label: 'Teams', icon: Users, to: '/teams' },
  { label: 'Projects', icon: Folder, to: '/projects' },
];

const AppLayout = () => {
  const [darkMode, setDarkMode] = useState(false);
  const projectMatch = useMatch('/projects/:projectId/*');
  const projectName = projectMatch ? 'My Software Project' : '';

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div className="flex min-h-screen">
          <aside className="hidden xl:flex w-72 flex-col border-r border-slate-800 dark:border-slate-700 bg-slate-900 dark:bg-slate-900/95 text-slate-100 transition-all duration-300">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50 dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-600 dark:bg-indigo-500/30 text-indigo-100 dark:text-indigo-300">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">Workspace</p>
                <p className="text-sm font-semibold text-slate-100 dark:text-slate-50">My Software Team</p>
              </div>
            </div>
            <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 shadow-lg shadow-indigo-500/20 dark:shadow-indigo-500/10'
                          : 'text-slate-300 dark:text-slate-400 hover:bg-slate-800 dark:hover:bg-slate-800/50 hover:text-white dark:hover:text-slate-200 transition-colors'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="px-4 py-5 border-t border-slate-700/50 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500 text-sm">
                <span>Dark mode</span>
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  className="rounded-full border border-slate-700 dark:border-slate-700/50 bg-slate-900 dark:bg-slate-800/50 p-2 text-slate-100 dark:text-slate-300 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-200"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col">
            <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-all">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Project Management</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Overview and project workspace</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    placeholder="Search workspace"
                    className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 text-sm outline-none transition-all duration-200 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10"
                  />
                </div>
                <button className="px-4 py-2 rounded-xl bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 hover:bg-indigo-700 dark:hover:bg-indigo-500/50">
                  Create
                </button>
                <button className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-3 py-2 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-300">
                  <Bell className="w-4 h-4" />
                </button>
              </div>
            </header>

            {projectMatch && <ProjectSubHeader projectName={projectName} projectId={projectMatch.params.projectId} />}

            <main className="flex-1 overflow-auto p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
