import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import {
    getAllProjectsApi,
    createProjectApi,
    updateProjectApi,
    deleteProjectApi
} from '../utils/Api/projectApi';
import { AuthContext } from './auth.context';
import { ProjectContext } from './project.context';

export const ProjectProvider = ({ children }) => {
    const { auth } = useContext(AuthContext);

    const [allProjects, setAllProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

    const fetchAllProjects = async (params) => {
        if (!auth.isAuthenticated) return;
        setLoading(true);
        try {
            const res = await getAllProjectsApi(params);
            if (res && res.EC === 0) {
                setAllProjects(res.data.projects);
                setPagination({
                    page: res.data.currentPage,
                    totalPages: res.data.totalPages,
                });
            } else {
                toast.error(res.EM || "Failed to fetch all projects.");
            }
        } catch (error) {
            console.error("Error fetching all projects:", error);
            toast.error("An error occurred while fetching all projects.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchAllProjects();
        } else {
            setAllProjects([]);
            setPagination({ page: 1, totalPages: 1 });
        }
    }, [auth.isAuthenticated]);

    const createProject = async (projectData) => {
        setActionLoading(true);
        try {
            const res = await createProjectApi(projectData);
            if (res && res.EC === 0) {
                toast.success("Project created successfully!");
                fetchAllProjects();
                return res.data;
            } else {
                toast.error(res.EM || "Failed to create project.");
                return null;
            }
        } catch (error) {
            toast.error(error?.response?.data?.EM || "An error occurred.");
            return null;
        } finally {
            setActionLoading(false);
        }
    };

    const updateProject = async (projectId, projectData) => {
        setActionLoading(true);
        try {
            const res = await updateProjectApi(projectId, projectData);
            if (res && res.EC === 0) {
                toast.success("Project updated successfully!");
                fetchAllProjects();
                return res.data;
            } else {
                toast.error(res.EM || "Failed to update project.");
                return null;
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while updating the project.");
            return null;
        } finally {
            setActionLoading(false);
        }
    };

    const deleteProject = async (projectId) => {
        setActionLoading(true);
        try {
            const res = await deleteProjectApi(projectId);
            if (res && res.EC === 0) {
                toast.success("Project deleted successfully!");
                fetchAllProjects();
                return true;
            } else {
                toast.error(res.EM || "Failed to delete project.");
                return false;
            }
        } catch (error) {
            toast.error(error.message || "An error occurred while deleting the project.");
            return false;
        } finally {
            setActionLoading(false);
        }
    };

    const value = {
        allProjects,
        loading,
        actionLoading,
        pagination,
        fetchAllProjects,
        createProject,
        updateProject,
        deleteProject,
    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};