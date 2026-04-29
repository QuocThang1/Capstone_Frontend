import { motion } from "framer-motion";
import { Users, TrendingUp, Clock, CheckCircle2, AlertCircle, Star } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const TEAM = [
  { id: 1, name: "Sarah Chen", role: "Lead Engineer", initials: "SC", color: "bg-indigo-500", tasks: 12, completed: 9, velocity: 94, status: "on-track", project: "Dev Sprint Q2" },
  { id: 2, name: "Marcus Rivera", role: "Product Designer", initials: "MR", color: "bg-emerald-500", tasks: 8, completed: 8, velocity: 100, status: "ahead", project: "Product Launch" },
  { id: 3, name: "Aisha Patel", role: "QA Engineer", initials: "AP", color: "bg-violet-500", tasks: 15, completed: 10, velocity: 72, status: "at-risk", project: "Product Launch" },
  { id: 4, name: "Jake Thompson", role: "Backend Dev", initials: "JT", color: "bg-amber-500", tasks: 11, completed: 6, velocity: 58, status: "blocked", project: "Dev Sprint Q2" },
  { id: 5, name: "Lena Müller", role: "Marketing Lead", initials: "LM", color: "bg-rose-500", tasks: 7, completed: 7, velocity: 100, status: "ahead", project: "Marketing Campaign" },
  { id: 6, name: "David Okafor", role: "Data Analyst", initials: "DO", color: "bg-cyan-500", tasks: 9, completed: 5, velocity: 66, status: "on-track", project: "Marketing Campaign" },
];

const statusConfig = {
  "ahead": { label: "Ahead", class: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" },
  "on-track": { label: "On Track", class: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400" },
  "at-risk": { label: "At Risk", class: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" },
  "blocked": { label: "Blocked", class: "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" },
};

const velocityColor = (v) => {
  if (v >= 90) return "bg-emerald-500";
  if (v >= 70) return "bg-indigo-500";
  if (v >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

const TeamHealth  = () =>{
  const avgVelocity = Math.round(TEAM.reduce((a, m) => a + m.velocity, 0) / TEAM.length);
  const completedToday = TEAM.reduce((a, m) => a + m.completed, 0);
  const totalTasks = TEAM.reduce((a, m) => a + m.tasks, 0);
  const blocked = TEAM.filter((m) => m.status === "blocked").length;

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Team Health</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Real-time workload, velocity, and wellbeing metrics for your team.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: "Avg Velocity", value: `${avgVelocity}%`, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
          { icon: CheckCircle2, label: "Tasks Done", value: `${completedToday}/${totalTasks}`, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          { icon: AlertCircle, label: "Blocked", value: blocked, color: "text-rose-600", bg: "bg-rose-50 dark:bg-rose-900/20" },
          { icon: Users, label: "Active Members", value: TEAM.length, color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-50 dark:bg-slate-800" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
              <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Team table */}
      <div className="glass-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Team Members
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">{TEAM.length} people</span>
        </div>
        <motion.div variants={container} initial="hidden" animate="show">
          {TEAM.map((member, i) => (
            <motion.div
              key={member.id}
              variants={item}
              className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${i !== TEAM.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-full ${member.color} text-white text-sm font-bold flex items-center justify-center shrink-0`}>
                {member.initials}
              </div>

              {/* Name + role */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{member.name}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{member.role} · {member.project}</p>
              </div>

              {/* Tasks */}
              <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 w-20 shrink-0">
                <Clock className="w-3.5 h-3.5" />
                {member.completed}/{member.tasks} tasks
              </div>

              {/* Velocity bar */}
              <div className="hidden sm:block w-28 shrink-0">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 dark:text-slate-500">Velocity</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{member.velocity}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${velocityColor(member.velocity)} transition-all`}
                    style={{ width: `${member.velocity}%` }}
                  />
                </div>
              </div>

              {/* Status badge */}
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${statusConfig[member.status].class} shrink-0`}>
                {statusConfig[member.status].label}
              </span>

              {/* Star */}
              {member.velocity === 100 && (
                <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Workload distribution */}
      <div className="glass-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <h2 className="font-semibold text-slate-800 dark:text-slate-200 mb-5">Workload Distribution</h2>
        <div className="space-y-3">
          {TEAM.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full ${member.color} text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
                {member.initials}
              </div>
              <span className="text-sm text-slate-600 dark:text-slate-400 w-28 truncate">{member.name.split(" ")[0]}</span>
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${member.color} opacity-80`}
                  style={{ width: `${(member.tasks / 15) * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-14 text-right">{member.tasks} tasks</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TeamHealth;