import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    getAllUsersApi,
    createUserApi,
    updateUserApi,
    toggleUserStatusApi,
    deleteUserApi,
} from "../../../utils/Api/userApi";
import Spinner from "../../../components/spinner";
import StatCard from "../../../components/StatCard";
import ViewUserModal from "./viewUserModal";
import CreateEditUserModal from "./createEditUserModal";
import DeleteUserModal from "./deleteUserModal";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("create"); // "create" | "edit" | "view"
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // Pagination & Filters
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        search: "",
        role: "",
        gender: "",
        active: "",
    });

    const [statsData, setStatsData] = useState({
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0
    });

    const stats = [
        {
            title: "Total Users",
            value: statsData.total,
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
            iconColor: "text-indigo-600 dark:text-indigo-400",
            borderColor: "border-indigo-500"
        },
        {
            title: "Active Users",
            value: statsData.active,
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
            iconColor: "text-emerald-600 dark:text-emerald-400",
            borderColor: "border-emerald-500"
        },
        {
            title: "Inactive Users",
            value: statsData.inactive,
            icon: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636",
            iconColor: "text-rose-600 dark:text-rose-400",
            borderColor: "border-rose-500"
        },
        {
            title: "Administrators",
            value: statsData.admins,
            icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
            iconColor: "text-amber-600 dark:text-amber-400",
            borderColor: "border-amber-500"
        }
    ];

    useEffect(() => {
        fetchStatsData();
    }, []);

    // Fetch users
    useEffect(() => {
        fetchUsers();
    }, [currentPage, filters]);

    const fetchStatsData = async () => {
        try {
            const res = await getAllUsersApi({
                page: 1,
                limit: 999999, // Lấy tất cả
                // Không truyền filters
            });

            if (res.EC === 0) {
                const allUsers = res.data.users;
                setStatsData({
                    total: res.data.total,
                    active: allUsers.filter(u => u.active).length,
                    inactive: allUsers.filter(u => !u.active).length,
                    admins: allUsers.filter(u => u.role === "admin").length
                });
            }
        } catch (error) {
            console.error("Fetch stats error:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            setFetchLoading(true);
            const params = {
                page: currentPage,
                limit: 5,
                ...filters,
            };

            const res = await getAllUsersApi(params);

            if (res.EC === 0) {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
            } else {
                toast.error(res.EM || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Fetch users error:", error);
            toast.error(error?.response?.data?.EM || "Failed to load users");
        } finally {
            setFetchLoading(false);
        }
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    // Open modal for create
    const handleCreateUser = () => {
        setModalMode("create");
        setSelectedUser(null);
        setShowModal(true);
    };

    // Open modal for edit
    const handleEditUser = (user) => {
        setModalMode("edit");
        const formattedDob = user.dob ? new Date(user.dob).toISOString().split("T")[0] : "";
        setSelectedUser({
            ...user,
            dob: formattedDob,
            password: "", // Don't populate password
        });
        setShowModal(true);
    };

    // Open modal for view
    const handleViewUser = (user) => {
        setModalMode("view");
        setSelectedUser(user);
        setShowModal(true);
    };

    // Submit form
    const onSubmit = async (data) => {
        setLoading(true);

        try {
            let res;

            if (modalMode === "create") {
                res = await createUserApi(data);
            } else if (modalMode === "edit") {
                const updateData = { ...data };
                if (!updateData.password) {
                    delete updateData.password;
                }
                res = await updateUserApi(selectedUser._id, updateData);
            }

            if (res.EC === 0) {
                toast.success(res.EM || `User ${modalMode === "create" ? "created" : "updated"} successfully!`);
                setShowModal(false);
                fetchUsers();
                fetchStatsData();
            } else {
                toast.error(res.EM || "Operation failed");
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error(error?.response?.data?.EM || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    // Toggle user status
    const handleToggleStatus = async (userId) => {
        try {
            const res = await toggleUserStatusApi(userId);

            if (res.EC === 0) {
                toast.success(res.EM || "Status updated successfully!");
                fetchUsers();
                fetchStatsData();
            } else {
                toast.error(res.EM || "Failed to update status");
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error(error?.response?.data?.EM || "Failed to update status");
        }
    };

    // Delete user
    const handleDeleteUser = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        try {
            const res = await deleteUserApi(userToDelete._id);

            if (res.EC === 0) {
                toast.success(res.EM || "User deleted successfully!");
                setShowDeleteConfirm(false);
                setUserToDelete(null);
                fetchUsers();
                fetchStatsData();
            } else {
                toast.error(res.EM || "Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error(error?.response?.data?.EM || "Failed to delete user");
        }
    };

    if (fetchLoading && users.length === 0) {
        return <Spinner text="Loading users..." />;
    }

    return (
        <div className="space-y-6 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Header with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconColor={stat.iconColor}
                        borderColor={stat.borderColor}
                    />
                ))}
            </div>

            {/* Filters & Actions */}
            <div className="glass-card rounded-2xl p-6 transition-all duration-200">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    {/* Search */}
                    <div className="flex-1 w-full md:max-w-md">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by username, name, or email..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange("search", e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 transition-all duration-200"
                            />
                            <svg
                                className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 dark:text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 flex-wrap">
                        {/* Role Filter */}
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange("role", e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 cursor-pointer transition-all duration-200"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>

                        {/* Gender Filter */}
                        <select
                            value={filters.gender}
                            onChange={(e) => handleFilterChange("gender", e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 cursor-pointer transition-all duration-200"
                        >
                            <option value="">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filters.active}
                            onChange={(e) => handleFilterChange("active", e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 cursor-pointer transition-all duration-200"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        {/* Add User Button */}
                        <button
                            onClick={handleCreateUser}
                            className="flex items-center gap-2 bg-indigo-600 dark:bg-indigo-500/40 text-white dark:text-indigo-100 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 dark:hover:bg-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 transition-all duration-200 cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className="glass-card rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-16 h-16 text-slate-300 dark:text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">No users found</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-500">Try adjusting your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200 border-b border-slate-100 dark:border-slate-800">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                                                    {user.fullName?.charAt(0).toUpperCase() || "U"}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user.fullName}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">@{user.username}</p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-900 dark:text-slate-100">{user.email}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.phone || "N/A"}</p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${user.role === "admin"
                                                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                                    : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                                                    }`}
                                            >
                                                {user.role === "admin" ? "👑 Admin" : "👤 User"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(user._id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${user.active
                                                    ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/40"
                                                    : "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-200 dark:hover:bg-rose-900/40"
                                                    }`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${user.active ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                                                {user.active ? "Active" : "Inactive"}
                                            </button>
                                        </td>

                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                                                {new Date(user.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(user.createdAt).toLocaleTimeString("en-US", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleViewUser(user)}
                                                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all duration-200 cursor-pointer"
                                                    title="View Details"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleEditUser(user)}
                                                    className="p-2 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 cursor-pointer"
                                                    title="Edit User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>

                                                <button
                                                    onClick={() => handleDeleteUser(user)}
                                                    className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all duration-200 cursor-pointer"
                                                    title="Delete User"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-600">
                            Showing page <span className="font-semibold">{currentPage}</span> of{" "}
                            <span className="font-semibold">{totalPages}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                            >
                                Previous
                            </button>
                            <div className="flex gap-2 items-center">
                                {/* Page Numbers */}
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${currentPage === i + 1
                                            ? "bg-[#4ADE80] text-[#101A17] shadow-md scale-105"
                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 bg-[#4ADE80] text-[#101A17] rounded-lg hover:bg-[#22D3EE] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer font-semibold"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {modalMode === "view" && selectedUser && (
                <ViewUserModal
                    user={selectedUser}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedUser(null);
                        setModalMode("create");
                    }}
                />
            )}

            {(modalMode === "create" || modalMode === "edit") && showModal && (
                <CreateEditUserModal
                    mode={modalMode}
                    user={selectedUser}
                    onSubmit={onSubmit}
                    onClose={() => setShowModal(false)}
                    loading={loading}
                />
            )}

            {showDeleteConfirm && (
                <DeleteUserModal
                    user={userToDelete}
                    onConfirm={confirmDelete}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setUserToDelete(null);
                    }}
                />
            )}
        </div>
    );
};

export default UserManagement;