import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import ButtonSpinner from '../../../../../components/ButtonSpinner';
import { X } from 'lucide-react';

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
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-lg border-2 border-slate-300 dark:border-slate-700">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    {/* Modal Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                            Edit Sprint
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                            <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sprint name</label>
                                <input
                                    id="name"
                                    type="text"
                                    {...register("name", { required: "Sprint name is required" })}
                                    className={inputStyle}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Start date</label>
                                    <input id="startDate" type="date" {...register("startDate")} className={inputStyle} />
                                </div>
                                <div>
                                    <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">End date</label>
                                    <input id="endDate" type="date" {...register("endDate")} className={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="goal" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sprint goal (optional)</label>
                                <textarea id="goal" rows="4" {...register("goal")} className={inputStyle}></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex justify-end gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center cursor-pointer w-28"
                        >
                            {loading ? <ButtonSpinner text="Updating..." /> : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSprintModal;