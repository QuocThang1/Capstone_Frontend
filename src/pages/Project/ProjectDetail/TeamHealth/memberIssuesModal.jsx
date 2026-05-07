import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Target, CheckCircle2, LayoutList, User } from "lucide-react";
import { getSubtaskApi } from "../../../../utils/Api/issueApi";
import { s } from "framer-motion/client";
import Spinner from "../../../../components/spinner";

const MemberIssuesModal = ({ selectedMember, selectedMemberIssues, onClose }) => {
    // State quản lý việc hiển thị modal subtask
    const [selectedIssueForSubtasks, setSelectedIssueForSubtasks] = useState(null);
    const [subtasks, setSubtasks] = useState([]);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false);

    // Xử lý khi click vào issue
    const handleIssueClick = async (issue) => {
        setSelectedIssueForSubtasks(issue);
        setLoadingSubtasks(true);
        try {
            const res = await getSubtaskApi(issue._id);
            if (res && res.EC === 0) {
                setSubtasks(res.data);
            } else {
                setSubtasks([]);
            }
        } catch (error) {
            console.error("Lỗi tải subtask:", error);
            setSubtasks([]);
        } finally {
            setLoadingSubtasks(false);
        }
    };

    const closeSubtaskModal = () => {
        setSelectedIssueForSubtasks(null);
        setSubtasks([]);
    };

    if (loadingSubtasks) return <div className="flex items-center justify-center h-[calc(100vh-8rem)]"><Spinner /></div>;

    return (
        <AnimatePresence>
            {selectedMember && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col w-full max-w-2xl max-h-[85vh] border border-slate-200 dark:border-slate-800 relative"
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full ${selectedMember.color} text-white font-bold flex items-center justify-center shadow-sm`}>
                                    {selectedMember.initials}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight">
                                        {selectedMember.name}&apos;s Issues
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Total: {selectedMemberIssues.length} assigned issues
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 cursor-pointer z-10"
                            >
                                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                            </button>
                        </div>

                        {/* Modal Body / Danh sách Issue */}
                        <div className="px-6 py-4 overflow-y-auto custom-scrollbar flex-1 space-y-3">
                            {selectedMemberIssues.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                                    <CheckCircle2 className="w-12 h-12 mb-3 text-emerald-400/50" />
                                    <p>No issues assigned to this member.</p>
                                </div>
                            ) : (
                                selectedMemberIssues.map(issue => (
                                    <div
                                        key={issue._id}
                                        onClick={() => handleIssueClick(issue)}
                                        className="p-4 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200 cursor-pointer group"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-2.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-2.5 py-1 text-xs font-bold tracking-tight bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-md">
                                                    {issue.issueKey}
                                                </span>
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm break-words line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                    {issue.title}
                                                </h3>
                                            </div>
                                            <span
                                                className={`px-2.5 py-1 text-[11px] font-semibold tracking-wide rounded-full whitespace-nowrap truncate shadow-sm shrink-0 
                                                    ${issue.status === 'Done'
                                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                                    }`}
                                            >
                                                {issue.status}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                                            <div className="flex items-center gap-1.5" title="Story Points">
                                                <Target className="w-3.5 h-3.5 text-rose-500" />
                                                <span>{issue.storyPoints || 0} pts</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Start Date">
                                                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                                                <span>Start Date: {issue.startDate ? new Date(issue.startDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No start date'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Due Date">
                                                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                                <span>Due Date: {issue.dueDate ? new Date(issue.dueDate).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'No due date'}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                                            <div className="flex items-center gap-1.5" title="Complete At">
                                                <Calendar className="w-3.5 h-3.5 text-green-500" />
                                                <span>Completed At: {issue.completedAt ? new Date(issue.completedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not completed yet'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Nested Modal: Subtasks */}
                        <AnimatePresence>
                            {selectedIssueForSubtasks && (
                                <motion.div
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: '100%', opacity: 0 }}
                                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                    className="absolute inset-0 bg-white dark:bg-slate-900 rounded-2xl flex flex-col z-20 overflow-hidden shadow-2xl"
                                >
                                    <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                                <LayoutList className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                                    {selectedIssueForSubtasks.issueKey} Subtasks
                                                </h3>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    {selectedIssueForSubtasks.title}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeSubtaskModal}
                                            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 cursor-pointer"
                                        >
                                            <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                                        </button>
                                    </div>

                                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                                        {loadingSubtasks ? (
                                            <div className="flex justify-center py-10">
                                                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></span>
                                            </div>
                                        ) : subtasks.length === 0 ? (
                                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                                <p>No subtasks found for this issue.</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {subtasks.map(sub => (
                                                    <div key={sub._id} className="p-4 border border-slate-200 dark:border-slate-700/60 rounded-xl bg-white dark:bg-slate-900 hover:shadow-sm transition-all duration-200">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex items-center gap-2">
                                                                <span className="px-2 py-0.5 text-[10px] font-bold tracking-tight bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded">
                                                                    {sub.issueKey}
                                                                </span>
                                                                <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">
                                                                    {sub.title}
                                                                </h4>
                                                            </div>
                                                            <span className="px-2.5 py-1 text-[10px] font-bold tracking-wide rounded-full whitespace-nowrap bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 uppercase">
                                                                {sub.status}
                                                            </span>
                                                        </div>
                                                        <div className="mt-3 flex items-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                                            <div className="flex items-center gap-1.5" title="Story Points">
                                                                <Target className="w-3.5 h-3.5 text-rose-500" />
                                                                <span>{sub.storyPoints || 0} pts</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5" title="Assignee">
                                                                <User className="w-3.5 h-3.5 text-blue-500" />
                                                                <span>Assignee: {sub.assigneeId?.fullName || "Unassigned"}</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-2">
                                                            <div className="flex items-center gap-1.5" title="Complete At">
                                                                <Calendar className="w-3.5 h-3.5 text-green-500" />
                                                                <span>Completed At: {sub.completedAt ? new Date(sub.completedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not completed yet'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MemberIssuesModal;