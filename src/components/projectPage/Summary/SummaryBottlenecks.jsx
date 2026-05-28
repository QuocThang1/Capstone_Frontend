import React, { useState, useEffect } from "react";
import { getBottlenecksByProjectApi } from "../../../utils/Api/bottleneckApi";
import { Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

const SummaryBottlenecks = ({ project, socket, navigate }) => {
    const [activeCount, setActiveCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchBottlenecks = async () => {
        if (!project?._id) return;
        try {
            const res = await getBottlenecksByProjectApi(project._id);
            if (res && res.EC === 0) {
                const count = res.data.filter(b => b.status !== 'resolved').length;
                setActiveCount(count);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBottlenecks();
    }, [project?._id]);

    useEffect(() => {
        if (!socket) return;
        const handleNewBottleneck = () => fetchBottlenecks();
        socket.on('bottleneck_alert', handleNewBottleneck);
        return () => socket.off('bottleneck_alert', handleNewBottleneck);
    }, [socket, project?._id]);

    return (
        <div
            onClick={() => navigate(`/projects/${project._id}/bottleneck-detector`)}
            className="cursor-pointer bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 h-[320px] flex flex-col shadow-sm hover:shadow-md transition-shadow group"
        >
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                Workflow Bottlenecks
                <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[10px]">
                    View Details &rarr;
                </span>
            </h3>
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                {loading ? (
                    <Activity className="w-8 h-8 text-slate-300 animate-spin duration-1000 mb-3" />
                ) : activeCount > 0 ? (
                    <>
                        <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-3">
                            <ShieldAlert className="w-6 h-6 text-rose-500" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{activeCount} Issues Blocked</h4>
                        <p className="text-xs text-slate-500 mt-2 max-w-[200px]">Bottlenecks detected in your workflow. Action required.</p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-3">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Flow is healthy</h4>
                        <p className="text-xs text-slate-500 mt-2 max-w-[200px]">No major bottlenecks detected. Issues are moving steadily.</p>
                    </>
                )}
            </div>
        </div>
    );
};
export default SummaryBottlenecks;