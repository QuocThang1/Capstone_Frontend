import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, CheckSquare, Bug, Bookmark, CornerDownRight, // Thêm CornerDownRight
    ChevronsUp, ChevronUp, Equal, ChevronDown as ChevronDownIcon, ChevronsDown,
    X, ListTodo, Inbox
} from 'lucide-react';
import { format } from 'date-fns';

import { getIssuesByProjectApi } from '../../../../utils/Api/issueApi';
import { getSprintsByProjectApi } from '../../../../utils/Api/sprintApi';
import Spinner from '../../../../components/spinner';
import SelectDropdown from '../../../../components/selectDropdown';
import IssueListDetail from './issueListDetail';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const IssueList = () => {
    const { project } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [issues, setIssues] = useState([]);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [sprints, setSprints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        sprint: '',
        priority: '',
        status: '',
        assignee: '',
        type: '' // THÊM filter cho Type
    });

    const canEditIssueStatus = (issue) => {
        if (!issue || issue.parentId) return false;

        const sprint = issue.sprintId || issue.sprint;
        if (!sprint || typeof sprint === 'string') return false;

        const sprintStatus = String(sprint.status || '').toLowerCase();

        return (
            sprint.isCompleted === true ||
            sprint.completed === true ||
            sprint.completedAt ||
            sprintStatus === 'completed' ||
            sprintStatus === 'done'
        );
    };

    useEffect(() => {
        setLoadingPage(true);
        const fetchSprints = async () => {
            if (!project?._id) return;
            try {
                const res = await getSprintsByProjectApi(project._id);
                if (res && res.EC === 0) setSprints(res.data);
            } catch (error) {
                console.error("Lỗi lấy danh sách sprint:", error);
            } finally {
                setLoadingPage(false);
            }
        };
        fetchSprints();
    }, [project]);

    const fetchFilteredIssues = useCallback(async () => {
        setLoading(true);
        try {
            const apiFilters = {
                title: searchTerm,
                sprint: filters.sprint,
                priority: filters.priority,
                status: filters.status,
                assignee: filters.assignee,
                type: filters.type
            };

            Object.keys(apiFilters).forEach(key => {
                if (!apiFilters[key]) delete apiFilters[key];
            });

            const res = await getIssuesByProjectApi(project._id, apiFilters);
            if (res && res.EC === 0) {
                setIssues(res.data || []);
            }
        } catch (error) {
            console.error("Lỗi lọc danh sách issue:", error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, filters, project]);

    useEffect(() => {
        if (!project?._id) return;

        const delayTimer = setTimeout(() => {
            fetchFilteredIssues();
        }, 300);

        return () => clearTimeout(delayTimer);
    }, [fetchFilteredIssues, project?._id]);

    useEffect(() => {
        const issueId = searchParams.get('issueId');
        if (!issueId || !issues.length) return;

        const matchedIssue = issues.find(issue => issue._id === issueId);
        if (matchedIssue) {
            setSelectedIssue(matchedIssue);
        }
    }, [issues, searchParams]);

    const handleCloseModal = () => {
        setSelectedIssue(null);
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('issueId');
        setSearchParams(nextParams, { replace: true });
    };

    const formatDate = (dateString) => {
        if (!dateString) return <span className="text-slate-400 italic">None</span>;
        try {
            return new Intl.DateTimeFormat('en-US', {
                timeZone: project?.timezone || 'UTC',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(new Date(dateString));
        } catch (error) {
            return format(new Date(dateString), 'MMM d, yyyy, h:mm a');
        }
    };

    const getPriorityDisplay = (priority) => {
        switch (priority) {
            case 'Highest': return <div className="flex items-center gap-2"><ChevronsUp className="w-[18px] h-[18px] text-rose-600" /> <span className="font-medium text-rose-700 dark:text-rose-400">Highest</span></div>;
            case 'High': return <div className="flex items-center gap-2"><ChevronUp className="w-[18px] h-[18px] text-rose-500" /> <span className="font-medium text-rose-600 dark:text-rose-400">High</span></div>;
            case 'Low': return <div className="flex items-center gap-2"><ChevronDownIcon className="w-[18px] h-[18px] text-emerald-500" /> <span className="font-medium text-emerald-600 dark:text-emerald-400">Low</span></div>;
            case 'Lowest': return <div className="flex items-center gap-2"><ChevronsDown className="w-[18px] h-[18px] text-emerald-600" /> <span className="font-medium text-emerald-700 dark:text-emerald-400">Lowest</span></div>;
            default: return <div className="flex items-center gap-2"><Equal className="w-[18px] h-[18px] text-amber-500" /> <span className="font-medium text-amber-600 dark:text-amber-400">Medium</span></div>;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Done': return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400";
            case 'In Progress': return "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
            default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
        }
    };

    const activeFilterCount = Object.values(filters).filter(Boolean).length;

    // --- CẤU HÌNH OPTION CHO SELECT DROPDOWN ---
    // Lấy issueTypes từ Project
    const typeOptions = [
        { label: "All Types", value: "" },
        { label: "Subtask", value: "Sub-task" },
        ...(project?.issueTypes?.map(t => ({
            label: typeof t === 'string' ? t : t.name,
            value: typeof t === 'string' ? t : t.name
        })) || [])
    ];

    const assigneeOptions = [{ label: "All Assignees", value: "" }, ...(project?.members?.map(m => ({ label: m.accountId.fullName || m.accountId.username, value: m.accountId._id })) || [])];
    const sprintOptions = [
        { label: "All Sprints", value: "" },
        ...sprints.map(s => {
            const isBacklog = s.name?.toLowerCase() === 'backlog';
            const statusLabel = s.status ? ` (${s.status.charAt(0).toUpperCase() + s.status.slice(1)})` : '';
            return {
                label: isBacklog ? s.name : `${s.name}${statusLabel}`,
                value: s._id
            };
        })
    ];
    const priorityOptions = [
        { label: "All Priorities", value: "" },
        { label: "Highest", value: "Highest" },
        { label: "High", value: "High" },
        { label: "Medium", value: "Medium" },
        { label: "Low", value: "Low" },
        { label: "Lowest", value: "Lowest" }
    ];
    const statusOptions = [{ label: "All Statuses", value: "" }, ...project?.boardColumns?.map(col => ({ label: col.name, value: col.name })) || []];
    const totalIssuesCount = issues.filter(i => !i.parentId).length;
    const totalSubtasksCount = issues.filter(i => i.parentId).length;

    if (loadingPage) return <div className="flex justify-center items-center h-full p-8"><Spinner /></div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col h-[calc(100vh-20px)] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden "
        >
            {/* Top Header & Filters */}
            <div className="flex flex-col gap-4 p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 shrink-0">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <ListTodo className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Issues List</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Easily find and filter your work items.</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-1">
                    <div className="relative flex-1 min-w-[240px] max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by title..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm font-medium bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-semibold border border-slate-200 dark:border-slate-700 shadow-sm">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                            {activeFilterCount > 0 && (
                                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-indigo-600 text-white text-[11px]">
                                    {activeFilterCount}
                                </span>
                            )}
                        </div>

                        {/* Thêm Cột Type Filter */}
                        <SelectDropdown value={filters.type} options={typeOptions} onChange={(val) => setFilters(prev => ({ ...prev, type: val }))} placeholder="Type" width="w-32" />

                        <SelectDropdown value={filters.assignee} options={assigneeOptions} onChange={(val) => setFilters(prev => ({ ...prev, assignee: val }))} placeholder="Assignee" width="w-40" />
                        <SelectDropdown value={filters.sprint} options={sprintOptions} onChange={(val) => setFilters(prev => ({ ...prev, sprint: val }))} placeholder="Sprint" width="w-36" />
                        <SelectDropdown value={filters.priority} options={priorityOptions} onChange={(val) => setFilters(prev => ({ ...prev, priority: val }))} placeholder="Priority" width="w-36" />
                        <SelectDropdown value={filters.status} options={statusOptions} onChange={(val) => setFilters(prev => ({ ...prev, status: val }))} placeholder="Status" width="w-36" />

                        {activeFilterCount > 0 && (
                            <button
                                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 px-3 py-2 cursor-pointer transition-colors border border-transparent hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg"
                                onClick={() => setFilters({ sprint: '', priority: '', status: '', assignee: '', type: '' })}
                            >
                                <X className="w-4 h-4" /> Clear
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1 w-full overflow-auto custom-scrollbar relative bg-white dark:bg-slate-950 ">
                {loading && (
                    <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/60 flex items-center justify-center z-20 backdrop-blur-[2px]">
                        <div className="flex items-center justify-center h-[calc(100vh-8rem)]"><Spinner /></div>
                    </div>
                )}

                <table className="w-full text-left border-collapse min-w-[1400px]">
                    <thead className="sticky top-0 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md z-10 shadow-sm">
                        <tr>
                            <th className="px-4 py-4 w-12"></th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-80">Work / Issue</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-36">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-32">Resolution</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Priority</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-28">Story Points</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Assignee</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-40">Reporter</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-44">Start Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-44">Due Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-48">Completed At</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-44">Created</th>
                        </tr>
                    </thead>

                    <motion.tbody
                        variants={containerVariants} initial="hidden" animate="visible"
                        className="divide-y divide-slate-100 dark:divide-slate-800/60"
                    >
                        {issues.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="px-6 py-20">
                                    <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                                        <Inbox className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-600" />
                                        <p className="text-base font-semibold text-slate-700 dark:text-slate-300">No issues found</p>
                                        <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            issues.map((issue) => (
                                <motion.tr
                                    variants={rowVariants} key={issue._id} onClick={() => setSelectedIssue(issue)}
                                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                                >
                                    <td className="px-4 py-4 text-center border-r border-slate-100 dark:border-slate-800/60">
                                        <div
                                            className={`shrink-0 inline-flex items-center justify-center p-1.5 rounded-lg shadow-sm ${issue.parentId ? 'bg-slate-100 dark:bg-slate-800/50' : 'bg-indigo-50 dark:bg-indigo-900/30'}`}
                                            title={issue.parentId ? "Subtask" : "Issue"}
                                        >
                                            {issue.parentId ? (
                                                <CornerDownRight className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                                            ) : (
                                                <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                                            )}
                                        </div>
                                    </td>

                                    {/* Cột Type mới */}
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">
                                            {issue.type || 'N/A'}
                                        </span>
                                    </td>

                                    {/* Cột Work / Issue */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col gap-0.5 min-w-0">
                                                <span className={`font-bold text-[13px] tracking-wide ${issue.resolution === 'Done' ? 'text-slate-400 line-through' : 'text-slate-600 dark:text-slate-400'}`}>
                                                    {issue.issueKey}
                                                </span>
                                                {issue.parentId && (
                                                    <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                                                        Parent: {issue.parentId?.issueKey || issue.parentId || 'N/A'}
                                                    </span>
                                                )}
                                                <span className={`font-medium truncate max-w-sm ${issue.resolution === 'Done' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-slate-100'} group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors`}>
                                                    {issue.title}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border border-black/5 dark:border-white/5 ${getStatusStyle(issue.status)}`}>
                                            {issue.status}
                                        </span>
                                    </td>

                                    <td className={`px-6 py-4 font-medium text-sm ${issue.resolution === 'Done' ? 'text-emerald-600' : 'text-slate-500'}`}>
                                        {issue.resolution}
                                    </td>

                                    <td className="px-6 py-4">
                                        {getPriorityDisplay(issue.priority)}
                                    </td>

                                    <td className="px-6 py-4 font-medium text-sm text-slate-700 dark:text-slate-300">
                                        {issue.storyPoints ?? 0}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300 text-left">
                                            {issue.assigneeId?.fullName || issue.assigneeId?.username || <span className="text-slate-400 italic">Unassigned</span>}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                            {issue.reporterId?.fullName || issue.reporterId?.username || "System"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {formatDate(issue.startDate)}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {formatDate(issue.dueDate)}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {formatDate(issue.completedAt)}
                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                        {formatDate(issue.createdAt)}
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </motion.tbody>
                </table>
            </div>

            {/* Footer containing item counts */}
            <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0">
                <div className="flex items-center gap-4">
                    <span>Total: <strong className="text-slate-700 dark:text-slate-200">{issues.length}</strong> items</span>
                    <span className="w-2 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span>Issues: <strong className="text-slate-700 dark:text-slate-200">{totalIssuesCount}</strong></span>
                    <span className="w-2 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <span>Subtasks: <strong className="text-slate-700 dark:text-slate-200">{totalSubtasksCount}</strong></span>
                </div>
            </div>

            <AnimatePresence>
                {selectedIssue && (
                    <IssueListDetail
                        project={project}
                        issue={selectedIssue}
                        onClose={handleCloseModal}
                        onDataUpdate={() => {
                            fetchFilteredIssues();
                        }}
                        canEditStatus={canEditIssueStatus(selectedIssue)}
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default IssueList;