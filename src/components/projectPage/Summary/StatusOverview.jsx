import React, { useMemo, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const STANDARD_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#64748B"];

const StatusOverview = ({ project, issues }) => {
    useEffect(() => {
        return () => {
            Object.values(ChartJS.instances).forEach(chart => chart.destroy());
        };
    }, []);

    const stats = useMemo(() => {
        const columns = project?.boardColumns || [];
        const configKeys = columns.map(c => c.name);
        const counts = {};
        configKeys.forEach(name => counts[name] = 0);
        let total = 0;

        if (issues) {
            issues.forEach(issue => {
                total++;
                counts[issue.status] = (counts[issue.status] !== undefined) ? counts[issue.status] + 1 : 1;
            });
        }
        return { counts, total };
    }, [project, issues]);

    const validLabels = Object.keys(stats.counts);
    const validData = validLabels.map(key => stats.counts[key]);

    const chartData = {
        labels: validLabels,
        datasets: [{
            data: validData,
            backgroundColor: validLabels.map((_, i) => STANDARD_COLORS[i % STANDARD_COLORS.length]),
            borderWidth: 2,
            borderColor: "transparent",
            cutout: "75%"
        }],
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Status Overview</h3>
            <div className="flex-1 flex items-center justify-between gap-6">
                <div className="relative w-36 h-36 shrink-0">
                    <Doughnut data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-semibold text-slate-900 dark:text-white">{stats.total}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3 max-h-[220px]">
                    {validLabels.map((status, i) => (
                        <div key={status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: STANDARD_COLORS[i % STANDARD_COLORS.length] }}></span>
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate max-w-[90px]">{status}</span>
                            </div>
                            <span className="text-sm font-medium text-slate-500">{stats.counts[status]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default StatusOverview;