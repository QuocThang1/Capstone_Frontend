const ViewUserModal = ({ user, onClose }) => {
    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-[#101A17]">User Details</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 pb-4 border-b">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#4ADE80] to-[#22D3EE] rounded-full flex items-center justify-center font-bold text-2xl text-[#101A17]">
                                {user.fullName?.charAt(0).toUpperCase() || "U"}
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-[#101A17]">{user.fullName}</h4>
                                <p className="text-gray-500">@{user.username}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Email</label>
                                <p className="text-gray-900">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Phone</label>
                                <p className="text-gray-900">{user.phone || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Date of Birth</label>
                                <p className="text-gray-900">
                                    {user.dob ? new Date(user.dob).toLocaleDateString() : "N/A"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Gender</label>
                                <p className="text-gray-900 capitalize">{user.gender || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Role</label>
                                <p className="text-gray-900 capitalize">{user.role}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Status</label>
                                <p className={`font-semibold ${user.active ? "text-green-600" : "text-red-600"}`}>
                                    {user.active ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Created At</label>
                                <p className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-600">Updated At</label>
                                <p className="text-gray-900">{new Date(user.updatedAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewUserModal;