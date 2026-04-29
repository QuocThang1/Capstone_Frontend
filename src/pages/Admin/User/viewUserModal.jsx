const ViewUserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="glass-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 transition-all duration-300">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between transition-colors duration-300">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">User Details</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all duration-200 cursor-pointer"
                    >
                        <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-indigo-500/20">
                                {user.fullName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-900 dark:text-slate-50">{user.fullName}</h4>
                                <p className="text-slate-600 dark:text-slate-400">@{user.username}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                                <p className="text-slate-900 dark:text-slate-100">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Phone</label>
                                <p className="text-slate-900 dark:text-slate-100">{user.phone || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                                <p className="text-slate-900 dark:text-slate-100">
                                    {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                                <p className="text-slate-900 dark:text-slate-100 capitalize">{user.gender || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
                                <p className="text-slate-900 dark:text-slate-100 capitalize">{user.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                                <p className={`font-semibold ${user.active ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                    {user.active ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Created At</label>
                                <p className="text-slate-900 dark:text-slate-100">{new Date(user.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Updated At</label>
                                <p className="text-slate-900 dark:text-slate-100">{new Date(user.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;