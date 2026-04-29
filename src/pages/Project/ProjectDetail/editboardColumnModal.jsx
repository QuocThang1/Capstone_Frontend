import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { updateBoardColumnsApi, deleteBoardColumnApi } from '../../../utils/Api/projectApi';
import { getIssuesByProjectApi } from '../../../utils/Api/issueApi';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';
import ButtonSpinner from '../../../components/ButtonSpinner';
import { cn } from '../../../lib/utils';
import MoveIssuesModal from './moveIssueModal';

const EditBoardColumnsModal = ({ isOpen, onClose, project, onColumnsUpdate }) => {
    const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            boardColumns: project?.boardColumns || []
        }
    });

    const { fields, append } = useFieldArray({
        control,
        name: "boardColumns"
    });

    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [columnToDelete, setColumnToDelete] = useState(null);

    useEffect(() => {
        if (project?.boardColumns) {
            const sortedColumns = [...project.boardColumns].sort((a, b) => a.order - b.order);
            reset({ boardColumns: sortedColumns });
        }
    }, [project, reset, isOpen]);

    useEffect(() => {
        const fetchIssues = async () => {
            if (!isOpen) return;
            setIsLoading(true);
            try {
                const res = await getIssuesByProjectApi(project._id);
                setIssues(res.data || []);
            } catch (error) {
                toast.error(error?.response?.data?.EM || "Could not fetch issues to check for dependencies.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchIssues();
    }, [isOpen, project._id]);

    if (!isOpen) return null;

    const callDeleteApi = async (columnName, targetColumnName = null) => {
        setIsLoading(true);
        try {
            const res = await deleteBoardColumnApi(project._id, columnName, targetColumnName);
            if (res.EC === 0) {
                toast.success(res.EM || "Column deleted successfully!");
                onColumnsUpdate(res.data);
                onClose();
            } else {
                toast.error(res.EM || "Failed to delete column.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred while deleting the column.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (indexToRemove) => {
        const column = fields[indexToRemove];
        const issuesInColumn = issues.filter(issue => issue.status === column.name);

        if (issuesInColumn.length > 0) {
            setColumnToDelete(column);
        } else {
            // Nếu không có issue, gọi API xóa trực tiếp
            callDeleteApi(column.name);
        }
    };

    const handleConfirmMoveAndDelete = (columnName, targetColumnName) => {
        callDeleteApi(columnName, targetColumnName);
        setColumnToDelete(null);
    };

    const onSubmit = async (data) => {
        // Hàm này giờ chỉ xử lý việc cập nhật tên/thứ tự và thêm cột mới
        try {
            const columnsToUpdate = data.boardColumns.map((col, index) => ({
                _id: col._id,
                name: col.name,
                order: index + 1
            }));

            const res = await updateBoardColumnsApi(project._id, { boardColumns: columnsToUpdate });
            if (res.EC === 0) {
                toast.success("Board columns updated successfully!");
                onColumnsUpdate();
                onClose();
            } else {
                toast.error(res.EM || "Failed to update board columns.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-black/50" onClick={onClose}>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border-2 border-slate-300 dark:border-slate-700" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Board Columns</h2>
                        <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer">
                            <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {fields.map((field, index) => {
                                const isDoneColumn = field.name === 'Done';
                                return (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <GripVertical className="w-5 h-5 text-slate-400 cursor-grab" />
                                        <input
                                            {...register(`boardColumns.${index}.name`, { required: "Column name is required" })}
                                            className={cn(
                                                "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800",
                                                isDoneColumn && "bg-slate-100 dark:bg-slate-700 cursor-not-allowed"
                                            )}
                                            placeholder="Column Name"
                                            disabled={isDoneColumn}
                                        />
                                        {isDoneColumn ? (
                                            <div className="w-10 h-10 flex-shrink-0"></div>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteClick(index)}
                                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full cursor-pointer flex-shrink-0"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() => append({ name: '', order: fields.length + 1 })}
                            className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            Add Column
                        </button>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoading}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center cursor-pointer"
                            >
                                {isSubmitting || isLoading ? <ButtonSpinner /> : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <MoveIssuesModal
                isOpen={!!columnToDelete}
                onClose={() => setColumnToDelete(null)}
                columnToDelete={columnToDelete}
                otherColumns={fields.filter(col => col.id !== columnToDelete?.id && col.name !== 'Done')}
                onConfirm={handleConfirmMoveAndDelete}
            />
        </>
    );
};

export default EditBoardColumnsModal;