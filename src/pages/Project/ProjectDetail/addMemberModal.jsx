import { useState, useEffect, useContext } from 'react';
import { X, Search, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsersApi } from '../../../utils/Api/userApi';
import { addMemberToProjectApi, getProjectMembersApi, removeMemberApi } from '../../../utils/Api/projectApi';
import Spinner from '../../../components/spinner';
import ButtonSpinner from '../../../components/ButtonSpinner';
import { AuthContext } from '../../../context/auth.context';
import MemberDetailModal from './memberDetailModal';

const AddMemberModal = ({ isOpen, onClose, project, onMemberUpdate }) => {
    const { user } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [addingMemberId, setAddingMemberId] = useState(null);
    const [removingMemberId, setRemovingMemberId] = useState(null);

    const [confirmingMemberId, setConfirmingMemberId] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    // FIX LỖI: SO SÁNH BẰNG EMAIL để giải quyết dứt điểm vấn đề không đồng bộ Object_ID ở User Context khi mới đăng nhập ngay
    const isLeader = projectMembers.some(m => {
        const account = m.accountId || {};

        // Ưu tiên so sánh bằng Email (đảm bảo 100% cho mọi model DB)
        if (account.email && user?.email && account.email === user.email) {
            return m.role === 'leader';
        }

        // Fallback so sánh type String của cả 2 ID (phòng ngừa ObjectId)
        const memberId = String(account._id || account);
        const currentUserId = String(user?._id || user?.id || "");
        return memberId === currentUserId && m.role === 'leader';
    });

    const fetchMembers = async () => {
        if (!project?._id) return;
        setLoadingMembers(true);
        try {
            const res = await getProjectMembersApi(project._id);
            if (res && res.EC === 0) {
                const sortedMembers = (res.data || []).sort((a, b) => {
                    if (a.role === 'leader') return -1;
                    if (b.role === 'leader') return 1;
                    return 0;
                });
                setProjectMembers(sortedMembers);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to fetch project members.");
        } finally {
            setLoadingMembers(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            setSearchTerm('');
            setConfirmingMemberId(null);
            setSelectedMember(null);
        }
    }, [isOpen, project?._id]);


    useEffect(() => {
        if (debouncedSearchTerm) {
            const searchUsers = async () => {
                setLoadingSearch(true);
                try {
                    const res = await getAllUsersApi({ search: debouncedSearchTerm, limit: 10 });
                    if (res && res.data) {
                        const memberIds = new Set(projectMembers.map(m => m.accountId._id));
                        const nonMembers = res.data.users.filter(u => !memberIds.has(u._id));
                        setSearchResults(nonMembers);
                    }
                } catch (error) {
                    toast.error(error?.response?.data?.EM || "Failed to search for users.");
                    setSearchResults([]);
                } finally {
                    setLoadingSearch(false);
                }
            };
            searchUsers();
        } else {
            setSearchResults([]);
        }
    }, [debouncedSearchTerm, projectMembers]);

    const handleInviteMember = async (targetUser) => {
        setAddingMemberId(targetUser._id);
        try {
            const res = await addMemberToProjectApi(project._id, targetUser.email);
            if (res && res.EC === 0) {
                toast.success("Invitation email sent successfully.");
                setSearchTerm('');
            } else {
                toast.error(res.EM || "Failed to send invitation.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to send invitation.");
        } finally {
            setAddingMemberId(null);
        }
    };

    const handleRemoveMember = async (e, memberId) => {
        e.stopPropagation();
        setRemovingMemberId(memberId);
        try {
            const res = await removeMemberApi(project._id, memberId);
            if (res && res.EC === 0) {
                toast.success("Member removed successfully.");
                fetchMembers();
                onMemberUpdate && onMemberUpdate();
            } else {
                toast.error(res.EM || "Failed to remove member.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to remove member.");
        } finally {
            setRemovingMemberId(null);
            setConfirmingMemberId(null);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
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
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">People in {project?.name}</h2>
                            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                            </button>
                        </div>

                        {/* Search & Invite Section */}
                        {isLeader && (
                            <div className="p-6 border-b border-slate-200 dark:border-slate-700 shrink-0">
                                <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">Invite new members</label>
                                <div className="relative mb-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email to invite..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {searchTerm && (
                                    <div className="mt-2 max-h-40 overflow-y-auto custom-scrollbar border border-slate-200 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-slate-900">
                                        {loadingSearch ? <div className="p-4 flex justify-center"><Spinner /></div> : (
                                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {searchResults.map(u => (
                                                    <li
                                                        key={u._id}
                                                        onClick={() => setSelectedMember(u)} // Thêm onClick
                                                        className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer" // Thêm cursor-pointer
                                                    >
                                                        <div>
                                                            <p className="font-medium text-slate-800 dark:text-white">{u.fullName}</p>
                                                            <p className="text-xs text-slate-500">{u.email}</p>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Phải dừng lại khỏi nổi bọt
                                                                handleInviteMember(u);
                                                            }}
                                                            disabled={addingMemberId === u._id}
                                                            className="px-4 py-1.5 cursor-pointer text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 w-24 flex justify-center disabled:opacity-75"
                                                        >
                                                            {addingMemberId === u._id ? <ButtonSpinner /> : 'Invite'}
                                                        </button>
                                                    </li>
                                                ))}
                                                {searchResults.length === 0 && (
                                                    <li className="p-3 text-sm text-center text-slate-500">No users found.</li>
                                                )}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Existing Members Section */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-4">Current Members ({projectMembers.length})</h3>
                            {loadingMembers ? <Spinner /> : (
                                <ul className="space-y-3">
                                    {projectMembers.map(member => (
                                        <li
                                            key={member.accountId._id}
                                            onClick={() => setSelectedMember(member)}
                                            className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                        >
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-slate-800 dark:text-slate-200">
                                                        {member.accountId?.fullName || 'Unknown User'}
                                                    </span>
                                                    {member.role === 'leader' && (
                                                        <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                                                            Leader
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-sm text-slate-500">{member.accountId?.email}</span>
                                            </div>

                                            {isLeader && member.role !== 'leader' && (
                                                <div className="flex items-center gap-2">
                                                    {confirmingMemberId === member.accountId._id ? (
                                                        <div className="flex items-center gap-1.5 animate-in slide-in-from-right-2 fade-in duration-200">
                                                            <span className="text-xs text-slate-500 font-medium mr-1">Sure?</span>
                                                            <button
                                                                onClick={(e) => handleRemoveMember(e, member.accountId._id)}
                                                                disabled={removingMemberId === member.accountId._id}
                                                                className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50 min-w-[45px] flex justify-center items-center transition-colors"
                                                            >
                                                                {removingMemberId === member.accountId._id ? <ButtonSpinner /> : 'Yes'}
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); setConfirmingMemberId(null); }}
                                                                disabled={removingMemberId === member.accountId._id}
                                                                className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 rounded transition-colors disabled:opacity-50"
                                                            >
                                                                No
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setConfirmingMemberId(member.accountId._id); }}
                                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors cursor-pointer"
                                                            title="Remove Member"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>

                    {/* Hiển thị Modal con từ File Tách Rời Phía Trên */}
                    <MemberDetailModal
                        isOpen={!!selectedMember}
                        onClose={() => setSelectedMember(null)}
                        member={selectedMember}
                    />

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddMemberModal;