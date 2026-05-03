import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import ButtonSpinner from '../../../../components/ButtonSpinner';

const CreateProcessflowModal = ({ isOpen, onClose, onCreate, loading }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (isOpen) {
            reset({ name: '' });
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    return (
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
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700"
                onClick={e => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit(onCreate)} noValidate>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Workflow</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                            <X className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                        </button>
                    </div>

                    <div className="p-6">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Workflow name</label>
                        <input
                            id="name"
                            type="text"
                            {...register("name", { required: "Workflow name is required" })}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            autoFocus
                        />
                        {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div className="flex justify-end gap-4 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 rounded-b-xl">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 transition-all cursor-pointer">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 flex items-center justify-center w-28 cursor-pointer">
                            {loading ? <ButtonSpinner /> : 'Create'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default CreateProcessflowModal;