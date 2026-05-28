import axios from '../axios.customize';

const signUpApi = (userData) => {
    const URL_API = "/v1/api/account/register";
    return axios.post(URL_API, userData);
};

const loginApi = (usernameOrEmail, password) => {
    const URL_API = "/v1/api/account/login";
    const data = {
        usernameOrEmail: usernameOrEmail,
        password: password,
    };

    return axios.post(URL_API, data);
};

const getAccountApi = () => {
    const URL_API = "/v1/api/account/get-account";
    return axios.get(URL_API);
};

const updateProfileApi = (profileData) => {
    const URL_API = "/v1/api/account/profile";
    const data = {
        username: profileData.username,
        fullName: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        dob: profileData.dob,
        gender: profileData.gender,
        skills: profileData.skills,
    };
    return axios.put(URL_API, data);
};

const sendOtpApi = (email) => {
    const URL_API = "/v1/api/account/send-otp";
    return axios.post(URL_API, { email });
};

const verifyOtpApi = (email, otp) => {
    const URL_API = "/v1/api/account/verify-otp";
    return axios.post(URL_API, { email, otp });
};

const toggleStarProjectApi = (projectId) => {
    const URL_API = `/v1/api/account/toggle-star`;
    return axios.post(URL_API, { projectId });
};

const getStarredProjectsApi = () => {
    const URL_API = `/v1/api/account/starred-projects`;
    return axios.get(URL_API);
};

const googleLoginApi = (authCode) => {
    const URL_API = "/v1/api/auth/google";
    return axios.post(URL_API, { code: authCode });
};

const forgotPasswordApi = (email, otp, newPassword) => {
    const URL_API = "/v1/api/account/forgot-password";
    return axios.post(URL_API, { email, otp, newPassword });
};

const changePasswordApi = (oldPassword, otp, newPassword) => {
    const URL_API = "/v1/api/account/change-password";
    return axios.post(URL_API, { oldPassword, otp, newPassword });
};

const githubLoginApi = (code) => {
    const URL_API = "/v1/api/auth/github";
    return axios.post(URL_API, { code });
};

export {
    signUpApi,
    loginApi,
    getAccountApi,
    updateProfileApi,
    sendOtpApi,
    verifyOtpApi,
    toggleStarProjectApi,
    getStarredProjectsApi,
    githubLoginApi,
    googleLoginApi,
    forgotPasswordApi,
    changePasswordApi
};