import { useState, useEffect, useCallback, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { X, Trash2, User, Calendar, Star, ChevronsRight, ChevronDown, MoreHorizontal, Plus, Columns } from 'lucide-react';
import { updateIssueApi, createSubtaskApi, getSubtaskApi } from '../../../../../utils/Api/issueApi';
import { getProjectMembersApi } from '../../../../../utils/Api/projectApi';
import Spinner from '../../../../../components/spinner';
import SubtaskRow from '../../../../../components/projectPage/IssueDetail/subtaskRow';
import { cn } from '../../../../../lib/utils';
import SelectDropdown from '../../../../../components/selectDropdown';
import CommentSection from '../../../../../components/projectPage/IssueDetail/commentSection';
import HistorySection from '../../../../../components/projectPage/IssueDetail/historySection';

const IssueDetailPanel = ({ project, issue, onClose, onDataUpdate, onDeleteRequest, subtaskTrigger }) => {
    const [projectMembers, setProjectMembers] = useState([]);
    const [subtasks, setSubtasks] = useState([]);
    const [loadingSubtasks, setLoadingSubtasks] = useState(false);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
    const [isSubtasksVisible, setSubtasksVisible] = useState(true);
    const [activeActivityTab, setActiveActivityTab] = useState('comments');
    const subtaskInputRef = useRef(null);

    const { register, handleSubmit, reset, watch, setValue } = useForm();
    const assigneeValue = watch('assigneeId');
    const priorityValue = watch('priority');

    const assigneeOptions = [
        { value: 'null', label: 'Unassigned' },
        ...projectMembers.map(member => ({ value: member.accountId._id, label: member.accountId.fullName }))
    ];

    const priorityOptionsList = ["Highest", "High", "Medium", "Low", "Lowest"];
    const prioritySelectOptions = priorityOptionsList.map(p => ({ value: p, label: p }));

    useEffect(() => {
        if (issue) {
            const formatForDateTimeLocal = (dateString) => {
                if (!dateString) return '';
                const d = new Date(dateString);
                return new Date(d.getTime() - (d.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
            };

            reset({
                title: issue.title,
                description: issue.description || '',
                assigneeId: issue.assigneeId?._id || 'null',
                priority: issue.priority,
                storyPoints: issue.storyPoints || 0,
                startDate: formatForDateTimeLocal(issue.startDate),
                dueDate: formatForDateTimeLocal(issue.dueDate),
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
                onDataUpdate();
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
    }

    const priorityOptions = ["Highest", "High", "Medium", "Low", "Lowest"];
    const subtasksDone = subtasks.filter(s => s.status && s.status.toLowerCase() === 'done').length;
    const progress = subtasks.length > 0 ? (subtasksDone / subtasks.length) * 100 : 0;

    return (
        <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 450, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-700"
        >
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors duration-300 whitespace-nowrap">{issue?.issueKey}</span>
                <div className="flex items-center gap-2">
                    <button onClick={() => onDeleteRequest(issue)} className="p-2 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:shadow-md transition-all duration-200 cursor-pointer"><Trash2 className="w-5 h-5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors duration-200" /></button>
                    <button onClick={onClose} className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 cursor-pointer"><X className="w-5 h-5 text-slate-500 dark:text-slate-400 transition-colors duration-200" /></button>
                </div>
            </header>
            <main className="flex-grow p-6 overflow-y-auto bg-white dark:bg-slate-900 transition-colors duration-300">
                {/* All form and content remains the same */}
                <form onBlur={handleSubmit(onSubmit)}>
                    <input {...register("title")} className="text-2xl font-bold bg-transparent w-full focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-900/20 rounded-md p-2 text-slate-900 dark:text-slate-100 transition-all duration-200" />
                    <div className="mt-6 space-y-4">
                        <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-400 transition-colors duration-300">Description</h3>
                        <textarea {...register("description")} rows="4" placeholder="Add a description..." className="w-full p-2 bg-white dark:bg-slate-900 focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-900/20 rounded-md border border-slate-300 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-400 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-all duration-200" />
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors duration-300 mb-1"><User className="w-4 h-4" />Assignee</label>
                            <SelectDropdown
                                value={assigneeValue || 'null'}
                                options={assigneeOptions}
                                onChange={(val) => setValue("assigneeId", val, { shouldValidate: true })}
                                placeholder="Select Assignee"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors duration-300 mb-1"><Star className="w-4 h-4" />Priority</label>
                            <SelectDropdown
                                value={priorityValue}
                                options={prioritySelectOptions}
                                onChange={(val) => setValue("priority", val, { shouldValidate: true })}
                                placeholder="Select Priority"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors duration-300 mb-1"><ChevronsRight className="w-4 h-4" />Story Points</label>
                            <input type="number" {...register("storyPoints")} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors duration-300 mb-1"><Calendar className="w-4 h-4" />Start Date</label>
                            <input type="datetime-local" {...register("startDate")} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:light] dark:[color-scheme:dark]" />
                        </div>
                        <div className="col-span-2">
                            <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2 transition-colors duration-300 mb-1"><Calendar className="w-4 h-4" />Due Date</label>
                            <input type="datetime-local" {...register("dueDate")} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 [color-scheme:light] dark:[color-scheme:dark]" />
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
                                {/* SỬA grid-cols VÀ BỎ flex justify-center Ở HEADER */}
                                <div className="grid grid-cols-[minmax(100px,1fr)_105px_105px_28px] items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 rounded-t-md">
                                    <span className="text-xs font-bold text-slate-500">Work</span>
                                    <span className="text-xs font-bold text-slate-500">Assignee</span>
                                    <span className="text-xs font-bold text-slate-500">Status</span>
                                    <span></span>
                                </div>
                                {loadingSubtasks ? <div className="flex justify-center py-4"><Spinner /></div> : (
                                    <div className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {subtasks.map(sub => (
                                            <SubtaskRow
                                                key={sub._id}
                                                subtask={sub}
                                                projectMembers={projectMembers}
                                                boardColumns={project.boardColumns}
                                                onUpdate={fetchSubtasks}
                                                onDelete={() => onDeleteRequest(sub)}
                                                gridClass="grid-cols-[minmax(100px,1fr)_105px_105px_28px]"
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
        </motion.div>
    );
};

export default IssueDetailPanel;