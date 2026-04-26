import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Type, Trash2 } from 'lucide-react';
import { updateIssueApi } from '../../../../utils/Api/issueApi';

const SubtaskRow = ({ subtask, projectMembers, boardColumns, onUpdate, onDelete }) => {
    const [status, setStatus] = useState(subtask.status);
    const [isEditingAssignee, setEditingAssignee] = useState(false);
    const assigneeSelectRef = useRef(null);

    const handleUpdate = async (field, value) => {
        const updateData = { [field]: value };
        try {
            const res = await updateIssueApi(subtask._id, updateData);
            if (res.EC === 0) {
                toast.success(`Subtask ${field} updated!`);
                onUpdate();
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || `Failed to update ${field}`);
        }
    };

    const handleAssigneeChange = (e) => {
        const newAssigneeId = e.target.value;
        handleUpdate('assigneeId', newAssigneeId === 'null' ? null : newAssigneeId);
        setEditingAssignee(false); // Tắt chế độ chỉnh sửa sau khi chọn
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        handleUpdate('status', newStatus);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(subtask);
    };

    // Tự động focus vào select khi bật chế độ chỉnh sửa
    useEffect(() => {
        if (isEditingAssignee) {
            assigneeSelectRef.current?.focus();
        }
    }, [isEditingAssignee]);

    const currentAssignee = subtask.assigneeId
        ? projectMembers.find(m => m.accountId._id === subtask.assigneeId._id)?.accountId
        : null;

    return (
        <div className="group grid grid-cols-[minmax(0,1fr)_120px_100px_40px] items-center gap-4 px-2 py-1 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-100 dark:hover:bg-slate-800">
            {/* Work */}
            <div className="flex items-center gap-3 truncate">
                <Type className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs font-semibold text-slate-500">{subtask.issueKey}</span>
                <span className="text-sm truncate text-slate-800 dark:text-slate-200">{subtask.title}</span>
            </div>

            {/* Assignee */}
            <div className="text-center text-xs text-slate-600 dark:text-slate-300">
                {isEditingAssignee ? (
                    <select
                        ref={assigneeSelectRef}
                        value={subtask.assigneeId?._id || 'null'}
                        onChange={handleAssigneeChange}
                        onBlur={() => setEditingAssignee(false)} // Tắt khi focus ra ngoài
                        className="w-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-1"
                    >
                        <option value="null">Unassigned</option>
                        {projectMembers.map(member => (
                            <option key={member.accountId._id} value={member.accountId._id}>
                                {member.accountId.fullName}
                            </option>
                        ))}
                    </select>
                ) : (
                    <span onClick={() => setEditingAssignee(true)} className="cursor-pointer w-full inline-block p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700">
                        {currentAssignee ? currentAssignee.fullName : 'Unassigned'}
                    </span>
                )}
            </div>

            {/* Status */}
            <div className="flex justify-center">
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="text-xs font-bold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md px-2 py-1 border-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full"
                >
                    {boardColumns.map(col => (
                        <option key={col.name} value={col.name}>{col.name.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* Delete Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleDeleteClick}
                    className="p-1 rounded-md text-slate-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/50 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SubtaskRow;