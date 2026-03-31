import { useForm } from 'react-hook-form';
import ButtonSpinner from '../../components/ButtonSpinner';
import { useEffect, useContext } from 'react';
import { ProjectContext } from '../../context/project.context';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const { actionLoading } = useContext(ProjectContext); // Get loading state from context

    const projectKey = watch('key', '');

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    // The onSubmit function now just calls the callback
    const onSubmit = (data) => {
        onProjectCreated(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="relative bg-white w-screen h-screen flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">Create Project</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row h-full">
                        {/* Left Side - Form */}
                        <div className="w-full md:w-1/2 p-8 space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                    Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    {...register("name", { required: "Project name is required" })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="E.g., Marketing Campaign"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="key" className="block text-sm font-medium text-slate-700 mb-1">
                                    Key <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="key"
                                    {...register("key", {
                                        required: "Project key is required",
                                        pattern: {
                                            value: /^[A-Z0-9]{2,10}$/,
                                            message: "Key must be 2-10 uppercase letters or numbers (e.g., 'PROJ')."
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition uppercase"
                                    placeholder="E.g., PROJ"
                                />
                                {errors.key && <p className="text-red-500 text-xs mt-1">{errors.key.message}</p>}
                                <p className="text-xs text-slate-500 mt-1">The project key is a unique identifier for your project's issues.</p>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    {...register("description")}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    placeholder="Describe your project..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Right Side - Illustration */}
                        <div className="w-full md:w-1/2 bg-slate-50 p-8 flex flex-col items-center justify-center border-l border-slate-200">
                            <img
                                src="https://jira-clone.fly.dev/static/media/project-illustration.0f207c41cf549450b4b5.svg"
                                alt="Project Illustration"
                                className="max-w-xs w-full"
                            />
                            <div className="mt-6 text-center bg-indigo-100 border border-indigo-200 text-indigo-800 rounded-md p-4">
                                <p className="font-semibold">You're creating a new project!</p>
                                <p className="text-sm mt-1">
                                    Your project issues will be identified by a key, like <span className="font-mono bg-indigo-200 px-1 rounded">{projectKey.toUpperCase() || 'PROJ'}-1</span>.
                                </p>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center p-5 border-t border-slate-200 bg-slate-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        disabled={actionLoading}
                        className="ml-3 inline-flex justify-center px-6 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {actionLoading ? <ButtonSpinner /> : "Create Project"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;