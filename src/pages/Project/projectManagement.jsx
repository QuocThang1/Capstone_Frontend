import { useState, useEffect } from 'react';
import { getAllProjectsApi } from '../../utils/Api/projectApi';
import { toast } from 'react-toastify';
import Spinner from '../../components/spinner';
import CreateProjectModal from './createProjectModal';
import { useNavigate } from 'react-router-dom';

const ProjectManagement = () => {
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Search and Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Debounce search term
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms delay

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);


    const fetchProjects = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 5, // Show 5 projects per page
                search: debouncedSearchTerm,
            };
            const res = await getAllProjectsApi(params);
            if (res && res.EC === 0) {
                setProjects(res.data.projects);
                setTotalPages(res.data.totalPages);
            } else {
                toast.error(res.EM);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
            toast.error("An error occurred while fetching projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [currentPage, debouncedSearchTerm]);

    const handleProjectCreated = () => {
        fetchProjects();
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };


    return (
        <div className="p-8 bg-gray-100 min-h-full">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-[#101A17]">Projects</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-5 py-2 text-sm font-semibold text-[#101A17] bg-[#4ADE80] rounded-md shadow-sm hover:bg-[#3dbb6d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4ADE80] cursor-pointer transition-colors"
                        >
                            Create project
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-sm pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#4ADE80] focus:border-transparent transition"
                        />
                    </div>
                </div>

                {/* Projects Table */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Spinner />
                        </div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lead</th>
                                    <th scope="col" className="relative px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {projects.length > 0 ? projects.map((project) => (
                                    <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-green-100 rounded-md">
                                                    <span className="text-green-800 font-bold">{project.name.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900 cursor-pointer hover:underline" onClick={() => navigate(`/projects/${project._id}`)}>
                                                        {project.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{project.key}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {project.members.find(m => m.role === 'leader')?.accountId?.fullName || project.members[0]?.accountId?.fullName || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                                {/* Three dots icon */}
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-10 text-gray-500">No projects found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-6">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            &lt;
                        </button>
                        <span className="px-4 text-sm text-gray-700">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            &gt;
                        </button>
                    </div>
                )}
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />
        </div>
    );
};

export default ProjectManagement;