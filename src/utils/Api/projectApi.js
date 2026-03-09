import axios from '../axios.customize';

const createProjectApi = (projectData) => {
    const URL_API = "/v1/api/projects";
    const data = {
        name: projectData.name,
        key: projectData.key,
        description: projectData.description,
        boardColumns: projectData.boardColumns,
        issueTypes: projectData.issueTypes,
    };
    return axios.post(URL_API, data);
};

const getAllProjectsApi = (params) => {
    const URL_API = "/v1/api/projects";
    return axios.get(URL_API, { params });
};

const getProjectByIdApi = (projectId) => {
    const URL_API = `/v1/api/projects/${projectId}`;
    return axios.get(URL_API);
};

const updateProjectApi = (projectId, projectData) => {
    const URL_API = `/v1/api/projects/${projectId}`;
    return axios.put(URL_API, projectData);
};

const deleteProjectApi = (projectId) => {
    const URL_API = `/v1/api/projects/${projectId}`;
    return axios.delete(URL_API);
};

const getMyProjectsApi = () => {
    const URL_API = "/v1/api/projects/my-projects";
    return axios.get(URL_API);
};

export {
    createProjectApi,
    getAllProjectsApi,
    getProjectByIdApi,
    updateProjectApi,
    deleteProjectApi,
    getMyProjectsApi,
};