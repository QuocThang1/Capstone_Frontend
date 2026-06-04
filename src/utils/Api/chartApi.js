import axios from '../axios.customize';

const getBurndownChartApi = (projectId, sprintId) => {
    const URL_API = `/v1/api/projects/${projectId}/charts/burndown`;
    return axios.get(URL_API, { params: { sprintId } });
};

const getIssueTypeChartApi = (projectId, sprintId) => {
    const URL_API = `/v1/api/projects/${projectId}/charts/issue-type`;
    return axios.get(URL_API, { params: { sprintId } });
};

const getWorkloadChartApi = (projectId, sprintId) => {
    const URL_API = `/v1/api/projects/${projectId}/charts/workload`;
    return axios.get(URL_API, { params: { sprintId } });
};

const getVelocityChartApi = (projectId, sprintId) => {
    const URL_API = `/v1/api/projects/${projectId}/charts/velocity`;
    return axios.get(URL_API, { params: { sprintId } });
};

export {
    getBurndownChartApi,
    getIssueTypeChartApi,
    getWorkloadChartApi,
    getVelocityChartApi
};
