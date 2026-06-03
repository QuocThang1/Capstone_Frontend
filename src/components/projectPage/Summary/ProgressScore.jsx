import React, { useMemo, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ProgressScore = ({ issues }) => {
    useEffect(() => {
        return () => {
            Object.values(ChartJS.instances).forEach(chart => chart.destroy());
        };
    }, []);

    const { doneCount, totalCount, percentage } = useMemo(() => {
        if (!issues || issues.length === 0) return { doneCount: 0, totalCount: 0, percentage: 0 };
        const total = issues.length;
        const done = issues.filter(i => i.status === 'Done' || i.status?.toLowerCase() === 'done').length;
        return { doneCount: done, totalCount: total, percentage: Math.round((done / total) * 100) };
    }, [issues]);

    const data = {
        labels: ["Completed", "Remaining"],
        datasets: [{
            data: [percentage, 100 - Math.max(percentage, 0)],
            backgroundColor: ["#0F172A", "#F1F5F9"], // Đen Slate & Xám nhạt chuyên nghiệp
            borderWidth: 0,
            cutout: "82%",
        }],
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Project Progress</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative mt-2">
                <div className="w-40 h-40 relative">
                    <Doughnut data={data} options={{ maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-semibold text-slate-900 dark:text-white">{percentage}%</span>
                        <span className="text-xs text-slate-500 mt-1">{doneCount} / {totalCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ProgressScore;