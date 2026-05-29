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

const addMemberToProjectApi = (projectId, email, role = 'member') => {
    const URL_API = `/v1/api/projects/${projectId}/members`;
    return axios.post(URL_API, { email, role });
};

const respondToInvitationApi = (token) => {
    const URL_API = `/v1/api/projects/respond-invite`;
    return axios.post(URL_API, { token });
};

const removeMemberApi = (projectId, accountId) => {
    const URL_API = `/v1/api/projects/${projectId}/members/${accountId}`;
    return axios.delete(URL_API);
};


const getProjectMembersApi = (projectId) => {
    const URL_API = `/v1/api/projects/${projectId}/members`;
    return axios.get(URL_API);
};

const updateBoardColumnsApi = (projectId, boardColumns) => {
    const URL_API = `/v1/api/projects/${projectId}/board-columns`;
    return axios.put(URL_API, boardColumns);
};

const deleteBoardColumnApi = (projectId, columnName, targetColumnName = null) => {
    const URL_API = `/v1/api/projects/${projectId}/board-columns/${encodeURIComponent(columnName)}`;

    const data = {};
    if (targetColumnName) {
        data.targetColumnName = targetColumnName;
    }

    return axios.delete(URL_API, { data });
};

const updateIssueTypesApi = (projectId, issueTypes) => {
    const URL_API = `/v1/api/projects/${projectId}/issue-types`;
    return axios.put(URL_API, issueTypes);
};

const deleteIssueTypeApi = (projectId, issueTypeName, targetTypeName = null) => {
    const URL_API = `/v1/api/projects/${projectId}/issue-types/${encodeURIComponent(issueTypeName)}`;
    const data = {};

    if (targetTypeName) {
        data.targetTypeName = targetTypeName;
    }

    return axios.delete(URL_API, { data });
}
export {
    createProjectApi,
    getAllProjectsApi,
    getProjectByIdApi,
    updateProjectApi,
    deleteProjectApi,
    addMemberToProjectApi,
    respondToInvitationApi,
    removeMemberApi,
    getProjectMembersApi,
    updateBoardColumnsApi,
    updateIssueTypesApi,
    deleteIssueTypeApi,
    deleteBoardColumnApi,
};