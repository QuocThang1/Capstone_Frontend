import ButtonSpinner from '../../../../../components/ButtonSpinner';
import { X, AlertTriangle } from 'lucide-react';

const DeleteIssueModal = ({ isOpen, onClose, onConfirm, loading, issue }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border-2 border-slate-300 dark:border-slate-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-red-600 dark:text-red-500 flex items-center gap-2">
                        <AlertTriangle className="w-6 h-6" />
                        Delete Issue
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        Are you sure you want to delete the issue "<strong>{issue?.issueKey} - {issue?.title}</strong>"?
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        This action cannot be undone. If this is a parent task, all its sub-tasks will also be deleted.
                    </p>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={() => onConfirm(issue._id)}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400 flex items-center justify-center cursor-pointer w-28"
                    >
                        {loading ? <ButtonSpinner text="Deleting..." /> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteIssueModal;