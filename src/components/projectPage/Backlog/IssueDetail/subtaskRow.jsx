import { useState } from 'react';
import { toast } from 'react-toastify';
import { Type, Trash2 } from 'lucide-react';
import { updateIssueApi } from '../../../../utils/Api/issueApi';
import SelectDropdown from '../../../../components/selectDropdown';

const SubtaskRow = ({ subtask, projectMembers, boardColumns, onUpdate, onDelete }) => {
    const [status, setStatus] = useState(subtask.status);

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

    const handleAssigneeChange = (value) => {
        handleUpdate('assigneeId', value === 'null' ? null : value);
    };

    const handleStatusChange = (value) => {
        setStatus(value);
        handleUpdate('status', value);
    };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(subtask);
    };

    const currentAssignee = subtask.assigneeId
        ? projectMembers.find(m => m.accountId._id === subtask.assigneeId._id)?.accountId
        : null;

    const assigneeOptions = [
        { value: 'null', label: 'Unassigned' },
        ...projectMembers.map(member => ({
            value: member.accountId._id,
            label: member.accountId.fullName
        }))
    ];

    const statusOptions = boardColumns.map(col => ({
        value: col.name,
        label: col.name.toUpperCase()
    }));

    return (
        <div className="group grid grid-cols-[minmax(0,1fr)_130px_130px_40px] items-center gap-4 px-3 py-2 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-800/50">
            {/* Work */}
            <div className="flex items-center gap-3 truncate">
                <div className="w-6 h-6 rounded bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                    <Type className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">{subtask.issueKey}</span>
                <span className="text-sm font-medium truncate text-slate-800 dark:text-slate-200">{subtask.title}</span>
            </div>

            {/* Assignee */}
            <div className="w-full flex items-center min-w-0">
                <SelectDropdown
                    value={subtask.assigneeId?._id || 'null'}
                    options={assigneeOptions}
                    onChange={handleAssigneeChange}
                    placeholder="Select assignee"
                    size="sm"
                />
            </div>

            {/* Status */}
            <div className="w-full flex items-center min-w-0">
                <SelectDropdown
                    value={status}
                    options={statusOptions}
                    onChange={handleStatusChange}
                    placeholder="Select status"
                    size="sm"
                />
            </div>

            {/* Delete Button */}
            <div className="flex justify-center">
                <button
                    onClick={handleDeleteClick}
                    className="p-1.5 rounded-md text-slate-400 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-900/40 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default SubtaskRow;