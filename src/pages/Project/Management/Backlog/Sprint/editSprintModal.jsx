import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import ButtonSpinner from '../../../../../components/ButtonSpinner';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

const EditSprintModal = ({ isOpen, onClose, onUpdate, loading, sprint }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (sprint) {
            reset({
                name: sprint.name || '',
                startDate: sprint.startDate ? new Date(sprint.startDate).toISOString().split('T')[0] : '',
                endDate: sprint.endDate ? new Date(sprint.endDate).toISOString().split('T')[0] : '',
                goal: sprint.goal || '',
            });
        }
    }, [sprint, reset, isOpen]); // Thêm isOpen để reset form mỗi khi modal mở

    if (!isOpen) return null;

    const onSubmit = (data) => {
        onUpdate(sprint._id, data);
    };

    const inputStyle = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white";

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="glass-card rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-t-xl transition-colors duration-300">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 transition-colors duration-300">
                            Edit Sprint
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            <X className="w-6 h-6 text-slate-600 dark:text-slate-400 transition-colors duration-200" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Sprint name</label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: "Sprint name is required" })}
                                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200"
                                />
                                {errors.name && <p className="text-rose-500 dark:text-rose-400 text-xs mt-1 transition-colors duration-300">{errors.name.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Start date</label>
                                    <input id="startDate" type="date" {...register("startDate")} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200" />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">End date</label>
                                    <input id="endDate" type="date" {...register("endDate")} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="goal" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 transition-colors duration-300">Sprint goal (optional)</label>
                                <textarea id="goal" rows="4" {...register("goal")} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 px-6 py-4 bg-white dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl transition-colors duration-300">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 hover:shadow-md transition-all duration-200 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 dark:bg-indigo-500/40 rounded-md shadow-sm hover:bg-indigo-700 dark:hover:bg-indigo-500/60 hover:shadow-lg hover:shadow-indigo-500/20 disabled:bg-indigo-400 dark:disabled:bg-indigo-500/20 flex items-center justify-center cursor-pointer w-28 transition-all duration-200"
                        >
                            {loading ? <ButtonSpinner text="Updating..." /> : 'Update'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditSprintModal;