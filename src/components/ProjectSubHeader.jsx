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
    <section className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/95 backdrop-blur-sm">
      <div className="flex flex-col gap-3 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Square className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Project</p>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{projectName}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-indigo-400">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:text-indigo-400">
            <Download className="w-4 h-4" /> Export
          </button>
          <ProjectContextMenu />
        </div>
      </div>

      <div className="overflow-x-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-3">
        <div className="flex min-w-[900px] gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={`${basePath}/${tab.to}`}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition-all duration-200 ${
                  isActive
                    ? 'text-indigo-700 dark:text-indigo-300 border-b-2 border-indigo-600 dark:border-indigo-400 font-semibold'
                    : 'hover:text-indigo-600 dark:hover:text-indigo-300'
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
