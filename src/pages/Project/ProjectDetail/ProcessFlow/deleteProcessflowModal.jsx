import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import ButtonSpinner from '../../../../components/ButtonSpinner';

const DeleteProcessflowModal = ({ isOpen, onClose, onConfirm, loading, workflow }) => {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-rose-600 dark:text-rose-500">Delete Workflow</h2>
                    <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete the workflow <strong className="text-slate-900 dark:text-white">{workflow?.name}</strong>?
                    </p>
                    <p className="mt-2 text-sm text-rose-600 dark:text-rose-500">This action cannot be undone.</p>
                </div>

                <div className="flex justify-end gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-all cursor-pointer">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-md hover:bg-rose-700 disabled:bg-rose-400 flex items-center justify-center w-28 cursor-pointer">
                        {loading ? <ButtonSpinner /> : 'Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DeleteProcessflowModal;