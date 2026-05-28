import axios from '../axios.customize';

const createIssueApi = (issueData) => {
    const URL_API = "/v1/api/issues";
    return axios.post(URL_API, issueData);
};


const getIssuesBySprintApi = (sprintId) => {
    const URL_API = `/v1/api/issues/sprint/${sprintId}`;
    return axios.get(URL_API);
};

const getIssuesByProjectApi = (projectId, filters = {}) => {
    const URL_API = `/v1/api/issues/project/${projectId}`;
    return axios.get(URL_API, { params: filters });
};

const getMyIssuesByProjectApi = (projectId, filters = {}) => {
    const URL_API = `/v1/api/issues/my/project/${projectId}`;
    return axios.get(URL_API, { params: filters });
}

const getMyIssuesApi = (filters = {}) => {
    const URL_API = `/v1/api/issues/my/all`;
    return axios.get(URL_API, { params: filters });
}

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

const suggestAssigneesByAiApi = (issueId) => {
    const URL_API = `/v1/api/issues/${issueId}/suggest-assignees`;
    return axios.get(URL_API);
};

const uploadAttachmentApi = (issueId, formData) => {
    const URL_API = `/v1/api/issues/${issueId}/attachments`;
    return axios.post(URL_API, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const deleteAttachmentApi = (issueId, attachmentId) => {
    const URL_API = `/v1/api/issues/${issueId}/attachments/${attachmentId}`;
    return axios.delete(URL_API);
};

export {
    createIssueApi,
    getIssuesBySprintApi,
    getIssuesByProjectApi,
    getMyIssuesByProjectApi,
    getMyIssuesApi,
    updateIssueApi,
    deleteIssueApi,
    createSubtaskApi,
    getSubtaskApi,
    suggestAssigneesByAiApi,
    uploadAttachmentApi,
    deleteAttachmentApi,
};