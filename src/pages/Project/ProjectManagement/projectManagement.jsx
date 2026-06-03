import { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProjectContext } from '../../../context/project.context';
import Spinner from '../../../components/spinner';
import CreateProjectModal from './createProjectModal';
import EditProjectModal from './editProjectModal';
import DeleteProjectModal from './deleteProjectModal';
import { useNavigate } from 'react-router-dom';
import { Search, MoreHorizontal, Edit, Trash2, Star } from 'lucide-react';

import { getStarredProjectsApi, toggleStarProjectApi } from '../../../utils/Api/accountApi';
import { toast } from 'react-toastify';
import { cn } from '../../../lib/utils';

const ProjectManagement = () => {
    const navigate = useNavigate();

    // Get state and functions from ProjectContext
    const {
        allProjects,
        loading,
        actionLoading,
        pagination,
        fetchAllProjects,
        createProject,
        updateProject,
        deleteProject,
    } = useContext(ProjectContext);

    // Local state for UI control
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    // Local state for search and pagination control
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    // Starred projects state
    const [starredProjects, setStarredProjects] = useState([]);
    const [starLoading, setStarLoading] = useState({}); // Use an object to track loading state per project

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
            setCurrentPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Fetch initial starred projects
    useEffect(() => {
        const fetchStarred = async () => {
            try {
                const res = await getStarredProjectsApi();
                if (res && res.EC === 0) {
                    // Assuming res.data is an array of project objects, we extract their IDs
                    setStarredProjects(res.data.map(p => p._id));
                } else {
                    toast.error(res.EM || "Could not fetch starred projects.");
                }
            } catch (error) {
                toast.error(error.message || "Failed to fetch starred projects.");
            }
        };
        fetchStarred();
    }, []);


    // Fetch projects when page or search term changes
    useEffect(() => {
        fetchAllProjects({ page: currentPage, limit: 5, search: debouncedSearchTerm });
    }, [currentPage, debouncedSearchTerm]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Modal Handlers
    const handleOpenEditModal = (project) => {
        setSelectedProject(project);
        setEditModalOpen(true);
        setActiveDropdown(null);
    };

    const handleOpenDeleteModal = (project) => {
        setSelectedProject(project);
        setDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    // CRUD Handlers using context functions
    const handleProjectCreated = async (projectData) => {
        const newProject = await createProject(projectData);
        if (newProject) {
            setCreateModalOpen(false);
            fetchAllProjects({ page: 1, limit: 5, search: "" }); // Refetch to show the new project
        }
    };

    const handleUpdateProject = async (projectId, data) => {
        const success = await updateProject(projectId, data);
        if (success) {
            setEditModalOpen(false);
            fetchAllProjects({ page: currentPage, limit: 5, search: debouncedSearchTerm }); // Refetch current page
        }
    };

    const handleDeleteProject = async () => {
        if (!selectedProject) return;
        const success = await deleteProject(selectedProject._id);
        if (success) {
            setDeleteModalOpen(false);
            // Refetch, adjusting page if it was the last item
            const newPage = allProjects.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            if (newPage !== currentPage) {
                setCurrentPage(newPage);
            } else {
                fetchAllProjects({ page: currentPage, limit: 5, search: debouncedSearchTerm });
            }
        }
        setSelectedProject(null);
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleToggleStar = async (e, projectId) => {
        e.stopPropagation();
        setStarLoading(prev => ({ ...prev, [projectId]: true }));
        try {
            const res = await toggleStarProjectApi(projectId);
            if (res && res.EC === 0) {
                // res.data now contains the updated list of starred project IDs
                setStarredProjects(res.data);
                toast.success(res.EM);
            } else {
                toast.error(res.EM || "Failed to update star status.");
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
        } finally {
            setStarLoading(prev => ({ ...prev, [projectId]: false }));
        }
    };

    // Memoize sorted projects to prevent re-sorting on every render
    const sortedProjects = useMemo(() => {
        if (!allProjects) return [];
        return [...allProjects].sort((a, b) => {
            const aIsStarred = starredProjects.includes(a._id);
            const bIsStarred = starredProjects.includes(b._id);
            if (aIsStarred && !bIsStarred) return -1;
            if (!aIsStarred && bIsStarred) return 1;
            return 0;
        });
    }, [allProjects, starredProjects]);


    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950 min-h-full text-slate-900 dark:text-slate-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Projects</h1>
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 dark:bg-indigo-500/40 dark:text-indigo-100 rounded-xl shadow-sm dark:shadow-indigo-500/10 hover:bg-indigo-700 dark:hover:bg-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 cursor-pointer transition-all duration-200"
                    >
                        Create project
                    </button>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>

                {/* Projects Table */}
                <div className="glass-card rounded-2xl overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64"><Spinner /></div>
                    ) : (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 w-12"><span className="sr-only">Star</span></th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Key</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Lead</th>
                                    <th scope="col" className="relative px-6 py-4"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {sortedProjects.length > 0 ? sortedProjects.map((project) => {
                                    const isStarred = starredProjects.includes(project._id);
                                    return (
                                        <tr key={project._id} onClick={() => navigate(`/projects/${project._id}`)} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-200 cursor-pointer">
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={(e) => handleToggleStar(e, project._id)}
                                                    disabled={starLoading[project._id]}
                                                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700/50 disabled:cursor-wait cursor-pointer transition-all duration-200"
                                                    aria-label={isStarred ? "Unstar project" : "Star project"}
                                                >
                                                    <Star className={cn("w-5 h-5 transition-all duration-200", isStarred ? "text-amber-400 fill-current" : "text-slate-400 hover:text-amber-400 dark:hover:text-amber-400")} />
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 rounded-lg transition-all duration-200">
                                                        <span className="text-indigo-700 dark:text-indigo-300 font-bold text-sm">{project.name.charAt(0).toUpperCase()}</span>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-slate-900 dark:text-slate-50 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200" onClick={(e) => { e.stopPropagation(); navigate(`/projects/${project._id}`) }}>
                                                            {project.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400">{project.key}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                                                {project.members.find(m => m.role === 'leader')?.accountId?.fullName || project.members[0]?.accountId?.fullName || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                                <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === project._id ? null : project._id); }} className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-all duration-200">
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                {activeDropdown === project._id && (
                                                    <div ref={dropdownRef} className="origin-top-right absolute right-0 mt-2 w-40 rounded-lg shadow-lg glass-card ring-1 ring-black dark:ring-white ring-opacity-5 dark:ring-opacity-10 focus:outline-none z-10">
                                                        <div className="py-1">
                                                            <button onClick={(e) => { e.stopPropagation(); handleOpenEditModal(project); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-all duration-200">
                                                                <Edit className="w-4 h-4" />
                                                                <span>Edit</span>
                                                            </button>
                                                            <button onClick={(e) => { e.stopPropagation(); handleOpenDeleteModal(project); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 cursor-pointer transition-all duration-200">
                                                                <Trash2 className="w-4 h-4" />
                                                                <span>Delete</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                }) : (
                                    <tr><td colSpan="5" className="text-center py-10 text-slate-500 dark:text-slate-400">No projects found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">&lt;</button>
                        <span className="px-4 text-sm text-slate-700 dark:text-slate-300">Page {currentPage} of {pagination.totalPages}</span>
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages} className="px-3 py-1 border border-slate-300 dark:border-slate-700 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">&gt;</button>
                    </div>
                )}
            </div>

            <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} onProjectCreated={handleProjectCreated} />
            {selectedProject && (
                <>
                    <EditProjectModal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} project={selectedProject} onProjectUpdated={handleUpdateProject} loading={actionLoading} />
                    <DeleteProjectModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleDeleteProject} loading={actionLoading} projectName={selectedProject.name} />
                </>
            )}
        </div>
    );
};

export default ProjectManagement;