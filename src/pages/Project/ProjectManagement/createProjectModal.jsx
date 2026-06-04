import { useForm } from 'react-hook-form';
import ButtonSpinner from '../../../components/ButtonSpinner';
import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectContext } from '../../../context/project.context';
import { createSmartProjectApi } from '../../../utils/Api/projectApi';
import { toast } from 'react-toastify';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const { actionLoading, fetchAllProjects } = useContext(ProjectContext);

    // AI States
    const [mode, setMode] = useState('manual'); // 'manual' or 'ai'
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    const projectKey = watch('key', '');

    useEffect(() => {
        if (!isOpen) {
            reset();
            setMode('manual');
            setAiPrompt('');
            setIsGenerating(false);
        }
    }, [isOpen, reset]);

    const onSubmitManual = (data) => {
        onProjectCreated(data);
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt || aiPrompt.trim().length < 10) {
            toast.error("Please provide a more detailed description (at least 10 characters).");
            return;
        }
        setIsGenerating(true);
        try {
            // Đẩy thẳng prompt lên API tạo luôn project nháp
            const res = await createSmartProjectApi(aiPrompt);
            if (res && res.EC === 0) {
                toast.success("Project drafted successfully! Redirecting to board...");
                if (fetchAllProjects) fetchAllProjects();
                onClose();
                // res.data.project._id is returned from backend
                navigate(`/projects/${res.data.project._id}/overview`);
            } else {
                toast.error(res.EM || "Failed to generate project structure.");
            }
        } catch (error) {
            toast.error(error.response?.data?.EM || "Error connecting to the service.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-md shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header with Mode Toggle */}
                <div className="flex justify-between items-center p-5 border-b border-slate-200 bg-white">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-bold text-slate-800">Create Project</h2>
                        <div className="flex bg-slate-100 p-1 rounded-md">
                            <button
                                onClick={() => setMode('manual')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${mode === 'manual' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`}
                            >
                                Standard
                            </button>
                            <button
                                onClick={() => setMode('ai')}
                                className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${mode === 'ai' ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100' : 'text-slate-600 hover:text-indigo-600'}`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Smart Setup
                            </button>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-md hover:bg-slate-100 cursor-pointer">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow overflow-y-auto bg-slate-50">
                    {mode === 'manual' ? (
                        <form id="manual-form" onSubmit={handleSubmit(onSubmitManual)} className="flex flex-col md:flex-row h-full">
                            {/* Left Side - Form */}
                            <div className="w-full md:w-1/2 p-8 space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                        Project Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register("name", { required: "Project name is required" })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                        placeholder="E.g., HRM System"
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
                                                message: "Key must be 2-10 uppercase letters or numbers (e.g., 'HRM')."
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition uppercase"
                                        placeholder="E.g., HRM"
                                    />
                                    {errors.key && <p className="text-red-500 text-xs mt-1">{errors.key.message}</p>}
                                    <p className="text-xs text-slate-500 mt-1">The project key is used as the prefix for your project's issues (e.g., HRM-1).</p>
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
                            <div className="w-full md:w-1/2 p-8 flex flex-col items-center justify-center border-l border-slate-200 bg-slate-50/50">
                                <div className="w-full rounded-xl shadow-md border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
                                    <div className="flex items-center gap-2 mb-5">
                                        <span className="h-3 w-3 rounded-full bg-red-400" />
                                        <span className="h-3 w-3 rounded-full bg-amber-400" />
                                        <span className="h-3 w-3 rounded-full bg-emerald-400" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["To Do", "In Progress", "Done"].map((column) => (
                                            <div key={column} className="rounded-lg bg-white/85 border border-slate-200 p-3 min-h-32">
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">{column}</p>
                                                <div className="mt-3 space-y-2">
                                                    <div className="h-8 rounded-md bg-indigo-100 border border-indigo-200" />
                                                    <div className="h-8 rounded-md bg-slate-100 border border-slate-200" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 w-full text-center bg-white border border-slate-200 text-slate-700 rounded-xl p-5 shadow-sm">
                                    <p className="font-semibold text-lg">Create a new project</p>
                                    <p className="text-sm mt-2 text-slate-500">
                                        Your issues will look like <span className="font-mono bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-700 font-bold">{(projectKey || '').toUpperCase() || 'PROJ'}-1</span>.
                                    </p>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="h-full flex flex-col p-8">
                            <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full">
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        Describe your project requirements
                                    </h3>
                                    <p className="text-slate-600 mt-2">
                                        Provide a brief description of the project you want to build. The system will automatically configure your Kanban board, sprints, issues, and subtasks, and take you to the project board to review.
                                    </p>
                                </div>
                                <textarea
                                    value={aiPrompt}
                                    onChange={(e) => setAiPrompt(e.target.value)}
                                    disabled={isGenerating}
                                    className="w-full flex-1 p-4 border border-slate-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-base resize-none shadow-sm disabled:bg-slate-100 disabled:text-slate-500"
                                    placeholder="E.g., I want to build a hospital management system. It needs features for patient registration, electronic health records management, and doctor scheduling..."
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center p-5 border-t border-slate-200 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isGenerating}
                        className="px-5 py-2 cursor-pointer text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    {mode === 'manual' ? (
                        <button
                            type="submit"
                            form="manual-form"
                            disabled={actionLoading}
                            className="ml-3 inline-flex  justify-center px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {actionLoading ? <ButtonSpinner /> : "Create Project"}
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={handleGenerateAI}
                                disabled={isGenerating || !aiPrompt.trim()}
                                className="ml-3 inline-flex items-center justify-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                {isGenerating ? (
                                    <>
                                        <ButtonSpinner />
                                        <span>Generating & Setting Up...</span>
                                    </>
                                ) : (
                                    <>
                                        Generate Smart Setup
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
