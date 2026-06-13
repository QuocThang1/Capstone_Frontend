import React, { useState, useEffect, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter } from 'lucide-react';
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    startOfWeek, endOfWeek, eachDayOfInterval
} from 'date-fns';
import { getSprintsByProjectApi } from '../../../../utils/Api/sprintApi';
import { getProjectMembersApi } from '../../../../utils/Api/projectApi';
import { getIssuesByProjectApi } from '../../../../utils/Api/issueApi';
import CalendarCell from '../../../../components/projectPage/Calendar/calendarCell';
import SelectDropdown from '../../../../components/selectDropdown';
import Spinner from '../../../../components/spinner';

const Calendar = () => {
    const { project } = useOutletContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [issues, setIssues] = useState([]);
    const [sprints, setSprints] = useState([]);
    const [members, setMembers] = useState([]);
    const [selectedAssignees, setSelectedAssignees] = useState([]); // array of user IDs
    const [loading, setLoading] = useState(true);

    // Fetch sprints and members với hiệu ứng loading
    useEffect(() => {
        if (!project) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [sprintsRes, membersRes, issuesRes] = await Promise.all([
                    getSprintsByProjectApi(project._id),
                    getProjectMembersApi(project._id),
                    getIssuesByProjectApi(project._id)
                ]);

                if (sprintsRes?.EC === 0) {
                    setSprints(sprintsRes.data || []);
                }
                if (membersRes?.EC === 0) {
                    setMembers(membersRes.data || []);
                }
                if (issuesRes?.EC === 0) {
                    setIssues(issuesRes.data || []);
                }
            } catch (err) {
                console.error("Error fetching calendar data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [project]);

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const goToday = () => setCurrentDate(new Date());

    // Generate days for the grid
    const daysInMonth = useMemo(() => {
        const monthStart = startOfMonth(currentDate);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

        return eachDayOfInterval({
            start: startDate,
            end: endDate
        });
    }, [currentDate]);

    // Apply Filters
    const filteredIssues = useMemo(() => {
        let filtered = issues || [];

        if (selectedAssignees.length > 0) {
            filtered = filtered.filter(issue => {
                const assigneeId = issue.assigneeId?._id || issue.assigneeId;
                if (!assigneeId) {
                    return selectedAssignees.includes("unassigned");
                }
                return selectedAssignees.includes(assigneeId);
            });
        }

        return filtered;
    }, [issues, selectedAssignees]);

    const memberOptions = useMemo(() => {
        const opts = [{ label: 'Unassigned', value: 'unassigned' }];
        members.forEach(m => {
            opts.push({ label: m.accountId.fullName || m.accountId.email, value: m.accountId._id });
        });
        return opts;
    }, [members]);

    const monthOptions = useMemo(() => {
        return Array.from({ length: 12 }).map((_, i) => ({
            label: format(new Date(2024, i, 1), 'MMMM'),
            value: i
        }));
    }, []);

    const yearOptions = useMemo(() => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 10 }).map((_, i) => {
            const year = currentYear - 5 + i;
            return { label: year.toString(), value: year };
        });
    }, []);

    const handleAssigneeFilterChange = (values) => {
        setSelectedAssignees(values);
    };

    return (
        <div className="h-[calc(100vh-20px)] flex flex-col space-y-4">
            <div className="flex flex-col gap-4">
                {/* Header Tiêu đề giống các trang khác */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <CalendarIcon className="w-6 h-6 text-indigo-500" />
                        Calendar View
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage project schedules, sprints and tasks</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center gap-2 z-20">
                            <SelectDropdown
                                value={currentDate.getMonth()}
                                options={monthOptions}
                                onChange={(val) => {
                                    const newDate = new Date(currentDate);
                                    newDate.setMonth(val);
                                    setCurrentDate(newDate);
                                }}
                                width="w-36"
                            />
                            <SelectDropdown
                                value={currentDate.getFullYear()}
                                options={yearOptions}
                                onChange={(val) => {
                                    const newDate = new Date(currentDate);
                                    newDate.setFullYear(val);
                                    setCurrentDate(newDate);
                                }}
                                width="w-28"
                            />
                        </div>
                        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>
                            <button onClick={goToday} className="px-4 py-2 text-sm font-medium border-x border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 cursor-pointer">
                                Today
                            </button>
                            <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-64 z-20">
                            <SelectDropdown
                                value={selectedAssignees}
                                options={memberOptions}
                                onChange={handleAssigneeFilterChange}
                                placeholder="Filter by Assignee..."
                                isMulti={true}
                                width="w-full"
                            />
                        </div>
                        {selectedAssignees.length > 0 && (
                            <button
                                onClick={() => setSelectedAssignees([])}
                                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline whitespace-nowrap cursor-pointer"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col">
                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid Container */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center h-full min-h-[400px]">
                            <Spinner text="Loading calendar data..." />
                        </div>
                    ) : (
                        <div className="grid grid-cols-7 min-h-full auto-rows-[minmax(120px,auto)]">
                            {daysInMonth.map((day, i) => (
                                <CalendarCell
                                    key={i}
                                    day={day}
                                    currentMonth={currentDate}
                                    sprints={sprints}
                                    issues={filteredIssues}
                                    showAssignee={selectedAssignees.length > 0}
                                    projectTimezone={project?.timezone}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Calendar;
