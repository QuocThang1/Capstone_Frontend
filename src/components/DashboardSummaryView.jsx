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
          <div key={item.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
            <p className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100">{item.value}</p>
            <p className="mt-2 text-sm text-slate-400 dark:text-slate-500">{item.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Status overview</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Snapshot of the work item health.</p>
            </div>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Circle className="w-4 h-4 text-indigo-600" /> In progress
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-4 py-6">
            <div className="relative h-48 w-48 rounded-full bg-slate-100 dark:bg-slate-800">
              <div className="absolute inset-0 rounded-full border-8 border-slate-200 dark:border-slate-900" />
              <div className="absolute inset-10 rounded-full bg-indigo-600" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total work items: 4</p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Priority breakdown</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">How work is prioritized in the space.</p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-3">
            {priorityBars.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>{item.label}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Types of work</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Breakdown by work item type.</p>
            </div>
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {workTypes.map((type) => (
              <div key={type.label} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{type.label}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{type.percent}% of work</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {type.percent}%
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className={`${type.color} h-2 rounded-full`} style={{ width: `${type.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Team workload</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Capacity and work assignments.</p>
            </div>
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div key={member.name} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <span>{member.name}</span>
                  <span>{member.workload}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-indigo-600" style={{ width: `${member.workload}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Activity</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Recent work activity in this space.</p>
          </div>
          <ClipboardList className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex min-h-[180px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
          <p className="mb-2 text-sm font-semibold">No activity yet</p>
          <p className="text-sm">Get your team started by creating work items and tracking progress.</p>
        </div>
      </section>
    </div>
  );
};

export default DashboardSummaryView;
