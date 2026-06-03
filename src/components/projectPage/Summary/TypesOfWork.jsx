// File: src/components/projectPage/Summary/TypesOfWork.jsx
import React, { useMemo } from "react";

const getTypeColor = (type) => {
    switch (type) {
        case 'Epic': return 'bg-purple-500';
        case 'Bug': return 'bg-red-500';
        case 'Task': return 'bg-blue-500';
        case 'Subtask': return 'bg-slate-400';
        default: return 'bg-indigo-500';
    }
};

const TypesOfWork = ({ project, issues }) => {
    const workData = useMemo(() => {
        if (!issues) return [];
        let counts = { Subtask: 0 };

        if (project?.issueTypes?.length > 0) {
            project.issueTypes.forEach(t => counts[t.name] = 0);
        }

        issues.forEach(issue => {
            const isSubtask = !!issue.parentId;
            const typeName = isSubtask ? 'Subtask' : (issue.type || 'Task');
            counts[typeName] = (counts[typeName] || 0) + 1;
        });

        const total = issues.length;

        // Chỉ render các loại task đang có > 0 hoặc nằm rỗng trong list cấu hình Project
        return Object.keys(counts)
            .filter(key => counts[key] >= 0 || (project?.issueTypes && project.issueTypes.some(t => t.name === key)))
            .map(key => ({
                type: key,
                count: counts[key],
                percentage: total > 0 ? ((counts[key] / total) * 100) : 0,
                colorClass: getTypeColor(key)
            })).sort((a, b) => b.percentage - a.percentage);
    }, [issues, project]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-5">Work Distribution</h3>
            <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pr-2">
                {workData.length === 0 && <div className="text-sm text-center text-slate-400 py-10">No issues found</div>}
                {workData.map((item) => (
                    <div key={item.type} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-slate-700 dark:text-slate-200">{item.type}</span>
                            <span className="text-slate-500">{item.count} <span className="text-xs opacity-70">({item.percentage.toFixed(0)}%)</span></span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className={`h-full ${item.colorClass}`} style={{ width: `${item.percentage}%` }}></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default TypesOfWork;