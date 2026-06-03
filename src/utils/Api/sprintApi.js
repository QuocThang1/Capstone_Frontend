import axios from '../axios.customize';


const createSprintApi = (projectId, sprintData) => {
    const URL_API = `/v1/api/sprints/project/${projectId}`;
    return axios.post(URL_API, sprintData);
};

const getSprintsByProjectApi = (projectId) => {
    const URL_API = `/v1/api/sprints/project/${projectId}`;
    return axios.get(URL_API);
};

const updateSprintApi = (sprintId, sprintData) => {
    const URL_API = `/v1/api/sprints/${sprintId}`;
    return axios.put(URL_API, sprintData);
};

const deleteSprintApi = (sprintId) => {
    const URL_API = `/v1/api/sprints/${sprintId}`;
    return axios.delete(URL_API);
};

const startSprintApi = (sprintId) => {
    const URL_API = `/v1/api/sprints/${sprintId}/start`;
    return axios.post(URL_API);
}

const completeSprintApi = (sprintId) => {
    const URL_API = `/v1/api/sprints/${sprintId}/complete`;
    return axios.post(URL_API);
}

const getOccupiedSprintsRangeApi = (projectId) => {
    const URL_API = `/v1/api/sprints/project/${projectId}/occupied-ranges`;
    return axios.get(URL_API);
};

export {
    createSprintApi,
    getSprintsByProjectApi,
    updateSprintApi,
    deleteSprintApi,
    startSprintApi,
    completeSprintApi,
    getOccupiedSprintsRangeApi,
};