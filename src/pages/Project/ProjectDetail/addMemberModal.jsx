import { useState, useEffect, useRef } from 'react';
import { X, Search, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { useDebounce } from 'use-debounce';
import { getAllUsersApi } from '../../../utils/Api/userApi';
import { addMemberToProjectApi, getProjectMembersApi } from '../../../utils/Api/projectApi';
import Spinner from '../../../components/spinner';
import ButtonSpinner from '../../../components/ButtonSpinner';

const AddMemberModal = ({ isOpen, onClose, project }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [searchResults, setSearchResults] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [loadingSearch, setLoadingSearch] = useState(false);
    const [loadingMembers, setLoadingMembers] = useState(true);
    const [addingMemberId, setAddingMemberId] = useState(null);

    const modalRef = useRef(null);

    const fetchMembers = async () => {
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
        }
    }, [isOpen, project._id]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const searchUsers = async () => {
                setLoadingSearch(true);
                try {
                    const res = await getAllUsersApi({ search: debouncedSearchTerm, limit: 10 });
                    if (res && res.data) {
                        const memberIds = new Set(projectMembers.map(m => m.accountId._id));
                        const nonMembers = res.data.users.filter(user => !memberIds.has(user._id));
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

    const handleAddMember = async (user) => {
        setAddingMemberId(user._id);
        try {
            const res = await addMemberToProjectApi(project._id, user.email);
            if (res && res.EC === 0) {
                toast.success(res.EM || "Member added successfully.");
                fetchMembers();
                setSearchTerm('');
            } else {
                toast.error(res.EM || "Failed to add member.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "Failed to add member.");
        } finally {
            setAddingMemberId(null);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border-2 border-slate-300 dark:border-slate-700">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add people to {project.name}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                        <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="min-h-[150px] max-h-[300px] overflow-y-auto">
                        {loadingSearch ? <div className="flex justify-center p-4"><Spinner /></div> : (
                            <ul className="space-y-2">
                                {searchResults.map(user => (
                                    <li key={user._id} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.fullName}</p>
                                            <p className="text-sm text-slate-500">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={() => handleAddMember(user)}
                                            disabled={addingMemberId === user._id}
                                            className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 w-20 flex justify-center cursor-pointer disabled:bg-indigo-400"
                                        >
                                            {addingMemberId === user._id ? <ButtonSpinner /> : 'Add'}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        {!loadingSearch && debouncedSearchTerm && searchResults.length === 0 && (
                            <p className="text-center text-slate-500 py-4">No users found.</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            {projectMembers.length} people in this project
                        </h3>
                        {loadingMembers ? <div className="flex justify-center p-4"><Spinner /></div> : (
                            <ul className="space-y-2 max-h-40 overflow-y-auto p-1">
                                {projectMembers.map(member => (
                                    <li key={member._id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 dark:bg-slate-700/50">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{member.accountId.fullName}</p>
                                            <p className="text-sm text-slate-500">{member.accountId.email}</p>
                                        </div>
                                        <span className="text-xs font-medium uppercase bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-full">{member.role}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddMemberModal;