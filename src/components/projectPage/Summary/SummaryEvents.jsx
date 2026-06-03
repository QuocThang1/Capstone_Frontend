import React, { useState, useEffect } from "react";
import { getHistoryByProjectApi } from "../../../utils/Api/historyApi";
import { isToday, format } from "date-fns";

const SummaryEvents = ({ project, socket, navigate }) => {
    const [events, setEvents] = useState([]);

    const fetchHistory = async () => {
        if (!project?._id) return;
        try {
            // Fetch thẳng về 5 dòng list history mới nhất
            const res = await getHistoryByProjectApi(project._id, { limit: 5 });
            if (res && res.EC === 0 && res.data) {
                setEvents(res.data.slice(0, 5));
            }
        } catch (error) {
            console.error("Failed to load events", error);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [project?._id]);

    useEffect(() => {
        if (!socket || !project?._id) return;
        socket.emit('join_project_history', project._id);

        const handleNewHistory = (newHistoryData) => {
            setEvents(prev => {
                const updated = [newHistoryData, ...prev];
                return updated.slice(0, 5); // Khóa số lượng ở 5 items
            });
        };

        socket.on('history_created', handleNewHistory);
        return () => {
            socket.emit('leave_project_history', project._id);
            socket.off('history_created', handleNewHistory);
        };
    }, [socket, project?._id]);

    return (
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 h-[320px] flex flex-col shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4 flex justify-between items-center">
                Recent Activity
                <button onClick={() => navigate(`/projects/${project._id}/realtime-logs`)} className="text-indigo-500 hover:text-indigo-600 transition-colors text-[10px] cursor-pointer">
                    View Logs &rarr;
                </button>
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                {events.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-3">
                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <p className="text-xs text-slate-500">No events yet.</p>
                    </div>
                ) : (
                    events.map((ev, i) => {
                        const dateObj = new Date(ev.createdAt);
                        const timeStr = isToday(dateObj) ? format(dateObj, 'HH:mm') : format(dateObj, 'dd/MM HH:mm');

                        let message = "";
                        if (ev.field === 'Issue Created') message = `Created issue`;
                        else if (ev.field === 'Issue Deleted') message = `Deleted issue`;
                        else message = `Updated ${ev.field}`;

                        return (
                            <div key={ev._id || i} className="flex gap-3 items-start group">
                                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                                        <span className="font-bold">{ev.authorId?.fullName || "System"}</span> {message}
                                    </p>
                                    <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                        <span>{timeStr}</span>
                                        {ev.issueId?.issueKey && (
                                            <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold text-slate-600 block truncate max-w-[100px]">
                                                {ev.issueId.issueKey}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
};
export default SummaryEvents;