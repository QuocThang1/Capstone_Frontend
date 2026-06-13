import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectContext } from '../../context/project.context';
import { toast } from 'react-toastify';
import ButtonSpinner from '../ButtonSpinner';
import { confirmSmartProjectApi, deleteProjectApi } from '../../utils/Api/projectApi';

const FloatingReviewBanner = ({ project, fetchProjectData }) => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { fetchAllProjects } = useContext(ProjectContext);

    if (!project || !project.isAiDraft) return null;

    const handleKeep = async () => {
        setIsLoading(true);
        try {
            const res = await confirmSmartProjectApi(project._id);
            if (res && res.EC === 0) {
                toast.success("Project confirmed and saved!");
                fetchAllProjects();
                fetchProjectData();
            } else {
                toast.error(res.EM || "Failed to confirm project.");
            }
        } catch (error) {
            toast.error("Error confirming project.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDiscard = async () => {
        setIsLoading(true);
        try {
            const res = await deleteProjectApi(project._id);
            if (res && res.EC === 0) {
                toast.info("Draft project discarded.");
                fetchAllProjects();
                navigate("/projects");
            } else {
                toast.error(res.EM || "Failed to discard project.");
                setIsLoading(false);
            }
        } catch (error) {
            toast.error("Error discarding project.");
            setIsLoading(false);
        }
    };



    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-2xl border border-indigo-100 flex items-center gap-4 px-6 py-3 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span className="text-sm font-semibold text-slate-800">
                    AI Draft Review Mode
                </span>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            <div className="flex gap-2">
                <button
                    onClick={handleDiscard}
                    disabled={isLoading}
                    className="px-4 py-1.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                >
                    Discard
                </button>

                <button
                    onClick={handleKeep}
                    disabled={isLoading}
                    className="px-5 py-1.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                    {isLoading && <ButtonSpinner />}
                    Keep Project
                </button>
            </div>
        </div>
    );
};

export default FloatingReviewBanner;
