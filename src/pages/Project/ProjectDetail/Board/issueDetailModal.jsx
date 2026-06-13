import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, User, Calendar, Star, ChevronsRight, ChevronDown, MoreHorizontal, Plus, Columns, Eye, Share2, Expand, Clock, Paperclip, FileText, Loader2, Download } from 'lucide-react';
import { updateIssueApi, createSubtaskApi, getSubtaskApi, deleteIssueApi, evaluateIssueApi, deleteEvaluationApi } from '../../../../utils/Api/issueApi';
import { getProjectMembersApi } from '../../../../utils/Api/projectApi';
import Spinner from '../../../../components/spinner';
import SubtaskRow from '../../../../components/projectPage/IssueDetail/subtaskRow';
import SelectDropdown from '../../../../components/selectDropdown';
import CommentSection from '../../../../components/projectPage/IssueDetail/commentSection';
import HistorySection from '../../../../components/projectPage/IssueDetail/historySection';
import { suggestAssigneesByAiApi, uploadAttachmentApi, deleteAttachmentApi } from '../../../../utils/Api/issueApi';
import AiSuggestModal from '../../../../components/projectPage/IssueDetail/aiSuggestModal';
import AiSuggestButton from '../../../../components/projectPage/IssueDetail/aiSuggestButton';
import DeleteIssueModal from '../Backlog/Issue/deleteIssueModal';
import { cn } from '../../../../lib/utils';
import { AuthContext } from '../../../../context/auth.context';

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

