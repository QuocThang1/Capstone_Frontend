const DeleteUserModal = ({ user, onConfirm, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#101A17]">Delete User</h3>
                        <p className="text-sm text-gray-600">This action cannot be undone</p>
                    </div>
                </div>

                <p className="text-gray-700 mb-6">
                    Are you sure you want to delete <span className="font-semibold">{user.fullName}</span>? All associated data will be permanently removed.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 text-white py-3 rounded-lg font-bold hover:bg-red-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        Delete
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteUserModal;