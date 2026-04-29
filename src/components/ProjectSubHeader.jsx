import { NavLink } from 'react-router-dom';
import { Square, Share2, Download, MoreHorizontal, Sparkles } from 'lucide-react';
import ProjectContextMenu from './ProjectContextMenu';

const tabs = [
  { label: 'Summary', to: 'summary' },
  { label: 'Backlog', to: 'backlog' },
  { label: 'Board', to: 'board' },
  { label: 'Code', to: 'code' },
  { label: 'Archived work items', to: 'archived' },
  { label: 'Calendar', to: 'calendar' },
  { label: 'Deployments', to: 'deployments' },
  { label: 'Development', to: 'development' },
  { label: 'Forms', to: 'forms' },
];

const ProjectSubHeader = ({ projectName, projectId }) => {
  const basePath = `/projects/${projectId}`;

  return (
    <section className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/95 backdrop-blur-lg transition-colors duration-300">
      <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 flex items-center justify-center shadow-sm dark:shadow-indigo-500/10 transition-all duration-200">
            <Square className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Project</p>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{projectName}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all duration-200">
            <Download className="w-4 h-4" /> Export
          </button>
          <ProjectContextMenu />
        </div>
      </div>

      <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 py-3 transition-colors duration-300">
        <div className="flex min-w-[900px] gap-1 text-sm font-medium text-slate-600 dark:text-slate-400">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={`${basePath}/${tab.to}`}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-900/30 font-semibold shadow-sm'
                    : 'hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectSubHeader;
