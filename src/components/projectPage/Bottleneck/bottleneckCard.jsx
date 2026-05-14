import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const getImpactClasses = (level) => {
    switch (level) {
        case "Highest":
        case "High": return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800";
        case "Medium": return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800";
        case "Low":
        case "Lowest": return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
        default: return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800";
    }
};

const getImpactIcon = (level) => {
    switch (level) {
        case "Highest":
        case "High": return <AlertTriangle className="w-4 h-4" />;
        case "Medium": return <AlertCircle className="w-4 h-4" />;
        default: return <Info className="w-4 h-4" />;
    }
};

const BottleneckCard = ({ bn, expanded, onToggle }) => {
    const isExpanded = expanded === bn._id;

    return (
        <motion.div
            variants={itemVariants}
            layout
            className={`group relative bg-white dark:bg-slate-900 border rounded-xl overflow-hidden transition-all duration-300 ${isExpanded ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'}`}
        >
            <div onClick={() => onToggle(isExpanded ? null : bn._id)} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 cursor-pointer">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`mt-0.5 p-2 rounded-lg ${getImpactClasses(bn.level)}`}>
                        {getImpactIcon(bn.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-base truncate transition-colors ${isExpanded ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-white'}`}>
                                {bn.name}
                            </h3>
                            {bn.issueId && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 uppercase tracking-wider">
                                    {bn.issueId.issueKey}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Created {formatDistanceToNow(new Date(bn.createdAt))} ago</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span className="flex items-center gap-1.5 truncate">
                                Assignee: <span className="font-medium text-slate-700 dark:text-slate-300">{bn.issueId?.assigneeId?.fullName || "Unassigned"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 sm:ml-auto">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getImpactClasses(bn.level)}`}>
                        {bn.level} Risk
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${bn.isResolved ? 'bg-emerald-500/10 text-emerald-600 border-emerald-200' : 'bg-rose-500/10 text-rose-600 border-rose-200'}`}>
                        {bn.isResolved ? "Resolved" : "Active"}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="p-4 sm:p-5 pt-0 mt-2 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/10">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-lg p-3 shadow-sm">{bn.content}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Issue Title</h4>
                                    <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800/40 rounded-lg p-3">
                                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-200">{bn.issueId?.title}</p>
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