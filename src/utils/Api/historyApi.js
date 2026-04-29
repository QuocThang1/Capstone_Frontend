import axios from '../axios.customize';

const getHistoryByIssueApi = (issueId) => {
    const URL_API = `/v1/api/history/issue/${issueId}`;
    return axios.get(URL_API);
}

export {
    getHistoryByIssueApi,
};