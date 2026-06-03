import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { updateIssueTypesApi, deleteIssueTypeApi } from '../../../utils/Api/projectApi';
import { getIssuesByProjectApi } from '../../../utils/Api/issueApi';
import { X, Plus, Trash2 } from 'lucide-react';
import ButtonSpinner from '../../../components/ButtonSpinner';
import { cn } from '../../../lib/utils';
import MoveIssuesModal from './moveIssueModal';

const EditIssueTypesModal = ({ isOpen, onClose, project, onTypesUpdate }) => {
    const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: { issueTypes: project?.issueTypes || [] }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "issueTypes" });

    const [issues, setIssues] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [typeToDelete, setTypeToDelete] = useState(null);

    useEffect(() => {
        if (isOpen && project?.issueTypes) {
            reset({ issueTypes: project.issueTypes });
        }
    }, [project, reset, isOpen]);

    useEffect(() => {
        if (!isOpen || !project?._id) return;
        const fetchIssues = async () => {
            setIsLoading(true);
            try {
                const res = await getIssuesByProjectApi(project._id);
                setIssues(res.data || []);
            } catch (error) {
                toast.error(error?.response?.data?.EM || "Could not fetch issues.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchIssues();
    }, [isOpen, project?._id]);

    const callDeleteApi = async (typeName, targetTypeName = null) => {
        setIsLoading(true);
        try {
            const res = await deleteIssueTypeApi(project._id, typeName, targetTypeName);
            if (res.EC === 0) {
                toast.success(res.EM || "Issue type deleted successfully!");
                onTypesUpdate();
                onClose();
            } else {
                toast.error(res.EM || "Failed to delete issue type.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteClick = (indexToRemove) => {
        const issueType = fields[indexToRemove];

        // Nếu đây là một Type người dùng vừa thêm phía UI và chưa lưu thì chỉ cần xoá ở UI
        if (!issueType._id) {
            remove(indexToRemove);
            return;
        }

        const issuesWithType = issues.filter(issue => issue.type === issueType.name);

        if (issuesWithType.length > 0) {
            setTypeToDelete(issueType);
        } else {
            callDeleteApi(issueType.name); // Gọi luồng Delete API ngay lập tức
        }
    };

    const handleConfirmMoveAndDelete = (typeName, targetTypeName) => {
        callDeleteApi(typeName, targetTypeName);
        setTypeToDelete(null);
    };

    const onSubmit = async (data) => {
        try {
            const res = await updateIssueTypesApi(project._id, { issueTypes: data.issueTypes });
            if (res.EC === 0) {
                toast.success("Issue types updated successfully!");
                onTypesUpdate();
                onClose();
            } else {
                toast.error(res.EM || "Failed to update issue types.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
                        onClick={onClose}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                            className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Issue Types</h2>
                                <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                                    <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
                                <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                    {fields.map((field, index) => {
                                        const isTaskType = field.name === 'Task'; // Type "Task" mặc định không thể xóa để an toàn hệ thống

                                        return (
                                            <div key={field.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-md">
                                                <div className="flex justify-between items-start gap-3">
                                                    <div className="flex-grow space-y-2">
                                                        <input
                                                            {...register(`issueTypes.${index}.name`, { required: "Type name is required" })}
                                                            className={cn(
                                                                "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800",
                                                                isTaskType && "bg-slate-100 dark:bg-slate-700 cursor-not-allowed text-slate-500"
                                                            )}
                                                            placeholder="Issue Type Name"
                                                            disabled={isTaskType}
                                                        />
                                                        <textarea
                                                            {...register(`issueTypes.${index}.description`)}
                                                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-sm"
                                                            placeholder="Description (optional)"
                                                            rows="2"
                                                        />
                                                    </div>

                                                    {isTaskType ? (
                                                        <div className="w-9 h-9 flex-shrink-0"></div>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteClick(index)}
                                                            className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full mt-1 cursor-pointer"
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    type="button" onClick={() => append({ name: '', description: '' })}
                                    className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" /> Add Issue Type
                                </button>

                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button" onClick={onClose}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit" disabled={isSubmitting || isLoading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center w-32 cursor-pointer"
                                    >
                                        {isSubmitting || isLoading ? <ButtonSpinner /> : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <MoveIssuesModal
                isOpen={!!typeToDelete}
                onClose={() => setTypeToDelete(null)}
                itemToDelete={typeToDelete}
                availableItems={fields.filter(type => type.id !== typeToDelete?.id)}
                onConfirm={handleConfirmMoveAndDelete}
                type="type"
            />
        </>
    );
};

export default EditIssueTypesModal;