import axios from '../axios.customize';

const createCommentApi = (commentData) => {
    const URL_API = "/v1/api/comments";
    return axios.post(URL_API, commentData);
};

const getCommentsByIssueApi = (issueId) => {
    const URL_API = `/v1/api/comments/issue/${issueId}`;
    return axios.get(URL_API);
};

const updateCommentApi = (commentId, content) => {
    const URL_API = `/v1/api/comments/${commentId}`;
    return axios.put(URL_API, { content });
};

const deleteCommentApi = (commentId) => {
    const URL_API = `/v1/api/comments/${commentId}`;
    return axios.delete(URL_API);
};

export {
    createCommentApi,
    getCommentsByIssueApi,
    updateCommentApi,
    deleteCommentApi,
};