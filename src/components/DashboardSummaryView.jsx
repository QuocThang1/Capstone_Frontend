import {
  Circle,
  Layers,
  TrendingUp,
  ClipboardList,
  Users,
} from 'lucide-react';

const stats = [
  { label: 'Completed', value: '0', subtitle: 'last 7 days' },
  { label: 'Updated', value: '0', subtitle: 'last 7 days' },
  { label: 'Created', value: '0', subtitle: 'last 7 days' },
  { label: 'Due soon', value: '1', subtitle: 'next 7 days' },
];

const priorityBars = [
  { label: 'Highest', percent: 10, color: 'bg-red-500' },
  { label: 'High', percent: 20, color: 'bg-orange-400' },
  { label: 'Medium', percent: 35, color: 'bg-indigo-500' },
  { label: 'Low', percent: 25, color: 'bg-slate-400' },
  { label: 'Lowest', percent: 10, color: 'bg-slate-500' },
];

const workTypes = [
  { label: 'Task', percent: 50, color: 'bg-indigo-600' },
  { label: 'Story', percent: 25, color: 'bg-emerald-500' },
  { label: 'Subtask', percent: 15, color: 'bg-cyan-500' },
  { label: 'Epic', percent: 10, color: 'bg-violet-500' },
];

const teamMembers = [
  { name: 'Unassigned', workload: 100 },
];

const DashboardSummaryView = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="glass-card rounded-2xl p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-default">
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-50">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="glass-card rounded-2xl p-6 transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Status overview</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Snapshot of the work item health.</p>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <Circle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> In progress
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 py-8">
            <div className="relative h-48 w-48 rounded-full bg-slate-100 dark:bg-slate-800/50">
              <div className="absolute inset-0 rounded-full border-8 border-slate-200 dark:border-slate-700" />
              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total work items: 4</p>
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Priority breakdown</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">How work is prioritized in the space.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-4">
            {priorityBars.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-medium">{item.label}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-50">{item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
                  <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="glass-card rounded-2xl p-6 transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Types of work</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Breakdown by work item type.</p>
            </div>
            <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-4">
            {workTypes.map((type) => (
              <div key={type.label} className="rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-50">{type.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{type.percent}% of work</p>
                  </div>
                  <span className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 px-2 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    {type.percent}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
                  <div className={`${type.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${type.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass-card rounded-2xl p-6 transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Team workload</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Capacity and work assignments.</p>
            </div>
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-2xl border border-slate-200 dark:border-slate-700/50 p-4 transition-all duration-200">
                <div className="flex items-center justify-between gap-3 text-sm mb-3 text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{member.name}</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-50">{member.workload}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-700/50 overflow-hidden">
                  <div className="h-2 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 transition-all duration-300" style={{ width: `${member.workload}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-card rounded-2xl p-6 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">Activity</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Recent work activity in this space.</p>
          </div>
          <ClipboardList className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/30 p-10 text-center text-slate-500 dark:text-slate-400 transition-all duration-200">
          <p className="mb-2 text-sm font-semibold">No activity yet</p>
          <p className="text-xs">Get your team started by creating work items and tracking progress.</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardSummaryView;
