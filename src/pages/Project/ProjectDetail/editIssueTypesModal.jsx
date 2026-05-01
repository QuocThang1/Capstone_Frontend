import { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { updateIssueTypesApi } from '../../../utils/Api/projectApi';
import { X, Plus, Trash2 } from 'lucide-react';
import ButtonSpinner from '../../../components/ButtonSpinner';

const EditIssueTypesModal = ({ isOpen, onClose, project, onTypesUpdate }) => {
    const { register, control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            issueTypes: project?.issueTypes || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "issueTypes"
    });

    useEffect(() => {
        if (isOpen && project?.issueTypes) {
            reset({ issueTypes: project.issueTypes });
        }
    }, [project, reset, isOpen]);

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
                        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
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
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-3 border border-slate-200 dark:border-slate-700 rounded-md">
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-grow space-y-2">
                                                <input
                                                    {...register(`issueTypes.${index}.name`, { required: "Type name is required" })}
                                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800"
                                                    placeholder="Issue Type Name"
                                                />
                                                <textarea
                                                    {...register(`issueTypes.${index}.description`)}
                                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-sm"
                                                    placeholder="Description (optional)"
                                                    rows="2"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full mt-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => append({ name: '', description: '' })}
                                className="mt-4 flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                Add Issue Type
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
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center w-32 cursor-pointer"
                                >
                                    {isSubmitting ? <ButtonSpinner /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EditIssueTypesModal;