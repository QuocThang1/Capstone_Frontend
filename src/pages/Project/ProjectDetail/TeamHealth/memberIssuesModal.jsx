import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Target, CheckCircle2 } from "lucide-react";

const MemberIssuesModal = ({ selectedMember, selectedMemberIssues, onClose }) => {
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
                        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col w-full max-w-2xl max-h-[85vh] border border-slate-200 dark:border-slate-800"
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
                                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500 cursor-pointer"
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
                                        className="p-4 border border-slate-200 dark:border-slate-700/60 rounded-xl hover:shadow-md hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-200"
                                    >
                                        <div className="flex items-start justify-between gap-4 mb-2.5">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-2.5 py-1 text-xs font-bold tracking-tight bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-md">
                                                    {issue.issueKey}
                                                </span>
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm break-words line-clamp-2 leading-tight">
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

                                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                                            <div className="flex items-center gap-1.5" title="Story Points">
                                                <Target className="w-3.5 h-3.5 text-rose-500" />
                                                <span>{issue.storyPoints || 0} pts</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Start Date">
                                                <Calendar className="w-3.5 h-3.5 text-sky-500" />
                                                <span>{issue.startDate ? new Date(issue.startDate).toLocaleDateString('vi-VN') : 'No start date'}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5" title="Due Date">
                                                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                                <span>{issue.dueDate ? new Date(issue.dueDate).toLocaleDateString('vi-VN') : 'No due date'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MemberIssuesModal;