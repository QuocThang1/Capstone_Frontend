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

export {
    createIssueApi,
    getIssuesBySprintApi,
    getIssuesByProjectApi,
};