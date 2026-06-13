import { useEffect, useMemo, useState, useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import {
    X,
    Trash2,
    User,
    Calendar,
    Star,
    ChevronsRight,
    Plus,
    FileText,
    Download,
    Clock,
    Paperclip,
    ChevronDown,
    CornerDownRight,
} from 'lucide-react';

import Spinner from '../../../../components/spinner';
import SelectDropdown from '../../../../components/selectDropdown';
import CommentSection from '../../../../components/projectPage/IssueDetail/commentSection';
import HistorySection from '../../../../components/projectPage/IssueDetail/historySection';
import {
    updateIssueApi,
    createSubtaskApi,
    getSubtaskApi,
    deleteIssueApi,
    evaluateIssueApi,
    deleteEvaluationApi,
} from '../../../../utils/Api/issueApi';
import { AuthContext } from '../../../../context/auth.context';
import { getProjectMembersApi } from '../../../../utils/Api/projectApi';
import DeleteIssueModal from '../Backlog/Issue/deleteIssueModal';

const toUtcIsoString = (localDateTime, timeZone) => {
    if (!localDateTime) return null;
    try {
        const tempDate = new Date(`${localDateTime}:00`);
        const tzStr = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZone || 'UTC',
            timeZoneName: 'longOffset'
        }).format(tempDate);

        let offset = tzStr.split(' ').pop().replace('GMT', '');
        return new Date(`${localDateTime}:00${offset || '+00:00'}`).toISOString();
    } catch (e) {
        return new Date(localDateTime).toISOString();
    }
};

