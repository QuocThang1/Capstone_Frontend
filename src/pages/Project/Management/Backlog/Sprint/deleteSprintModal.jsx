import ButtonSpinner from '../../../../../components/ButtonSpinner';
import { X, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const DeleteSprintModal = ({ isOpen, onClose, onConfirm, loading, sprint }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="glass-card rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl transition-colors duration-300">
                    <h2 className="text-xl font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        Delete Sprint
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                        <X className="w-6 h-6 text-slate-600 dark:text-slate-400 transition-colors duration-200" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300 transition-colors duration-300">
                        Are you sure you want to delete the sprint "<strong>{sprint.name}</strong>"?
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300">
                        This action cannot be undone. Any issues in this sprint will be moved to the Backlog.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-4 px-6 py-4 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl transition-colors duration-300">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(sprint._id)}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-rose-600 dark:bg-rose-500/40 rounded-md hover:bg-rose-700 dark:hover:bg-rose-500/60 hover:shadow-lg hover:shadow-rose-500/20 disabled:bg-rose-400 dark:disabled:bg-rose-500/20 flex items-center justify-center cursor-pointer w-28 transition-all duration-200"
                    >
                        {loading ? <ButtonSpinner text="Deleting..." /> : 'Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeleteSprintModal;