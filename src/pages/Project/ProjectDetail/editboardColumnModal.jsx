import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { updateBoardColumnsApi } from '../../../utils/Api/projectApi';
import { X, Plus, GripVertical, Trash2 } from 'lucide-react';
import ButtonSpinner from '../../../components/ButtonSpinner';
import { cn } from '../../../lib/utils';

const EditBoardColumnsModal = ({ isOpen, onClose, project, onColumnsUpdate }) => {
    const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            boardColumns: project?.boardColumns || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "boardColumns"
    });

    useEffect(() => {
        if (project?.boardColumns) {
            const sortedColumns = [...project.boardColumns].sort((a, b) => a.order - b.order);
            reset({ boardColumns: sortedColumns });
        }
    }, [project, reset, isOpen]);


    if (!isOpen) return null;

    const onSubmit = async (data) => {
        try {
            const columnsToUpdate = data.boardColumns.map((col, index) => ({
                _id: col._id,
                name: col.name,
                order: index + 1
            }));

            const res = await updateBoardColumnsApi(project._id, { boardColumns: columnsToUpdate });
            if (res.EC === 0) {
                toast.success("Board columns updated successfully!");
                onColumnsUpdate(res.data);
                onClose();
            } else {
                toast.error(res.EM || "Failed to update board columns.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        }
    };

    return (
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
                                        <div className="w-10 h-10 flex-shrink-0"></div> // Placeholder to keep alignment
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
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
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center cursor-pointer"
                        >
                            {isSubmitting ? <ButtonSpinner /> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBoardColumnsModal;