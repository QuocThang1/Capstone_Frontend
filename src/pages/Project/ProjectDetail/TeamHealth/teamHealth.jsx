import { useState, useMemo, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, TrendingUp, CheckCircle2 } from "lucide-react";
import Spinner from "../../../../components/spinner";
import MemberIssuesModal from "./MemberIssuesModal";
import { getBottlenecksByProjectApi } from "../../../../utils/Api/bottleneckApi";
import { getIssuesByProjectApi } from "../../../../utils/Api/issueApi";
import { AlertTriangle } from "lucide-react";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const velocityColor = (v) => {
  if (v >= 90) return "bg-emerald-500";
  if (v >= 70) return "bg-indigo-500";
  if (v >= 50) return "bg-amber-500";
  return "bg-rose-500";
};

const generateAvatarColor = (id) => {
  const colors = ["bg-indigo-500", "bg-emerald-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-pink-500"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash % colors.length);
  return colors[index];
};

const TeamHealth = () => {
  const { project } = useOutletContext();
  const [issues, setIssues] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [bottlenecks, setBottlenecks] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (project?._id) {
      setLoadingStats(true);
      Promise.all([
        getBottlenecksByProjectApi(project._id),
        getIssuesByProjectApi(project._id)
      ])
        .then(([botRes, issRes]) => {
          if (botRes?.EC === 0) setBottlenecks(botRes.data || []);
          if (issRes?.EC === 0) setIssues(issRes.data || []);
        })
        .finally(() => setLoadingStats(false));
    }
  }, [project]);

  const selectedMemberIssues = useMemo(() => {
    if (!selectedMember || !issues) return [];
    return issues.filter(issue => issue.assigneeId?._id === selectedMember.id && !issue.parentId);
  }, [selectedMember, issues]);

  if (!project || loadingStats) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]"><Spinner /></div>;
  }

  const teamData = project.members.map(member => {
    const assignedIssues = issues.filter(issue => issue.assigneeId?._id === member.accountId._id && !issue.parentId);
    const completedTasks = assignedIssues.filter(issue => issue.status === 'Done').length;
    const totalTasks = assignedIssues.length;
    const velocity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const memberBottlenecks = bottlenecks.filter(
      b => b.issueId?.assigneeId?._id === member.accountId._id && b.status !== 'resolved'
    ).length;

    return {
      id: member.accountId._id,
      name: member.accountId.fullName,
      role: member.role.charAt(0).toUpperCase() + member.role.slice(1),
      initials: member.accountId.fullName.split(' ').map(n => n[0]).join('').toUpperCase(),
      color: generateAvatarColor(member.accountId._id),
      tasks: totalTasks,
      completed: completedTasks,
      velocity: velocity,
      bottlenecksCount: memberBottlenecks
    };
  });

  const parentIssues = issues.filter(issue => !issue.parentId);
  const totalProjectIssues = parentIssues.length;
  const completedProjectIssues = parentIssues.filter(issue => issue.status === 'Done').length;
  const avgVelocity = teamData.length > 0
    ? Math.round(teamData.reduce((acc, member) => acc + member.velocity, 0) / teamData.length)
    : 0;

  const totalUnresolvedBottlenecks = bottlenecks.filter(b => b.status !== 'resolved').length;

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 pb-10 relative"
      >
        <motion.div variants={item}>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Team Health</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Real-time workload, velocity, and wellbeing metrics for your team.</p>
        </motion.div>

        {/* KPI row */}
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: "Avg Velocity", value: `${avgVelocity}%`, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
            { icon: CheckCircle2, label: "Project Progress", value: `${completedProjectIssues}/${totalProjectIssues}`, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
            { icon: Users, label: "Active Members", value: teamData.length, color: "text-slate-700 dark:text-slate-300", bg: "bg-slate-50 dark:bg-slate-800" },
            { icon: AlertTriangle, label: "Unresolved Bottlenecks", value: totalUnresolvedBottlenecks, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-900/20" },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-white dark:bg-slate-950/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 border border-slate-100 dark:border-slate-800">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{kpi.label}</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Team table */}
        <motion.div variants={item} className="bg-white dark:bg-slate-950/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-100 dark:border-slate-800">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> Team Members
            </h2>
            <span className="text-xs text-slate-400 dark:text-slate-500">{teamData.length} people</span>
          </div>
          <div>
            {teamData.map((member, i) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${i !== teamData.length - 1 ? "border-b border-slate-100 dark:border-slate-800" : ""}`}
              >
                {/* Avatar */}
                <div className={`w-9 h-9 rounded-full ${member.color} text-white text-sm font-bold flex items-center justify-center shrink-0 shadow-sm`}>
                  {member.initials}
                </div>

                {/* Name + role */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{member.name}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{member.role}</p>
                </div>

                {/* Tasks */}
                <div className="hidden md:flex flex-col gap-1 w-28 shrink-0 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{member.completed}/{member.tasks}</span>
                  </div>
                  {member.bottlenecksCount > 0 && (
                    <div className="flex items-center gap-2 text-rose-500 font-medium">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{member.bottlenecksCount} delayed</span>
                    </div>
                  )}
                </div>

                {/* Velocity bar */}
                <div className="w-40 shrink-0">
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
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <MemberIssuesModal
        selectedMember={selectedMember}
        selectedMemberIssues={selectedMemberIssues}
        onClose={() => setSelectedMember(null)}
        projectTimezone={project?.timezone}
      />
    </>
  );
}

export default TeamHealth;