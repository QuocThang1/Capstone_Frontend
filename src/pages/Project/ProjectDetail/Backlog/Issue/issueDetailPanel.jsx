import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { X, Trash2, User, Calendar, Star, ChevronsRight, ChevronDown, MoreHorizontal, Plus, Columns } from 'lucide-react';
import { updateIssueApi, createSubtaskApi, getSubtaskApi } from '../../../../../utils/Api/issueApi';
import { getProjectMembersApi } from '../../../../../utils/Api/projectApi';
import Spinner from '../../../../../components/spinner';
import SubtaskRow from '../../../../../components/projectPage/Backlog/IssueDetail/subtaskRow';
import { cn } from '../../../../../lib/utils';
import CommentSection from '../../../../../components/projectPage/Backlog/IssueDetail/commentSection';
import HistorySection from '../../../../../components/projectPage/Backlog/IssueDetail/historySection';

const IssueDetailPanel = ({ project, issue, onClose, onDataUpdate, onDeleteRequest, subtaskTrigger }) => {
    const [projectMembers, setProjectMembers] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [isSubtasksVisible, setSubtasksVisible] = useState(true);
    const [activeActivityTab, setActiveActivityTab] = useState('comments');
    const subtaskInputRef = useRef(null);

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

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const res = await getProjectMembersApi(project._id);
                if (res.EC === 0) setProjectMembers(res.data);
            } catch (error) { console.error("Failed to fetch project members", error); }
        };
        fetchMembers();
    }, [project._id]);

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
    }, [fetchSubtasks, subtaskTrigger]);

    const onSubmit = async (data) => {
        try {
            const updateData = { ...data, assigneeId: data.assigneeId === "null" ? null : data.assigneeId, storyPoints: Number(data.storyPoints) || 0, startDate: data.startDate || null, dueDate: data.dueDate || null };
            const res = await updateIssueApi(issue._id, updateData);
            if (res.EC === 0) {
                toast.success(res.EM || "Issue updated!");
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
                toast.success(res.EM || "Subtask created!");
                setSubtasks(prev => [...prev, res.data]);
                setNewSubtaskTitle('');
                onDataUpdate();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM);
        }
    };

    const handleAddSubtaskClick = () => {
        subtaskInputRef.current?.focus();
    };

    const priorityOptions = ["Highest", "High", "Medium", "Low", "Lowest"];
    const subtasksDone = subtasks.filter(s => project.boardColumns[project.boardColumns.length - 1].name === s.status).length;
    const progress = subtasks.length > 0 ? (subtasksDone / subtasks.length) * 100 : 0;

    return (
        <div className="fixed top-0 right-0 h-full w-1/3 bg-white dark:bg-slate-900 shadow-2xl z-30 flex flex-col border-l border-slate-200 dark:border-slate-700">
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
                <span className="text-sm text-slate-500">{issue?.issueKey}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => onDeleteRequest(issue)} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><Trash2 className="w-5 h-5 text-slate-500" /></button>
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"><X className="w-5 h-5 text-slate-500" /></button>
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
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <button onClick={() => setSubtasksVisible(!isSubtasksVisible)} className="p-1 -m-1 cursor-pointer"><ChevronDown className={`w-5 h-5 transition-transform ${isSubtasksVisible ? '' : '-rotate-90'}`} /></button>
                                <h3 className="text-sm font-semibold text-slate-500">Subtasks</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <button className="p-1 -m-1 text-slate-500 hover:text-slate-800 cursor-pointer"><MoreHorizontal className="w-5 h-5" /></button>
                                <button className="p-1 -m-1 text-slate-500 hover:text-slate-800 cursor-pointer"><Columns className="w-5 h-5" /></button>
                                <button onClick={handleAddSubtaskClick} className="p-1 -m-1 text-slate-500 hover:text-slate-800 cursor-pointer"><Plus className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-full bg-slate-200 rounded-full h-1 dark:bg-slate-700">
                                <div className="bg-blue-600 h-1 rounded-full" style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-500 whitespace-nowrap">{Math.round(progress)}% Done</span>
                        </div>

                        {isSubtasksVisible && (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-md">
                                <div className="grid grid-cols-[minmax(0,1fr)_120px_100px_40px] items-center gap-4 px-2 py-1 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-xs font-bold text-slate-500">Work</span>
                                    <span className="text-xs font-bold text-slate-500 text-center">Assignee</span>
                                    <span className="text-xs font-bold text-slate-500 text-center">Status</span>
                                    <span></span>
                                </div>
                                {loadingSubtasks ? <div className="flex justify-center py-4"><Spinner /></div> : (
                                    <div>
                                        {subtasks.map(sub => (
                                            <SubtaskRow
                                                key={sub._id}
                                                subtask={sub}
                                                projectMembers={projectMembers}
                                                boardColumns={project.boardColumns}
                                                onUpdate={fetchSubtasks}
                                                onDelete={() => onDeleteRequest(sub)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="relative mt-2">
                            <input ref={subtaskInputRef} type="text" value={newSubtaskTitle} onChange={(e) => setNewSubtaskTitle(e.target.value)} placeholder="Create a new subtask..." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800" />
                            {newSubtaskTitle && (<button onClick={handleCreateSubtask} className="absolute right-1 top-1/2 -translate-y-1/2 px-4 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 cursor-pointer">Create</button>)}
                        </div>
                    </div>
                )}

                {/* Activity Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Activity</h3>
                    <div className="flex items-center border-b border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setActiveActivityTab('comments')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium cursor-pointer",
                                activeActivityTab === 'comments'
                                    ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            Comments
                        </button>
                        <button
                            onClick={() => setActiveActivityTab('history')}
                            className={cn(
                                "px-4 py-2 text-sm font-medium cursor-pointer",
                                activeActivityTab === 'history'
                                    ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            History
                        </button>
                    </div>

                    <div className="mt-4">
                        {activeActivityTab === 'comments' && <CommentSection issueId={issue?._id} />}
                        {activeActivityTab === 'history' && <HistorySection issueId={issue?._id} />}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default IssueDetailPanel;