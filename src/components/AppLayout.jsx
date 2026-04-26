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
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <div className="flex min-h-screen">
          <aside className="hidden xl:flex w-72 flex-col border-r border-slate-200 dark:border-slate-800 bg-slate-900 text-slate-100">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white">
                <Home className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Workspace</p>
                <p className="text-sm font-semibold">My Software Teaj</p>
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
                      `group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/10'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="px-4 py-5 border-t border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-sm">
                <span>Dark mode</span>
                <button
                  type="button"
                  onClick={() => setDarkMode((prev) => !prev)}
                  className="rounded-full border border-slate-700 bg-slate-900 p-2 text-slate-100 hover:border-indigo-500"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </aside>

          <div className="flex-1 flex flex-col">
            <header className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/95 backdrop-blur">
              <div className="flex items-center gap-4">
                <div className="rounded-2xl bg-indigo-600 text-white p-2 shadow-lg shadow-indigo-500/10">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Project Management</p>
                  <p className="text-xs text-slate-400">Overview and project workspace</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-5 h-5 text-slate-400" />
                  <input
                    type="search"
                    placeholder="Search workspace"
                    className="ml-8 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition-colors duration-200 focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <button className="rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors duration-200">
                  Create
                </button>
                <button className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-indigo-400">
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
