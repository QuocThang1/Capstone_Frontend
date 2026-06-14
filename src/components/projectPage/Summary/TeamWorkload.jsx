import React, { useMemo } from "react";

const TeamWorkload = ({ project, issues }) => {
    const teamData = useMemo(() => {
        if (!project?.members || !issues) return [];
        const totalItems = issues.length;

        let membersData = project.members.map(member => {
            const memberId = member.accountId._id;
            const taskCount = issues.filter(i => i.assigneeId?._id === memberId).length;
            return {
                id: memberId, name: member.accountId.fullName,
                initials: member.accountId.fullName.substring(0, 2).toUpperCase(),
                taskCount,
                percentage: totalItems > 0 ? (taskCount / totalItems) * 100 : 0,
            };
        });

        const unassignedTasks = issues.filter(i => !i.assigneeId).length;
        membersData.unshift({
            id: 'unassigned', name: 'Unassigned', initials: '--',
            taskCount: unassignedTasks,
            percentage: totalItems > 0 ? (unassignedTasks / totalItems) * 100 : 0
        });

        return membersData.sort((a, b) => b.percentage - a.percentage);
    }, [project, issues]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Team Workload</h3>
            <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                {teamData.map(member => (
                    <div key={member.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-medium text-slate-600 dark:text-slate-300 shrink-0">
                            {member.initials}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{member.name}</span>
                                <span className="text-xs text-slate-500">{member.taskCount} tasks</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${member.percentage}%` }}></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default TeamWorkload;