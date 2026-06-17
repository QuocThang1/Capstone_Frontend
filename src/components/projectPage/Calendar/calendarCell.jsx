import React from 'react';
import { isSameDay, format, isToday } from 'date-fns';

const CalendarCell = ({
    day,
    currentMonth,
    sprints,
    issues,
    onDayClick,
    showAssignee,
    projectTimezone
}) => {
    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
    const today = isToday(day);

    const toProjectTime = (dateString, timezone) => {
        if (!dateString) return null;
        const dt = new Date(dateString);
        if (isNaN(dt.getTime())) return null;
        if (!timezone) return dt;

        try {
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: timezone,
                year: 'numeric', month: 'numeric', day: 'numeric',
                hour: 'numeric', minute: 'numeric', second: 'numeric',
                hour12: false
            });
            const parts = formatter.formatToParts(dt);
            const getPart = (type) => parts.find(p => p.type === type)?.value;

            const year = parseInt(getPart('year'), 10);
            const month = parseInt(getPart('month'), 10) - 1; // 0-indexed
            const d = parseInt(getPart('day'), 10);
            let hour = parseInt(getPart('hour'), 10);
            if (hour === 24) hour = 0;
            const minute = parseInt(getPart('minute'), 10);
            const second = parseInt(getPart('second'), 10);

            return new Date(year, month, d, hour, minute, second);
        } catch (e) {
            console.warn("Invalid timezone", timezone, e);
            return dt; // fallback
        }
    };

    // Get events for this day
    const daySprints = sprints.filter(s => {
        if (!s.startDate || !s.endDate) return false;
        const start = toProjectTime(s.startDate, projectTimezone);
        const end = toProjectTime(s.endDate, projectTimezone);
        if (!start || !end) return false;
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return day >= start && day <= end;
    });

    const dayIssues = issues.filter(issue => {
        if (issue.startDate && issue.dueDate) {
            const start = toProjectTime(issue.startDate, projectTimezone);
            const due = toProjectTime(issue.dueDate, projectTimezone);
            if (!start || !due) return false;
            start.setHours(0, 0, 0, 0);
            due.setHours(23, 59, 59, 999);
            return day >= start && day <= due;
        } else if (issue.dueDate) {
            const due = toProjectTime(issue.dueDate, projectTimezone);
            return due ? isSameDay(day, due) : false;
        } else if (issue.startDate) {
            const start = toProjectTime(issue.startDate, projectTimezone);
            return start ? isSameDay(day, start) : false;
        }
        return false;
    });

    const getStatusColor = (status) => {
        const lowerStatus = String(status || '').toLowerCase();
        if (lowerStatus.includes('done') || lowerStatus.includes('resolved')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
        if (lowerStatus.includes('progress')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    };

    const getAssigneeName = (assignee) => {
        if (!assignee) return '';
        return assignee.fullName || assignee.email || '';
    };

    const getAssigneeTheme = (assignee) => {
        if (!assignee) return ''; // Fallback handled later
        const idStr = String(assignee._id || assignee);
        let hash = 0;
        for (let i = 0; i < idStr.length; i++) {
            hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // Light background, dark text for readability
        const themes = [
            'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
            'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800',
            'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
            'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
            'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800',
            'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-400 dark:border-cyan-800',
            'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800',
            'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800',
            'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800',
            'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800',
            'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-400 dark:border-fuchsia-800',
            'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/30 dark:text-pink-400 dark:border-pink-800'
        ];
        return themes[Math.abs(hash) % themes.length];
    };

    return (
        <div
            onClick={() => onDayClick && onDayClick(day)}
            className={`min-h-[120px] h-full p-2 border-r border-b border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 flex flex-col gap-1 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/80 ${!isCurrentMonth ? 'opacity-50 bg-slate-50 dark:bg-slate-950' : ''}`}
        >
            <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${today ? 'bg-indigo-600 text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {format(day, 'd')}
                </span>
            </div>

            {/* Đã bỏ overflow-y-auto và no-scrollbar để cell có thể giãn ra */}
            <div className="flex-1 flex flex-col gap-1 mt-1">
                {daySprints.map(s => (
                    <div key={`sprint-${s._id}`} className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 truncate" title={s.name}>
                        🏃 {s.name}
                    </div>
                ))}

                {dayIssues.map(issue => {
                    const assigneeName = showAssignee ? getAssigneeName(issue.assigneeId) : '';
                    const shortName = assigneeName ? assigneeName.split(' ').pop() : '';
                    
                    // Ưu tiên màu theo người làm, nếu chưa có ai thì dùng màu theo Status
                    const taskTheme = issue.assigneeId 
                        ? getAssigneeTheme(issue.assigneeId) 
                        : getStatusColor(issue.resolution || issue.status);

                    return (
                        <div
                            key={`issue-${issue._id}`}
                            className={`px-1.5 py-0.5 text-[10px] font-medium rounded border flex items-center justify-between gap-1 overflow-hidden ${taskTheme}`}
                            title={`${issue.issueKey}: ${issue.title} ${assigneeName ? `(${assigneeName})` : ''}`}
                        >
                            <span className="truncate flex-1">{issue.issueKey} - {issue.title}</span>
                            {showAssignee && assigneeName && (
                                <div className="flex items-center shrink-0 px-1 rounded-sm bg-black/10 dark:bg-white/20" title={`Assignee: ${assigneeName}`}>
                                    <span className="opacity-90 font-bold truncate max-w-[40px]">{shortName}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarCell;
