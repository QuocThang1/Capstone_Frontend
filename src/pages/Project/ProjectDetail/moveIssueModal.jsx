import { useState } from 'react';
import { X, AlertTriangle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MoveIssuesModal = ({ isOpen, onClose, columnToDelete, otherColumns, onConfirm }) => {
    const [targetColumnName, setTargetColumnName] = useState(otherColumns[0]?.name || '');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (!targetColumnName) {
            return;
        }
        onConfirm(columnToDelete.name, targetColumnName);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[60] flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                    Move work from "{columnToDelete?.name}"
                                </h2>
                            </div>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                                Select a new home for any work with the <strong>{columnToDelete?.name}</strong> status.
                            </p>

                            <div className="flex items-center justify-around bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg">
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 mb-1">This status will be deleted:</p>
                                    <span className="px-2 py-1 text-sm font-medium bg-slate-200 dark:bg-slate-700 rounded-md">{columnToDelete?.name}</span>
                                </div>
                                <ArrowRight className="w-6 h-6 text-slate-400" />
                                <div className="text-center">
                                    <p className="text-xs text-slate-500 mb-1">Move existing work items to:</p>
                                    <select
                                        value={targetColumnName}
                                        onChange={(e) => setTargetColumnName(e.target.value)}
                                        className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                                    >
                                        {otherColumns.map(col => (
                                            <option key={col.id} value={col.name}>{col.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MoveIssuesModal;
