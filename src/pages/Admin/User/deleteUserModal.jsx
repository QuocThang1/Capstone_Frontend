const DeleteUserModal = ({ user, onConfirm, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="glass-card rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-700 p-8 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Delete User</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">This action cannot be undone</p>
                    </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed transition-colors duration-300">
                    Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-50">{user.fullName}</span>? All associated data will be permanently removed.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-rose-600 dark:bg-rose-500/40 text-white dark:text-rose-100 py-3 rounded-lg font-semibold hover:bg-rose-700 dark:hover:bg-rose-500/60 hover:shadow-lg hover:shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-slate-100 py-3 rounded-lg font-semibold hover:bg-slate-400 dark:hover:bg-slate-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;