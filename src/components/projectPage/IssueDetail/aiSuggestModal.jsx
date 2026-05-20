import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, ArrowRight } from 'lucide-react';

const AiSuggestModal = ({ isOpen, onClose, suggestions, onApply }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                    >
                        {/* Header */}
                        <div className="relative overflow-hidden px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40">
                            {/* Decorative background elements */}
                            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl animate-pulse" />
                            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />

                            <div className="relative flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/60 rounded-lg">
                                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                            AI Assignee Match
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                                            Based on skills and current workload
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-lg transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Body list suggestions */}
                        <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50 dark:bg-slate-900">
                            {suggestions.length === 0 ? (
                                <div className="text-center py-10">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                        <Sparkles className="w-8 h-8 text-slate-400" />
                                    </div>
                                    <h4 className="text-slate-700 dark:text-slate-300 font-medium">No suitable matches found</h4>
                                    <p className="text-slate-500 text-sm mt-1">Try updating the required skills or check member availability.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {suggestions.map((candidate, idx) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            key={candidate.accountId || idx}
                                            className="group relative bg-white dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Rank Badge */}
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                            <div className="flex flex-col sm:flex-row gap-4 p-5">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0 border border-indigo-200 dark:border-indigo-800">
                                                            {candidate.fullName.charAt(0).toUpperCase()}
                                                        </div>
                                                        <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                                                            {candidate.fullName}
                                                        </h4>
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${candidate.matchScore >= 80 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 dark:border-emerald-800/50 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                            : candidate.matchScore >= 50 ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:border-amber-800/50 dark:bg-amber-900/30 dark:text-amber-400'
                                                                : 'bg-rose-100 text-rose-700 border border-rose-200 dark:border-rose-800/50 dark:bg-rose-900/30 dark:text-rose-400'
                                                            }`}>
                                                            {candidate.matchScore}% Match
                                                        </span>
                                                        {idx === 0 && (
                                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-800/50 uppercase tracking-wider shrink-0">Best Fit</span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-11">
                                                        {candidate.reason}
                                                    </p>
                                                </div>

                                                <div className="flex items-center sm:border-l border-slate-100 dark:border-slate-700 sm:pl-5 sm:ml-2 pt-4 sm:pt-0 border-t sm:border-t-0 mt-4 sm:mt-0">
                                                    <button
                                                        onClick={() => onApply(candidate.accountId)}
                                                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-600 text-indigo-700 dark:text-indigo-300 hover:text-white dark:hover:text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 group/btn border border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-lg hover:shadow-indigo-500/20 cursor-pointer"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                        <span>Assign</span>
                                                        <ArrowRight className="w-4 h-4 opacity-0 -ml-4 group-hover/btn:opacity-100 group-hover/btn:ml-0 transition-all" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AiSuggestModal;