const IssueListDetail = ({
    project,
    issue,
    onClose,
    onDataUpdate,
    canEditStatus = true,
}) => {
    const [projectMembers, setProjectMembers] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);;
    const [activeTab, setActiveTab] = useState('comments');
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const { user } = useContext(AuthContext);
    const isLeader = project?.members?.some(m => m.role === 'leader' && m.accountId?._id === user?._id);
    const [evalRating, setEvalRating] = useState(issue?.evaluation?.rating || 0);
    const [evalFeedback, setEvalFeedback] = useState(issue?.evaluation?.feedback || '');
    const [evalAt, setEvalAt] = useState(issue?.evaluation?.evaluatedAt || null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isEvalEditing, setIsEvalEditing] = useState(false);
    const [showConfirmDeleteEval, setShowConfirmDeleteEval] = useState(false);

    const { register, handleSubmit, reset, watch, setValue } = useForm();

    const assigneeValue = watch('assigneeId');
    const priorityValue = watch('priority');
    const statusValue = watch('status');

    const subtaskInputRef = useRef(null);

    const allowStatusEdit = canEditStatus;

    const formatDateTimeLocal = (dateString, timeZone) => {
        if (!dateString) return '';
        try {
            const d = new Date(dateString);
            const options = {
                timeZone: timeZone || 'UTC',
                year: 'numeric', month: '2-digit', day: '2-digit',
                hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
            };
            const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(d);
            const map = {};
            parts.forEach(p => map[p.type] = p.value);
            return `${map.year}-${map.month}-${map.day}T${map.hour}:${map.minute}`;
        } catch (error) {
            const d = new Date(dateString);
            return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
        }
    };

    const resetFormToIssue = () => {
        if (!issue) return;

        reset({
            title: issue.title || '',
            description: issue.description || '',
            requiredSkills: Array.isArray(issue.requiredSkills)
                ? issue.requiredSkills.join(', ')
                : '',
            assigneeId: issue.assigneeId?._id || 'null',
            priority: issue.priority || 'Medium',
            status: issue.status || '',
            storyPoints: issue.storyPoints || 0,
            timeExpect: issue.timeExpect || 0,
            startDate: formatDateTimeLocal(issue.startDate, project?.timezone),
            dueDate: formatDateTimeLocal(issue.dueDate, project?.timezone),
        });
        setEvalRating(issue.evaluation?.rating || 0);
        setEvalFeedback(issue.evaluation?.feedback || '');
        setEvalAt(issue.evaluation?.evaluatedAt || null);
        setIsEvalEditing(false);
    };

    useEffect(() => {
        resetFormToIssue();
        setSubtasks([]);
        setSelectedSubtask(null);
        setActiveTab('comments');
    }, [issue, reset]);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!project?._id) return;
            try {
                const res = await getProjectMembersApi(project._id);
                if (res?.EC === 0) setProjectMembers(res.data || []);
            } catch (error) {
                console.error('Failed to fetch project members', error);
            }
        };

        fetchMembers();
    }, [project?._id]);

    useEffect(() => {
        fetchSubtasks();
    }, [issue?._id, issue?.parentId]);

    const assigneeOptions = useMemo(() => ([
        { value: 'null', label: 'Unassigned' },
        ...projectMembers.map(member => ({
            value: member.accountId?._id,
            label: member.accountId?.fullName || member.accountId?.username || 'Unknown',
        })),
    ]), [projectMembers]);

    const priorityOptions = [
        { value: 'Highest', label: 'Highest' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
        { value: 'Lowest', label: 'Lowest' },
    ];

    const statusOptions = useMemo(() => (
        project?.boardColumns?.map(col => ({
            value: col.name,
            label: col.name,
        })) || []
    ), [project?.boardColumns]);

    const fetchSubtasks = async () => {
        if (!issue?._id || issue.parentId) {
            setSubtasks([]);
            return;
        }

        setLoadingSubtasks(true);
        try {
            const res = await getSubtaskApi(issue._id);
            if (res?.EC === 0) setSubtasks(res.data || []);
            else setSubtasks([]);
        } catch (error) {
            console.error('Failed to fetch subtasks', error);
            setSubtasks([]);
        } finally {
            setLoadingSubtasks(false);
        }
    };

    const handleUpdate = async (data) => {
        if (!issue?._id) return;

        const parsedSkills = data.requiredSkills
            ? data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
            : [];

        const payload = {
            title: data.title,
            description: data.description,
            requiredSkills: parsedSkills,
            assigneeId: data.assigneeId === 'null' ? null : data.assigneeId,
            priority: data.priority,
            storyPoints: Number(data.storyPoints) || 0,
            startDate: toUtcIsoString(data.startDate, project?.timezone),
            dueDate: toUtcIsoString(data.dueDate, project?.timezone),
        };

        if (allowStatusEdit) {
            payload.status = data.status;
        }

        try {
            const res = await updateIssueApi(issue._id, payload);
            if (res?.EC === 0) {
                toast.success(res.EM || 'Issue updated');
                onDataUpdate?.();
            } else {
                toast.error(res?.EM || 'Update failed');
                resetFormToIssue();
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || 'Update failed');
        }
    };

    const handleConfirmDelete = async (issueId) => {
        try {
            const res = await deleteIssueApi(issueId);
            if (res?.EC === 0) {
                toast.success(res.EM || 'Issue deleted');
                setShowDeleteModal(false);
                onDataUpdate?.();
                onClose?.();
            } else {
                toast.error(res?.EM || 'Delete failed');
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || 'Delete failed');
        }
    };

    const handleFieldChange = (field, value) => {
        if (field === 'status' && !allowStatusEdit) return;
        setValue(field, value, { shouldValidate: true });
        handleSubmit(handleUpdate)();
    };

    const handleEvaluateSubmit = async () => {
        if (evalRating === 0) {
            toast.warning("Please provide a star rating.");
            return;
        }
        try {
            setIsEvaluating(true);
            const res = await evaluateIssueApi(issue._id, { rating: evalRating, feedback: evalFeedback });
            if (res.EC === 0) {
                toast.success("Evaluation submitted successfully");
                setIsEvalEditing(false);
                setEvalAt(new Date().toISOString());
                if (onDataUpdate) onDataUpdate();
            } else {
                toast.error(res.EM || "Failed to submit evaluation");
            }
        } catch (error) {
            toast.error("An error occurred while evaluating");
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleDeleteEvaluation = async () => {
        try {
            setIsEvaluating(true);
            const res = await deleteEvaluationApi(issue._id);
            if (res.EC === 0) {
                toast.success(res.EM || "Evaluation deleted successfully");
                setEvalRating(0);
                setEvalFeedback('');
                setEvalAt(null);
                setIsEvalEditing(false);
                setShowConfirmDeleteEval(false);
                if (onDataUpdate) onDataUpdate();
            } else {
                toast.error(res.EM || "Failed to delete evaluation");
            }
        } catch (error) {
            toast.error("An error occurred while deleting evaluation");
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleCreateSubtask = async () => {
        if (!issue?._id || !newSubtaskTitle.trim()) return;

        try {
            const res = await createSubtaskApi({
                parentId: issue._id,
                title: newSubtaskTitle.trim(),
            });

            if (res?.EC === 0) {
                toast.success(res.EM || 'Subtask created');
                setNewSubtaskTitle('');
                onDataUpdate?.();
                const refresh = await getSubtaskApi(issue._id);
                if (refresh?.EC === 0) setSubtasks(refresh.data || []);
            } else {
                toast.error(res?.EM || 'Create subtask failed');
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || 'Create subtask failed');
        }
    };

    const handleDeleteSubtask = async (subtask) => {
        try {
            const res = await deleteIssueApi(subtask._id);
            if (res?.EC === 0) {
                toast.success('Subtask deleted');
                onDataUpdate?.();
                const refresh = await getSubtaskApi(issue._id);
                if (refresh?.EC === 0) setSubtasks(refresh.data || []);
            } else {
                toast.error(res?.EM || 'Delete failed');
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || 'Delete failed');
        }
    };

    const subtasksDone = subtasks.filter(s => String(s.status || '').toLowerCase() === 'done').length;
    const progress = subtasks.length ? (subtasksDone / subtasks.length) * 100 : 0;

    if (!issue) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 10, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex flex-col w-full max-w-6xl max-h-[90vh] border border-slate-200 dark:border-slate-800"
                >
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                        <div className="flex items-center gap-3 min-w-0">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2 min-w-0">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs dark:bg-blue-900 dark:text-blue-300">
                                    Issue
                                </span>
                                <span className="truncate">{issue.issueKey}</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(true)}
                                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1" />
                            <button
                                onClick={onClose}
                                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto px-8 py-6 border-r border-slate-200 dark:border-slate-700 custom-scrollbar">
                            <form onBlur={handleSubmit(handleUpdate)}>
                                <input
                                    {...register('title')}
                                    className="text-3xl font-extrabold bg-transparent w-full focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-900/20 rounded-md py-1 px-2 -ml-2 text-slate-900 dark:text-slate-100 transition-all duration-200 mb-4"
                                />

                                <div className="mt-4">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Description</h3>
                                    <textarea
                                        {...register('description')}
                                        rows="5"
                                        placeholder="Add a description..."
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-200 resize-y"
                                    />
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Required Skills</h3>
                                    <input
                                        {...register('requiredSkills')}
                                        placeholder="e.g. React, Nodejs, Design (comma separated)"
                                        className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-200"
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Attachments</h3>
                                    {Array.isArray(issue.attachments) && issue.attachments.length > 0 ? (
                                        <div className="grid gap-3">
                                            {issue.attachments.map(att => (
                                                <div
                                                    key={att._id || att.url}
                                                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg"
                                                >
                                                    <a
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="flex items-center gap-3 min-w-0 flex-1"
                                                    >
                                                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                                                {att.filename}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {att.uploadedBy?.fullName || 'User'}
                                                            </p>
                                                        </div>
                                                    </a>
                                                    <a
                                                        href={att.url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-md"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-6 text-center text-sm text-slate-500">
                                            No attachments
                                        </div>
                                    )}
                                </div>
                            </form>

                            {!issue.parentId && (
                                <div className="mt-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            Subtasks
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">
                                                {subtasks.length}
                                            </span>
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={() => subtaskInputRef.current?.focus()}
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Add Subtask
                                        </button>
                                    </div>

                                    {subtasks.length > 0 && (
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                                {Math.round(progress)}% Done
                                            </span>
                                        </div>
                                    )}

                                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="grid grid-cols-[minmax(200px,1fr)_160px_140px_40px] items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 rounded-t-md">
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Work</span>
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex justify-center">Assignee</span>
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex justify-center">Status</span>
                                            <span />
                                        </div>

                                        {loadingSubtasks ? (
                                            <div className="flex justify-center py-6"><Spinner /></div>
                                        ) : subtasks.length === 0 ? (
                                            <div className="p-6 text-center text-slate-500 text-sm">No subtasks found</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {subtasks.map(sub => (
                                                    <button
                                                        key={sub._id}
                                                        type="button"
                                                        onClick={() => setSelectedSubtask(sub)}
                                                        className="w-full grid grid-cols-[minmax(200px,1fr)_160px_140px_40px] items-center gap-4 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left cursor-pointer"
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                                                                <CornerDownRight className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                                                                {sub.issueKey}
                                                            </span>
                                                            <span className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">
                                                                {sub.title}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-center min-w-0">
                                                            <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                                                                {sub.assigneeId?.fullName || sub.assigneeId?.username || 'Unassigned'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-center">
                                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide border border-black/5 dark:border-white/5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                                                {sub.status || 'N/A'}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-center text-slate-400">
                                                            <ChevronDown className="w-4 h-4 opacity-0 group-hover:opacity-100" />
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                        <div className="p-2 bg-slate-50 dark:bg-slate-800/30">
                                            <input
                                                ref={subtaskInputRef}
                                                type="text"
                                                value={newSubtaskTitle}
                                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleCreateSubtask()}
                                                placeholder="What needs to be done? (Press Enter to add)"
                                                className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* --- Evaluation Section --- */}
                            <div className="mt-10 border border-slate-200 dark:border-slate-700 rounded-lg p-5 bg-slate-50/30 dark:bg-slate-800/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500" /> Leader Evaluation
                                    </h3>
                                    {isLeader && issue?.status === 'Done' && !isEvalEditing && (
                                        <div className="flex items-center gap-3">
                                            <button onClick={() => setIsEvalEditing(true)} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer">
                                                {evalRating ? 'Edit Evaluation' : 'Evaluate'}
                                            </button>
                                            {evalRating > 0 && (
                                                <div className="relative">
                                                    <button onClick={() => setShowConfirmDeleteEval(true)} disabled={isEvaluating} className="text-xs text-rose-500 hover:text-rose-600 font-medium cursor-pointer disabled:opacity-50">
                                                        Delete
                                                    </button>
                                                    {showConfirmDeleteEval && (
                                                        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-md p-2 z-50 min-w-[120px]">
                                                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2 whitespace-nowrap text-center">Delete it?</p>
                                                            <div className="flex justify-center gap-2">
                                                                <button onClick={() => setShowConfirmDeleteEval(false)} className="px-2 py-1 text-[10px] font-medium bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded cursor-pointer transition-colors">Cancel</button>
                                                                <button onClick={handleDeleteEvaluation} className="px-2 py-1 text-[10px] font-medium bg-rose-500 hover:bg-rose-600 text-white rounded cursor-pointer transition-colors">Delete</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {!isEvalEditing && evalRating ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className={`w-5 h-5 ${star <= evalRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                                                ))}
                                            </div>
                                            {evalAt && (
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {new Date(evalAt).toLocaleString('en-US', {
                                                        year: 'numeric', month: 'short', day: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        {evalFeedback && (
                                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{evalFeedback}"</p>
                                        )}
                                    </div>
                                ) : !isEvalEditing && (!evalRating) ? (
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Not evaluated yet. {issue?.status !== 'Done' && ' (Issue must be Done to evaluate)'}</p>
                                ) : null}

                                {isEvalEditing && (
                                    <div className="space-y-4 mt-2">
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star 
                                                    key={star} 
                                                    onClick={() => setEvalRating(star)}
                                                    className={`w-7 h-7 cursor-pointer transition-colors ${star <= evalRating ? 'fill-amber-400 text-amber-400 hover:fill-amber-500 hover:text-amber-500' : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'}`} 
                                                />
                                            ))}
                                        </div>
                                        <textarea 
                                            value={evalFeedback} 
                                            onChange={(e) => setEvalFeedback(e.target.value)} 
                                            placeholder="Leave a feedback (optional)..." 
                                            rows="3"
                                            className="w-full p-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                                        />
                                        <div className="flex items-center gap-3">
                                            <button onClick={handleEvaluateSubmit} disabled={isEvaluating} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50 cursor-pointer">
                                                {isEvaluating ? 'Saving...' : 'Save Evaluation'}
                                            </button>
                                            <button onClick={() => { setIsEvalEditing(false); setEvalRating(issue?.evaluation?.rating || 0); setEvalFeedback(issue?.evaluation?.feedback || ''); }} className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* --- End Evaluation Section --- */}

                            <div className="mt-10">
                                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-4">Activity</h3>
                                <div className="flex items-center border-b border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('comments')}
                                        className={`px-4 py-2.5 text-sm font-semibold relative cursor-pointer ${activeTab === 'comments'
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        Comments
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('history')}
                                        className={`px-4 py-2.5 text-sm font-semibold relative cursor-pointer ${activeTab === 'history'
                                            ? 'text-indigo-600 dark:text-indigo-400'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        History
                                    </button>
                                </div>

                                <div className="mt-6">
                                    {activeTab === 'comments' && <CommentSection issueId={issue._id} />}
                                    {activeTab === 'history' && <HistorySection issueId={issue._id} />}
                                </div>
                            </div>
                        </div>

                        <div className="w-full md:w-[320px] bg-slate-50/50 dark:bg-slate-900 overflow-y-auto custom-scrollbar px-6 py-6">
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">
                                    Status
                                </label>

                                {allowStatusEdit ? (
                                    <SelectDropdown
                                        value={statusValue}
                                        options={statusOptions}
                                        onChange={(val) => handleFieldChange('status', val)}
                                        placeholder="Select Status"
                                    />
                                ) : (
                                    <div className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold">
                                        {issue.status || 'N/A'}
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 mb-6" />

                            <div className="space-y-5">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Details</h3>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <User className="w-3.5 h-3.5" /> Assignee
                                    </label>
                                    <SelectDropdown
                                        value={assigneeValue || 'null'}
                                        options={assigneeOptions}
                                        onChange={(val) => handleFieldChange('assigneeId', val)}
                                        placeholder="Select Assignee"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Star className="w-3.5 h-3.5" /> Priority
                                    </label>
                                    <SelectDropdown
                                        value={priorityValue}
                                        options={priorityOptions}
                                        onChange={(val) => handleFieldChange('priority', val)}
                                        placeholder="Select Priority"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <ChevronsRight className="w-3.5 h-3.5" /> Story Points
                                    </label>
                                    <input
                                        type="number"
                                        {...register('storyPoints')}
                                        onBlur={(e) => handleFieldChange('storyPoints', e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Clock className="w-3.5 h-3.5 text-orange-500" /> Time Expect (hours)
                                    </label>
                                    <input
                                        type="text"
                                        {...register('timeExpect')}
                                        readOnly
                                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-500 shadow-inner cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Start Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('startDate')}
                                        onBlur={(e) => handleFieldChange('startDate', e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Due Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register('dueDate')}
                                        onBlur={(e) => handleFieldChange('dueDate', e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <DeleteIssueModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    loading={false}
                    issue={issue}
                />

                {selectedSubtask && (
                    <IssueListDetail
                        project={project}
                        issue={selectedSubtask}
                        canEditStatus={false}
                        onClose={() => setSelectedSubtask(null)}
                        onDataUpdate={() => {
                            onDataUpdate?.();
                            fetchSubtasks();
                        }}
                    />
                )}
            </motion.div>
        </AnimatePresence>
    );
};

export default IssueListDetail;