const IssueDetailModal = ({ project, issue, onClose, onDataUpdate, onDeleteRequest, isSubtaskMode = false }) => {
    const [projectMembers, setProjectMembers] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [selectedSubtask, setSelectedSubtask] = useState(null);
    const [attachments, setAttachments] = useState(issue?.attachments || []);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [isSubtasksVisible, setSubtasksVisible] = useState(true);
    const [activeActivityTab, setActiveActivityTab] = useState('comments');

    const [isSuggesting, setIsSuggesting] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState([]);

    const { user } = useContext(AuthContext);
    const isLeader = project?.members?.some(m => m.role === 'leader' && m.accountId?._id === user?._id);
    const [evalRating, setEvalRating] = useState(issue?.evaluation?.rating || 0);
    const [evalFeedback, setEvalFeedback] = useState(issue?.evaluation?.feedback || '');
    const [evalAt, setEvalAt] = useState(issue?.evaluation?.evaluatedAt || null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [isEvalEditing, setIsEvalEditing] = useState(false);
    const [showConfirmDeleteEval, setShowConfirmDeleteEval] = useState(false);

    const fileInputRef = useRef(null);
    const subtaskInputRef = useRef(null);

    const { register, handleSubmit, reset, watch, setValue, getValues } = useForm();
    const assigneeValue = watch('assigneeId');
    const priorityValue = watch('priority');
    const statusValue = watch('status');

    // Khởi tạo các options
    const assigneeOptions = [
        { value: 'null', label: 'Unassigned' },
        ...projectMembers.map(member => ({ value: member.accountId._id, label: member.accountId.fullName }))
    ];
    const priorityOptionsList = ["Highest", "High", "Medium", "Low", "Lowest"];
    const prioritySelectOptions = priorityOptionsList.map(p => ({ value: p, label: p }));
    const statusOptions = project?.boardColumns ? project.boardColumns.map(col => ({ value: col.name, label: col.name.toUpperCase() })) : [];

    const resetFormToOriginal = () => {
        if (!issue) return;
        setAttachments(issue.attachments || []);
        const formatForDateTimeLocal = (dateString, timeZone) => {
            if (!dateString) return '';
            try {
                const d = new Date(dateString);
                const options = {
                    timeZone: timeZone || 'UTC',
                    year: 'numeric', month: '2-digit', day: '2-digit',
                    hour: '2-digit', minute: '2-digit', hour12: false
                };
                const parts = new Intl.DateTimeFormat('en-US', options).formatToParts(d);
                const map = {};
                parts.forEach(p => map[p.type] = p.value);
                const hour = map.hour === '24' ? '00' : map.hour;
                return `${map.year}-${map.month}-${map.day}T${hour}:${map.minute}`;
            } catch (error) {
                const d = new Date(dateString);
                return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            }
        };
        reset({
            title: issue.title,
            description: issue.description || '',
            requiredSkills: issue.requiredSkills ? issue.requiredSkills.join(', ') : '',
            assigneeId: issue.assigneeId?._id || 'null',
            priority: issue.priority,
            status: issue.status,
            storyPoints: issue.storyPoints || 0,
            timeExpect: issue.timeExpect || 0,
            startDate: formatForDateTimeLocal(issue.startDate, project?.timezone),
            dueDate: formatForDateTimeLocal(issue.dueDate, project?.timezone),
        });
        setEvalRating(issue.evaluation?.rating || 0);
        setEvalFeedback(issue.evaluation?.feedback || '');
        setEvalAt(issue.evaluation?.evaluatedAt || null);
        setIsEvalEditing(false);
    };

    useEffect(() => {
        resetFormToOriginal();
    }, [issue, reset]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await getProjectMembersApi(project._id);
                if (res.EC === 0) setProjectMembers(res.data);
            } catch (error) { console.error("Failed to fetch project members", error); }
        };
        fetchMembers();
    }, [project._id]);

    const fetchSubtasks = useCallback(async () => {
        if (!issue || issue.parentId) {
            setSubtasks([]);
            return;
        }
        setLoadingSubtasks(true);
        try {
            const res = await getSubtaskApi(issue._id);
            if (res && res.EC === 0) {
                setSubtasks(res.data);
            } else {
                setSubtasks([]);
            }
        } catch (error) {
            console.error("Failed to fetch subtasks", error);
            setSubtasks([]);
        } finally {
            setLoadingSubtasks(false);
        }
    }, [issue]);

    useEffect(() => {
        fetchSubtasks();
    }, [fetchSubtasks]);

    // Đồng bộ selectedSubtask khi danh sách subtasks thay đổi
    useEffect(() => {
        if (selectedSubtask) {
            const updatedSub = subtasks.find(s => s._id === selectedSubtask._id);
            if (updatedSub && JSON.stringify(updatedSub) !== JSON.stringify(selectedSubtask)) {
                setSelectedSubtask(updatedSub);
            }
        }
    }, [subtasks, selectedSubtask]);

    // Handle Form update
    const onSubmit = async (data) => {
        try {
            const parsedSkills = data.requiredSkills
                ? data.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
                : [];

            const updateData = {
                ...data,
                requiredSkills: parsedSkills,
                assigneeId: data.assigneeId === "null" ? null : data.assigneeId,
                storyPoints: Number(data.storyPoints) || 0,
                startDate: toUtcIsoString(data.startDate, project?.timezone),
                dueDate: toUtcIsoString(data.dueDate, project?.timezone)
            };
            const res = await updateIssueApi(issue._id, updateData);
            if (res.EC === 0) {
                toast.success(res.EM || "Issue updated!");
                onDataUpdate();
            } else {
                toast.error(res.EM);
                resetFormToOriginal();
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        }
    };

    // Auto-save wrapper behavior (tránh phải bấm Save)
    const handleFieldChange = (field, val) => {
        setValue(field, val, { shouldValidate: true });

        // Tự động tính toán timeExpect trên giao diện nếu một trong các trường ảnh hưởng thay đổi
        if (field === 'storyPoints' || field === 'startDate' || field === 'dueDate') {
            const formValues = getValues();
            const currentStoryPoints = field === 'storyPoints' ? val : formValues.storyPoints;
            const currentStartDate = field === 'startDate' ? val : formValues.startDate;
            const currentDueDate = field === 'dueDate' ? val : formValues.dueDate;

            if (currentStoryPoints && currentStartDate && currentDueDate) {
                const sDate = new Date(currentStartDate);
                const dDate = new Date(currentDueDate);
                if (dDate > sDate) {
                    const calculatedTime = (Number(currentStoryPoints) || 0) * 4;
                    setValue('timeExpect', parseFloat(calculatedTime.toFixed(1)), { shouldValidate: true });
                } else {
                    setValue('timeExpect', 0, { shouldValidate: true });
                }
            } else {
                setValue('timeExpect', 0, { shouldValidate: true });
            }
        }

        // Gọi Submit "tay" tại đây nếu muốn lưu tự động luôn. Tạm thời dùng onBlur ở thẻ Form
        handleSubmit(onSubmit)();
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

    const handleCreateSubtask = async () => {
        if (!newSubtaskTitle.trim()) return;
        try {
            const subtaskData = { parentId: issue._id, title: newSubtaskTitle };
            const res = await createSubtaskApi(subtaskData);
            if (res.EC === 0) {
                toast.success(res.EM || "Subtask created!");
                setNewSubtaskTitle('');
                fetchSubtasks();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        }
    };

    const handleDeleteSubtask = async (sub) => {
        try {
            const res = await deleteIssueApi(sub._id);
            if (res.EC === 0) {
                toast.success("Subtask deleted");
                fetchSubtasks();
            }
        } catch (e) { toast.error("Error deleting"); }
    };

    const handleSuggestAssignees = async () => {
        if (!issue?._id) return;
        setIsSuggesting(true);
        try {
            const res = await suggestAssigneesByAiApi(issue._id);
            if (res.EC === 0 && res.data) {
                setAiSuggestions(res.data);
                setShowAiModal(true);
            } else {
                toast.error(res.EM || "Could not generate suggestions");
            }
        } catch (error) {
            toast.error("Failed to connect to AI Service.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleApplySuggestion = (accountId) => {
        setValue('assigneeId', accountId, { shouldValidate: true });
        setShowAiModal(false);

        handleSubmit(onSubmit)();
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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const res = await uploadAttachmentApi(issue._id, formData);
            if (res && res.EC === 0) {
                setAttachments(res.data); // data nhận về là mảng attachments mới
                toast.success(res.EM || "File uploaded successfully");
                if (onDataUpdate) onDataUpdate();
            } else {
                toast.error(res?.EM || "Upload failed");
            }
        } catch (error) {
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteAttachment = async (attachmentId) => {
        try {
            setIsUploading(true);
            const res = await deleteAttachmentApi(issue._id, attachmentId);
            if (res && res.EC === 0) {
                setAttachments(res.data);
                toast.success(res.EM || "File deleted successfully");
                if (onDataUpdate) onDataUpdate();
            } else {
                toast.error(res?.EM || "Deletion failed");
            }
        } catch (error) {
            toast.error("An error occurred during deletion");
        } finally {
            setIsUploading(false);
        }
    };

    const subtasksDone = subtasks.filter(s => s.status && s.status.toLowerCase() === 'done').length;
    const progress = subtasks.length > 0 ? (subtasksDone / subtasks.length) * 100 : 0;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 md:p-6"
                onClick={onClose}
            >
                {/* Modal Container: Lớn để chứa thiết kế 2 cột */}
                <motion.div
                    initial={{ scale: 0.95, y: 10, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.95, y: 10, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl flex flex-col w-full max-w-6xl max-h-[90vh] border border-slate-200 dark:border-slate-800"
                >
                    {/* Header: Key & Actions */}
                    <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs dark:bg-blue-900 dark:text-blue-300">
                                    Issue
                                </span>
                                {issue.issueKey}
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
                            <div className="w-px h-6 bg-slate-300 dark:bg-slate-700 mx-1"></div>
                            <button onClick={onClose} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
                        </div>
                    </div>

                    {/* Main Layout: 2 Cột */}
                    <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                        {/* LEFT COLUMN: Main Content */}
                        <div className="flex-1 overflow-y-auto px-8 py-6 border-r border-slate-200 dark:border-slate-700 custom-scrollbar">
                            <form onBlur={handleSubmit(onSubmit)}>
                                <input
                                    {...register("title")}
                                    className="text-3xl font-extrabold bg-transparent w-full focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-900/20 rounded-md py-1 px-2 -ml-2 text-slate-900 dark:text-slate-100 transition-all duration-200 mb-4"
                                />

                                <div className="mt-4">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Description</h3>
                                    <textarea
                                        {...register("description")}
                                        rows="5"
                                        placeholder="Add a description..."
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-200 resize-y"
                                    />
                                </div>

                                <div className="mt-4">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-2">Required Skills</h3>
                                    <input
                                        {...register("requiredSkills")}
                                        placeholder="e.g. React, Nodejs, Design (comma separated)"
                                        className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:bg-white dark:focus:bg-slate-900 rounded-lg border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100 placeholder-slate-500 transition-all duration-200"
                                    />
                                </div>
                            </form>

                            <div className="mt-6 mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                        Attachments
                                        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">{attachments.length}</span>
                                    </h3>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Paperclip className="w-4 h-4" />}
                                        Add File
                                    </button>
                                </div>
                                {attachments.length > 0 ? (
                                    <div className="grid grid-cols-1 gap-3 mt-3">
                                        {attachments.map(att => (
                                            <div key={att._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group transition-colors">
                                                <a href={att.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 overflow-hidden flex-1 cursor-pointer">
                                                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-md shrink-0">
                                                        <FileText className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{att.filename}</p>
                                                        <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                                                            <span className="font-medium text-slate-600 dark:text-slate-400">
                                                                {att.uploadedBy?.fullName || "User"}
                                                            </span>
                                                            <span>•</span>
                                                            <span>{new Date(att.uploadedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </div>
                                                </a>
                                                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {/* Nút download file (Cloudinary tự mở tab mới hoặc trình duyệt tải) */}
                                                    <a
                                                        href={att.url}
                                                        download
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 rounded-md transition-colors"
                                                        title="Download file"
                                                    >
                                                        <Download className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteAttachment(att._id)}
                                                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/40 rounded-md transition-colors cursor-pointer"
                                                        title="Delete file"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-lg p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-800/30"
                                    >
                                        <Paperclip className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                                        <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{isUploading ? 'Uploading...' : 'Click to upload a file'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Subtasks */}
                            {!issue.parentId && (
                                <div className="mt-10">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                            Subtasks
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-full text-xs">{subtasks.length}</span>
                                        </h3>
                                        <button onClick={() => subtaskInputRef.current?.focus()} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer">
                                            <Plus className="w-4 h-4" /> Add Subtask
                                        </button>
                                    </div>

                                    {/* Progress Bar */}
                                    {subtasks.length > 0 && (
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">{Math.round(progress)}% Done</span>
                                        </div>
                                    )}

                                    <div className="border border-slate-200 dark:border-slate-700 rounded-lg">
                                        <div className="grid grid-cols-[minmax(200px,1fr)_160px_160px_40px] items-center gap-4 px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 rounded-t-md">
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500">Work</span>
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex justify-center">Assignee</span>
                                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 flex justify-center">Status</span>
                                            <span></span>
                                        </div>
                                        {loadingSubtasks ? (
                                            <div className="flex justify-center py-6"><Spinner /></div>
                                        ) : subtasks.length === 0 ? (
                                            <div className="p-6 text-center text-slate-500 text-sm">No subtasks found</div>
                                        ) : (
                                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {subtasks.map(sub => (
                                                    <SubtaskRow
                                                        key={sub._id}
                                                        subtask={sub}
                                                        onClick={() => setSelectedSubtask(sub)}
                                                        projectMembers={projectMembers}
                                                        boardColumns={project.boardColumns}
                                                        onUpdate={fetchSubtasks}
                                                        onDelete={() => handleDeleteSubtask(sub)}
                                                        gridClass="grid-cols-[minmax(200px,1fr)_160px_160px_40px] px-4 gap-4"
                                                    />
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

                            {/* Activity Section */}
                            <div className="mt-10">
                                <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-4">Activity</h3>
                                <div className="flex items-center border-b border-slate-200 dark:border-slate-700">
                                    <button
                                        onClick={() => setActiveActivityTab('comments')}
                                        className={cn(
                                            "px-4 py-2.5 text-sm font-semibold cursor-pointer relative",
                                            activeActivityTab === 'comments'
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        )}
                                    >
                                        Comments
                                        {activeActivityTab === 'comments' && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveActivityTab('history')}
                                        className={cn(
                                            "px-4 py-2.5 text-sm font-semibold cursor-pointer relative",
                                            activeActivityTab === 'history'
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                                        )}
                                    >
                                        History
                                        {activeActivityTab === 'history' && (
                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                                        )}
                                    </button>
                                </div>

                                <div className="mt-6">
                                    {activeActivityTab === 'comments' && <CommentSection issueId={issue?._id} />}
                                    {activeActivityTab === 'history' && <HistorySection issueId={issue?._id} />}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Details */}
                        <div className="w-full md:w-[320px] bg-slate-50/50 dark:bg-slate-900 overflow-y-auto custom-scrollbar px-6 py-6">

                            {/* Status */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Status</label>
                                <SelectDropdown
                                    value={statusValue}
                                    options={statusOptions}
                                    onChange={(val) => handleFieldChange("status", val)}
                                    placeholder="Select Status"
                                />
                            </div>

                            <div className="border-t border-slate-200 dark:border-slate-700 mb-6"></div>

                            {/* Details Accordion */}
                            <div className="space-y-5">
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Details</h3>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <User className="w-3.5 h-3.5" /> Assignee
                                    </label>
                                    <SelectDropdown
                                        value={assigneeValue || 'null'}
                                        options={assigneeOptions}
                                        onChange={(val) => handleFieldChange("assigneeId", val)}
                                        placeholder="Select Assignee"
                                    />
                                    <AiSuggestButton
                                        onClick={handleSuggestAssignees}
                                        isSuggesting={isSuggesting}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Star className="w-3.5 h-3.5" /> Priority
                                    </label>
                                    <SelectDropdown
                                        value={priorityValue}
                                        options={prioritySelectOptions}
                                        onChange={(val) => handleFieldChange("priority", val)}
                                        placeholder="Select Priority"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <ChevronsRight className="w-3.5 h-3.5" /> Story Points
                                    </label>
                                    <input
                                        type="number"
                                        {...register("storyPoints")}
                                        onBlur={(e) => handleFieldChange("storyPoints", e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Clock className="w-3.5 h-3.5 text-orange-500" /> Time Expect (hours)
                                    </label>
                                    <input
                                        type="text"
                                        {...register("timeExpect")}
                                        readOnly
                                        className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-500 shadow-inner cursor-not-allowed"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1 italic">
                                        Calculated by system: StoryPoints × 4
                                    </p>
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Start Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register("startDate")}
                                        onBlur={(e) => handleFieldChange("startDate", e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-semibold text-slate-500 flex items-center gap-2 mb-1.5">
                                        <Calendar className="w-3.5 h-3.5" /> Due Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        {...register("dueDate")}
                                        onBlur={(e) => handleFieldChange("dueDate", e.target.value)}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:light] dark:[color-scheme:dark]"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
                {selectedSubtask && (
                    <IssueDetailModal
                        project={project}
                        issue={selectedSubtask}
                        isSubtaskMode={true}
                        onClose={() => setSelectedSubtask(null)}
                        onDataUpdate={() => {
                            onDataUpdate();
                            fetchSubtasks();
                        }}
                    />
                )}
                <DeleteIssueModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleConfirmDelete}
                    loading={false}
                    issue={issue}
                />
                <AiSuggestModal
                    isOpen={showAiModal}
                    onClose={() => setShowAiModal(false)}
                    suggestions={aiSuggestions}
                    onApply={handleApplySuggestion}
                />
            </motion.div>
        </AnimatePresence>
    );
};

export default IssueDetailModal;