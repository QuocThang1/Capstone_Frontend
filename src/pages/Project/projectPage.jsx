import { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjectByIdApi } from '../../utils/Api/projectApi';
import { getStarredProjectsApi, toggleStarProjectApi } from '../../utils/Api/accountApi';
import Spinner from '../../components/spinner';
import { toast } from 'react-toastify';
import { Book, LayoutDashboard, ListChecks, Star, MoreHorizontal, UserPlus, Columns, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

const ProjectPage = () => {
    const { projectId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isStarred, setIsStarred] = useState(false);
    const [starLoading, setStarLoading] = useState(false);

    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isAddMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [isEditBoardModalOpen, setEditBoardModalOpen] = useState(false);
    const [isEditIssueTypesModalOpen, setEditIssueTypesModalOpen] = useState(false);
    const menuRef = useRef(null);

    const activeTab = location.pathname.split('/').pop();

    const fetchProjectData = async () => {
        try {
            const projectRes = await getProjectByIdApi(projectId);
            if (projectRes && projectRes.EC === 0) {
                setProject(projectRes.data);
            } else {
                throw new Error(projectRes.EM || 'Project not found.');
            }
        } catch (err) {
            const errorMessage = err.message || 'Failed to fetch project data.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };


    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            await fetchProjectData(); // Fetch project data first

            try {
                const starredRes = await getStarredProjectsApi();
                if (starredRes && starredRes.EC === 0) {
                    const isProjectStarred = starredRes.data.some(p => p._id === projectId);
                    setIsStarred(isProjectStarred);
                } else {
                    console.error("Could not fetch starred projects:", starredRes.EM);
                }
            } catch (err) {
                console.error("Failed to fetch starred projects:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [projectId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    const handleTabClick = (tab) => {
        navigate(`/projects/${projectId}/${tab}`);
    };

    const handleToggleStar = async (e) => {
        e.stopPropagation();
        setStarLoading(true);
        try {
            const res = await toggleStarProjectApi(projectId);
            if (res && res.EC === 0) {
                const newIsStarred = res.data.includes(projectId);
                setIsStarred(newIsStarred);
                toast.success(res.EM);
            } else {
                toast.error(res.EM || "Failed to update star status.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setStarLoading(false);
        }
    };

    const openModal = (setter) => {
        setMenuOpen(false);
        setter(true);
    };

    const handleColumnsUpdate = (updatedColumns) => {
        setProject(prev => ({ ...prev, boardColumns: updatedColumns }));
    };

    const handleTypesUpdate = (updatedTypes) => {
        setProject(prev => ({ ...prev, issueTypes: updatedTypes }));
    };

    if (loading) {
        return <div className="flex items-center justify-center h-screen"><Spinner /></div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    if (!project) {
        return null;
    }

    const navItems = [
        { id: 'summary', label: 'Summary', icon: Book },
        { id: 'board', label: 'Board', icon: LayoutDashboard },
        { id: 'backlog', label: 'Backlog', icon: ListChecks },
    ];

    const menuItems = [
        { label: 'Add members', icon: UserPlus, action: () => openModal(setAddMemberModalOpen) },
        { label: 'Edit board columns', icon: Columns, action: () => openModal(setEditBoardModalOpen) },
        { label: 'Edit issue types', icon: Tag, action: () => openModal(setEditIssueTypesModalOpen) },
    ];

    return (
        <>
            <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
                <header className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Projects / {project.name}</p>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
                                <button
                                    onClick={handleToggleStar}
                                    disabled={starLoading}
                                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 disabled:cursor-wait cursor-pointer"
                                    aria-label={isStarred ? "Unstar project" : "Star project"}
                                >
                                    <Star className={cn("w-5 h-5 transition-colors", isStarred ? "text-yellow-400 fill-current" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")} />
                                </button>
                            </div>
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setMenuOpen(prev => !prev)} className="p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                                {isMenuOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                        <div className="py-1">
                                            {menuItems.map((item) => (
                                                <button
                                                    key={item.label}
                                                    onClick={item.action}
                                                    className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                                                >
                                                    <item.icon className="w-4 h-4" />
                                                    <span>{item.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <nav className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="max-w-7xl mx-auto flex items-center gap-4">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleTabClick(item.id)}
                                className={cn("flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer", activeTab === item.id ? "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800")}
                            >
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                <main className="flex-grow">
                    <div className="max-w-7xl mx-auto">
                        <Outlet context={{ project, fetchProjectData }} />
                    </div>
                </main>
            </div>

            {isAddMemberModalOpen && (
                <AddMemberModal
                    isOpen={isAddMemberModalOpen}
                    onClose={() => setAddMemberModalOpen(false)}
                    project={project}
                />
            )}
            {isEditBoardModalOpen && (
                <EditBoardColumnsModal
                    isOpen={isEditBoardModalOpen}
                    onClose={() => setEditBoardModalOpen(false)}
                    project={project}
                    onColumnsUpdate={handleColumnsUpdate}
                />
            )}
            {isEditIssueTypesModalOpen && (
                <EditIssueTypesModal
                    isOpen={isEditIssueTypesModalOpen}
                    onClose={() => setEditIssueTypesModalOpen(false)}
                    project={project}
                    onTypesUpdate={handleTypesUpdate}
                />
            )}
        </>
    );
};

export default ProjectPage;