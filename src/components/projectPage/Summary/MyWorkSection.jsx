import React, { useState, useEffect } from "react";
import { getSprintsByProjectApi } from "../../../utils/Api/sprintApi";
import { getMyIssuesByProjectApi } from "../../../utils/Api/issueApi";
import SelectDropdown from "../../selectDropdown";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle2 } from "lucide-react"; // Bổ sung icon thời gian

// Hàm Helper để format thời gian hiển thị đẹp mắt
const formatDate = (dateString, timezone = "Asia/Ho_Chi_Minh") => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleString("en-US", {
        timeZone: timezone,
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true // Đặt false nếu bạn muốn dùng định dạng 24h thay vì AM/PM
    });
};

const SimpleIssueCard = ({ issue, projectId, navigate, activeTab, projectTimezone }) => {
    const isDone = issue.status?.toLowerCase() === 'done';
    const isOverdue = !isDone && issue.dueDate && new Date(issue.dueDate) < new Date();
    const iconBg = isDone ? 'bg-emerald-500' : isOverdue ? 'bg-rose-500' : 'bg-blue-600';

    // Kiểm tra xem đây có phải là Subtask không
    const hasParent = !!issue.parentId;

    // Nếu BE đã populate, ta lấy key (VD: LA-15). Nếu chưa, để chữ mặc định.
    const parentKey = issue.parentId?.issueKey || 'Parent Task';

    return (
        <div
            onClick={() => navigate(`/projects/${projectId}/list?issueId=${issue._id}`)}
            className="flex items-center gap-4 py-3.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm ${iconBg}`}>
                {issue.type ? issue.type.charAt(0).toUpperCase() : 'T'}
            </div>

            <div className="flex flex-col flex-1 min-w-0">
                {/* --- KHU VỰC HIỂN THỊ TASK CHA --- */}
                {hasParent && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold mb-0.5">
                        <span className="hover:text-blue-500 transition-colors">{parentKey}</span>
                        <span>/</span>
                    </div>
                )}

                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {issue.title}
                </span>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1.5">
                    <span className="font-medium text-slate-600 dark:text-slate-300">{issue.issueKey}</span>
                    <span>•</span>
                    <span>{hasParent ? 'Subtask' : (issue.type || 'Task')}</span>
                    <span>•</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 uppercase tracking-tight text-[10px] font-semibold">
                        {issue.status}
                    </span>
                </div>
            </div>

            <div className="shrink-0 flex flex-col items-end gap-1.5 text-xs">
                {isDone ? (
                    issue.completedAt && (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{formatDate(issue.completedAt, projectTimezone)}</span>
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-end gap-1">
                        {issue.startDate && (
                            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{formatDate(issue.startDate, projectTimezone)}</span>
                            </div>
                        )}
                        {issue.dueDate && (
                            <div className={`flex items-center gap-1.5 font-medium ${isOverdue ? 'text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 px-1.5 py-0.5 rounded' : 'text-slate-600 dark:text-slate-300'}`}>
                                <Clock className="w-3.5 h-3.5" />
                                <span>{formatDate(issue.dueDate, projectTimezone)}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const MyWorkSection = ({ project }) => {
    const navigate = useNavigate();
    const [sprints, setSprints] = useState([]);
    const [myIssues, setMyIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSprint, setSelectedSprint] = useState("");
    const [selectedType, setSelectedType] = useState("");

    // Tab mặc định
    const [activeTab, setActiveTab] = useState('assigned');

    useEffect(() => {
        if (project?._id) {
            getSprintsByProjectApi(project._id).then(res => {
                if (res && res.EC === 0) setSprints(res.data);
            });
        }
    }, [project?._id]);

    useEffect(() => {
        if (!project?._id || !project?.issueTypes) return;
        const fetchMyWork = async () => {
            setLoading(true);
            try {
                const filters = {};
                if (selectedSprint) filters.sprint = selectedSprint;
                if (selectedType) filters.type = selectedType;

                const res = await getMyIssuesByProjectApi(project._id, filters);
                if (res && res.EC === 0) setMyIssues(res.data);
            } catch (error) {
                console.error("Error fetching my issues:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMyWork();
    }, [project?._id, project?.issueTypes, selectedSprint, selectedType]);

    const sprintOptions = [
        { value: '', label: 'All Sprints' },
        ...sprints.map(s => {
            const isBacklog = s.name?.toLowerCase() === 'backlog';
            const statusLabel = s.status ? ` (${s.status.charAt(0).toUpperCase() + s.status.slice(1)})` : '';
            return {
                value: s._id,
                label: isBacklog ? s.name : `${s.name}${statusLabel}`
            };
        })
    ];
    const typeOptions = [
        { label: "All Types", value: "" },
        { label: "Subtask", value: "Sub-task" },
        ...(project?.issueTypes?.map(t => {
            const val = typeof t === 'string' ? t : t.name;
            return { label: val, value: val };
        }) || [])
    ];

    // PHÂN LOẠI DỮ LIỆU
    const today = new Date();

    const assignedToMe = myIssues;
    const onWork = myIssues.filter(i => i.status?.toLowerCase() !== 'done');
    const doneIssues = myIssues.filter(i => i.status?.toLowerCase() === 'done');

    // Lọc Overdue: Chưa hoàn thành, CÓ dueDate, và dueDate < hiện tại
    const overdueIssues = myIssues.filter(i => {
        if (i.status?.toLowerCase() === 'done' || !i.dueDate) return false;
        return new Date(i.dueDate) < today;
    });

    // Cấu hình Tabs (Bổ sung tab Overdue)
    const tabs = [
        { id: 'assigned', label: 'Assigned to me', count: assignedToMe.length, data: assignedToMe },
        { id: 'onwork', label: 'On Work', count: onWork.length, data: onWork },
        { id: 'overdue', label: 'Overdue', count: overdueIssues.length, data: overdueIssues, isAlert: true },
        { id: 'done', label: 'Done', count: doneIssues.length, data: doneIssues },
    ];

    const currentTabData = tabs.find(t => t.id === activeTab)?.data || [];

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                <div className="flex items-center gap-6 border-b border-slate-200 dark:border-slate-800 w-full sm:w-auto overflow-x-auto custom-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative cursor-pointer pb-3 flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? tab.isAlert ? 'text-rose-600 dark:text-rose-400' : 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                                }`}
                        >
                            {tab.label}
                            <span className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${tab.isAlert
                                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                }`}>
                                {tab.count}
                            </span>

                            {activeTab === tab.id && (
                                <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-t-full ${tab.isAlert ? 'bg-rose-600 dark:bg-rose-400' : 'bg-blue-600 dark:bg-blue-400'
                                    }`}></span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 shrink-0 mb-2 sm:mb-0">
                    <div className="w-36">
                        <SelectDropdown value={selectedSprint} options={sprintOptions} onChange={setSelectedSprint} placeholder="All Sprints" size="sm" />
                    </div>
                    <div className="w-32">
                        <SelectDropdown value={selectedType} options={typeOptions} onChange={setSelectedType} placeholder="All Types" size="sm" />
                    </div>
                </div>
            </div>

            <div className="min-h-[200px]">
                {loading ? (
                    <div className="py-12 flex justify-center text-slate-400 font-medium text-sm animate-pulse">
                        Loading your work items...
                    </div>
                ) : (
                    <div className="flex flex-col gap-1">
                        <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 px-2 mt-4">
                            {activeTab === 'overdue' ? 'Requires Attention' : 'Your Work List'}
                        </h4>
                        <div className="flex flex-col max-h-[400px] overflow-y-auto pr-1 custom-scrollbar divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800/30 mt-2">
                            {currentTabData.length === 0 ? (
                                <p className="text-sm text-slate-500 py-6 px-2 text-center">No items in this category.</p>
                            ) : (
                                currentTabData.map(issue => (
                                    <SimpleIssueCard
                                        key={issue._id}
                                        issue={issue}
                                        projectId={project._id}
                                        navigate={navigate}
                                        activeTab={activeTab}
                                        projectTimezone={project.timezone}
                                    />
                                ))
                            )}
                        </div>

                        <div className="mt-8 text-center pb-4">
                            <button onClick={() => navigate(`/projects/${project._id}/list`)} className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline cursor-pointer">
                                Couldn't find your work item? View all work items
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyWorkSection;