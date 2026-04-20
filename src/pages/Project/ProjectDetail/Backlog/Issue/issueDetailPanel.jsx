import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { X, Trash2, User, Calendar, Star, Type, ChevronsRight } from 'lucide-react';
import { updateIssueApi, createSubtaskApi, getSubtaskApi } from '../../../../utils/Api/issueApi';
import { getProjectMembersApi } from '../../../../utils/Api/projectApi';
import Spinner from '../../../../components/spinner';

const IssueDetailPanel = ({ project, issue, onClose, onDataUpdate, onOpenDeleteModal }) => {
    const [projectMembers, setProjectMembers] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const { register, handleSubmit, reset, watch } = useForm();
    const assigneeValue = watch('assigneeId');

    useEffect(() => {
        if (issue) {
            reset({
                title: issue.title,
                description: issue.description || '',
                assigneeId: issue.assigneeId?._id || 'null',
                priority: issue.priority,
                storyPoints: issue.storyPoints || 0,
                startDate: issue.startDate ? new Date(issue.startDate).toISOString().split('T')[0] : '',
                dueDate: issue.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : '',
            });
        }
    }, [issue, reset]);

    // Fetch project members
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await getProjectMembersApi(project._id);
                if (res.EC === 0) setProjectMembers(res.data);
            } catch (error) { console.error("Failed to fetch project members", error); }
        };
        fetchMembers();
    }, [project._id]);

    // Fetch subtasks for the current issue
    const fetchSubtasks = useCallback(async () => {
        if (!issue || issue.parentId) {
            setSubtasks([]);
            return;
        };
        setLoadingSubtasks(true);
        try {
            const res = await getSubtaskApi(issue._id);
            if (res && res.EC === 0) {
                setSubtasks(res.data);
            } else {
                setSubtasks([]);
            }
        } catch (error) {
            console.error("Failed to fetch subtasks", error);
            setSubtasks([]);
        } finally {
            setLoadingSubtasks(false);
        }
    }, [issue]);

    useEffect(() => {
        fetchSubtasks();
    }, [fetchSubtasks]);


    const onSubmit = async (data) => {
        try {
            const updateData = {
                ...data,
                assigneeId: data.assigneeId === "null" ? null : data.assigneeId,
                storyPoints: Number(data.storyPoints) || 0,
                startDate: data.startDate || null,
                dueDate: data.dueDate || null
            };
            const res = await updateIssueApi(issue._id, updateData);
            if (res.EC === 0) {
                toast.success("Issue updated!");
                onDataUpdate();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        }
    };

    const handleCreateSubtask = async () => {
        if (!newSubtaskTitle.trim()) return;
        try {
            const subtaskData = { parentId: issue._id, title: newSubtaskTitle };
            const res = await createSubtaskApi(subtaskData);
            if (res.EC === 0) {
                toast.success("Subtask created!");
                setSubtasks(prev => [...prev, res.data]); // Cập nhật UI ngay lập tức
                setNewSubtaskTitle('');
                onDataUpdate(); // Vẫn gọi để đồng bộ toàn bộ state ở Backlog
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        }
    };

    const priorityOptions = ["Highest", "High", "Medium", "Low", "Lowest"];

    return (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-slate-900 shadow-2xl z-30 flex flex-col border-l border-slate-200 dark:border-slate-700">
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500">{issue?.issueKey}</span>
                <div className="flex items-center gap-2">
                    <button onClick={onOpenDeleteModal} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <Trash2 className="w-5 h-5 text-slate-500" />
                    </button>
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>
            </header>
            <main className="flex-grow p-6 overflow-y-auto">
                <form onBlur={handleSubmit(onSubmit)}>
                    <input {...register("title")} className="text-2xl font-bold bg-transparent w-full focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 rounded-md p-2" />
                    <div className="mt-6 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-500">Description</h3>
                        <textarea {...register("description")} rows="4" placeholder="Add a description..." className="w-full p-2 bg-transparent focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800 rounded-md border border-transparent focus:border-slate-300 dark:focus:border-slate-600" />
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2"><User className="w-4 h-4" />Assignee</label>
                            <select {...register("assigneeId")} value={assigneeValue || 'null'} className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                <option value="null">Unassigned</option>
                                {projectMembers.map(member => (<option key={member.accountId._id} value={member.accountId._id}>{member.accountId.fullName}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2"><Star className="w-4 h-4" />Priority</label>
                            <select {...register("priority")} className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                                {priorityOptions.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2"><ChevronsRight className="w-4 h-4" />Story Points</label>
                            <input type="number" {...register("storyPoints")} className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" />Start Date</label>
                            <input type="date" {...register("startDate")} className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700" />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-500 flex items-center gap-2"><Calendar className="w-4 h-4" />Due Date</label>
                            <input type="date" {...register("dueDate")} className="mt-1 w-full p-2 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700" />
                        </div>
                    </div>
                </form>
                {!issue?.parentId && (
                    <div className="mt-8">
                        <h3 className="text-sm font-semibold text-slate-500 mb-2">Subtasks</h3>
                        {loadingSubtasks ? <div className="flex justify-center py-4"><Spinner /></div> : (
                            <div className="space-y-2 mb-2">
                                {subtasks.map(sub => (
                                    <div key={sub._id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                                        <span className="text-xs font-semibold text-slate-500">{sub.issueKey}</span>
                                        <span className="text-sm flex-grow text-slate-800 dark:text-slate-200">{sub.title}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <div className="relative">
                            <input
                                type="text"
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                                placeholder="Create a new subtask..."
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                            />
                            {newSubtaskTitle && (
                                <button
                                    onClick={handleCreateSubtask}
                                    className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
                                    Create
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default IssueDetailPanel;