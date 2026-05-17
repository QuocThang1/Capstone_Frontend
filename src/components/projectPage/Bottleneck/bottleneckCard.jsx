import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Clock, Check, X, ShieldCheck, MailPlus, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// Đơn giản hóa các màu chữ, bỏ viền và nền lòe loẹt
const getRiskColor = (level) => {
    switch (level) {
        case "Highest":
        case "High": return "text-rose-600 dark:text-rose-400";
        case "Medium": return "text-amber-600 dark:text-amber-400";
        case "Low":
        case "Lowest": return "text-indigo-600 dark:text-indigo-400";
        default: return "text-slate-600 dark:text-slate-400";
    }
};

const getStatusColor = (status) => {
    if (status === 'resolved') return 'text-emerald-600 dark:text-emerald-400';
    if (status === 'pending') return 'text-amber-600 dark:text-amber-400';
    return 'text-slate-600 dark:text-slate-400';
};

const getImpactIcon = (level) => {
    switch (level) {
        case "Highest":
        case "High": return <AlertTriangle className="w-5 h-5 text-rose-500" />;
        case "Medium": return <AlertCircle className="w-5 h-5 text-amber-500" />;
        default: return <Info className="w-5 h-5 text-indigo-500" />;
    }
};

const getStatusIcon = (status) => {
    if (status === 'resolved') return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    if (status === 'pending') return <Clock className="w-4 h-4 text-amber-500" />;
    return <AlertCircle className="w-4 h-4 text-slate-400" />;
};

const BottleneckCard = ({ bn, expanded, onToggle, onRequestResolve, onApproveResolve }) => {
    const isExpanded = expanded === bn._id;

    return (
        <motion.div
            variants={itemVariants}
            layout
            className={`group relative bg-white dark:bg-slate-900 border rounded-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'border-slate-300 dark:border-slate-600 shadow-md' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
        >
            <div onClick={() => onToggle(isExpanded ? null : bn._id)} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-0.5">
                        {getImpactIcon(bn.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-base truncate transition-colors ${isExpanded ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                {bn.name}
                            </h3>
                            {bn.issueId && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wider">
                                    {bn.issueId.issueKey}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                Created {formatDistanceToNow(new Date(bn.createdAt))} ago
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span className="flex items-center gap-1.5 truncate">
                                Assignee: <span className="font-medium text-slate-700 dark:text-slate-300">{bn.issueId?.assigneeId?.fullName || "Unassigned"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center sm:items-end sm:flex-col gap-3 sm:gap-1.5 sm:ml-auto shrink-0 mt-2 sm:mt-0">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Risk:</span>
                        <span className={`font-semibold ${getRiskColor(bn.level)}`}>{bn.level}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                        <div className="flex items-center gap-1.5">
                            {getStatusIcon(bn.status)}
                            <span className={`font-semibold capitalize ${getStatusColor(bn.status)}`}>
                                {bn.status || "unresolved"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="p-4 sm:p-5 pt-0 mt-2">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Issue Details</h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-md p-3.5">{bn.content}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-slate-100 dark:border-slate-800 gap-4 mt-2">
                                    <div className="flex flex-col gap-1.5 text-sm">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                            <span className="font-medium">Current Status:</span>
                                            <span className={`font-semibold capitalize ${getStatusColor(bn.status)}`}>
                                                {bn.status || "unresolved"}
                                            </span>
                                        </div>

                                        {/* Phần hiển thị người Resolve */}
                                        {bn.resolvedBy && (
                                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                <User className="w-4 h-4 text-indigo-500" />
                                                <span className="font-medium">{bn.status === 'resolved' ? 'Resolved by:' : 'Requested by:'}</span>
                                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {bn.resolvedBy.fullName || bn.resolvedBy.username || "A Member"}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                        {bn.status === "unresolved" && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onRequestResolve(bn._id); }}
                                                className="cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-1.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-sm transition-colors"
                                            >
                                                <MailPlus className="w-4 h-4" /> Request Resolve
                                            </button>
                                        )}

                                        {bn.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onApproveResolve(bn._id, true); }}
                                                    className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded shadow-sm transition-colors"
                                                >
                                                    <Check className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onApproveResolve(bn._id, false); }}
                                                    className="cursor-pointer flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50 border border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700 rounded shadow-sm transition-colors"
                                                >
                                                    <X className="w-4 h-4 text-rose-500" /> Reject
                                                </button>
                                            </>
                                        )}

                                        {bn.status === "resolved" && (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 text-emerald-600 dark:text-emerald-400">
                                                <ShieldCheck className="w-5 h-5" />
                                                <span className="text-sm font-semibold">Resolution Cleared</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default BottleneckCard;