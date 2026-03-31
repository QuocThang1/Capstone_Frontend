import { createContext } from "react";

export const ProjectContext = createContext({
    allProjects: [],
    loading: false,
    actionLoading: false,
    pagination: { page: 1, totalPages: 1 },
    fetchAllProjects: () => { },
    createProject: () => { },
    updateProject: () => { },
    deleteProject: () => { },
});