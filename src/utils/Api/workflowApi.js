import axios from '../axios.customize';

const createWorkflowApi = (projectId, workflowData) => {
    const URL_API = `/v1/api/workflows/project/${projectId}`;
    return axios.post(URL_API, workflowData);
};

const getWorkflowsByProjectApi = (projectId) => {
    const URL_API = `/v1/api/workflows/project/${projectId}`;
    return axios.get(URL_API);
};

const getWorkflowByIdApi = (workflowId) => {
    const URL_API = `/v1/api/workflows/${workflowId}`;
    return axios.get(URL_API);
};

const updateWorkflowApi = (workflowId, updateData) => {
    const URL_API = `/v1/api/workflows/${workflowId}`;
    return axios.put(URL_API, updateData);
};

const deleteWorkflowApi = (workflowId) => {
    const URL_API = `/v1/api/workflows/${workflowId}`;
    return axios.delete(URL_API);
};

const applyWorkflowToProjectApi = (projectId, workflowId) => {
    const URL_API = `/v1/api/workflows/project/${projectId}/apply`;
    return axios.post(URL_API, { workflowId });
};

export {
    createWorkflowApi,
    getWorkflowsByProjectApi,
    getWorkflowByIdApi,
    updateWorkflowApi,
    deleteWorkflowApi,
    applyWorkflowToProjectApi,
};