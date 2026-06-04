import axios from '../axios.customize';

const getAllUsersApi = (params) => {
    const URL_API = "/v1/api/users";
    return axios.get(URL_API, { params });
};

const getUserByIdApi = (userId) => {
    const URL_API = `/v1/api/users/${userId}`;
    return axios.get(URL_API);
};

const createUserApi = (userData) => {
    const URL_API = "/v1/api/users";
    const data = {
        username: userData.username,
        password: userData.password,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        gender: userData.gender,
        role: userData.role,
        active: userData.active,
    };
    return axios.post(URL_API, data);
};

const updateUserApi = (userId, userData) => {
    const URL_API = `/v1/api/users/${userId}`;
    const data = {
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        gender: userData.gender,
        role: userData.role,
        active: userData.active,
    };

    // Chỉ thêm password nếu có
    if (userData.password) {
        data.password = userData.password;
    }

    // Thêm avatar nếu có
    if (userData.avatar) {
        data.avatar = userData.avatar;
    }

    // Thêm bio nếu có
    if (userData.bio) {
        data.bio = userData.bio;
    }

    if (userData.skills !== undefined) {
        data.skills = userData.skills;
    }

    return axios.put(URL_API, data);
};

const toggleUserStatusApi = (userId) => {
    const URL_API = `/v1/api/users/${userId}/toggle-status`;
    return axios.patch(URL_API);
};

const deleteUserApi = (userId) => {
    const URL_API = `/v1/api/users/${userId}`;
    return axios.delete(URL_API);
};

export {
    getAllUsersApi,
    getUserByIdApi,
    createUserApi,
    updateUserApi,
    toggleUserStatusApi,
    deleteUserApi
};