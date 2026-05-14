import axios from '../axios.customize';

const getAllBottlenecksApi = () => {
    const URL_API = "/v1/api/bottlenecks";
    return axios.get(URL_API);
}

const getBottlenecksByProjectApi = (projectId) => {
    const URL_API = `/v1/api/bottlenecks/project/${projectId}`;
    return axios.get(URL_API);
}

const getMyBottlenecksApi = () => {
    const URL_API = `/v1/api/bottlenecks/my-bottlenecks`;
    return axios.get(URL_API);
}

const getBottleneckByIssueApi = (issueId) => {
    const URL_API = `/v1/api/bottlenecks/issue/${issueId}`;
    return axios.get(URL_API);
}

export {
    getAllBottlenecksApi,
    getBottlenecksByProjectApi,
    getMyBottlenecksApi,
    getBottleneckByIssueApi,
};