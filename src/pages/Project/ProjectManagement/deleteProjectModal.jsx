import ButtonSpinner from "../../../components/ButtonSpinner";
import { X } from "lucide-react";

const DeleteProjectModal = ({ isOpen, onClose, onConfirm, loading, projectName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border-2 border-slate-300 dark:border-slate-700">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                        Delete Project
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    >
                        <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                        <svg className="h-6 w-6 text-red-600 dark:text-red-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                        <p>Are you sure you want to delete the project?</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 mt-1">"{projectName}"</p>
                        <p className="mt-2">This action cannot be undone.</p>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 dark:focus:ring-offset-slate-800 transition-colors cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-slate-800 disabled:bg-red-400 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-colors cursor-pointer"
                    >
                        {loading ? <ButtonSpinner /> : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;