import axios from '../axios.customize';

const createIssueApi = (issueData) => {
    const URL_API = "/v1/api/issues";
    return axios.post(URL_API, issueData);
};


const getIssuesBySprintApi = (sprintId) => {
    const URL_API = `/v1/api/issues/sprint/${sprintId}`;
    return axios.get(URL_API);
};

const getIssuesByProjectApi = (projectId) => {
    const URL_API = `/v1/api/issues/project/${projectId}`;
    return axios.get(URL_API);
};

const updateIssueApi = (issueId, updateData) => {
    const URL_API = `/v1/api/issues/${issueId}`;
    return axios.put(URL_API, updateData);
};

const deleteIssueApi = (issueId) => {
    const URL_API = `/v1/api/issues/${issueId}`;
    return axios.delete(URL_API);
};

const createSubtaskApi = (subtaskData) => {
    const URL_API = "/v1/api/issues/subtask";
    return axios.post(URL_API, subtaskData);
};

const getSubtaskApi = (issueId) => {
    const URL_API = `/v1/api/issues/${issueId}/subtasks`;
    return axios.get(URL_API);
}

export {
    createIssueApi,
    getIssuesBySprintApi,
    getIssuesByProjectApi,
    updateIssueApi,
    deleteIssueApi,
    createSubtaskApi,
    getSubtaskApi,
};