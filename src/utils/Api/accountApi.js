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

export { signUpApi, loginApi, getAccountApi, updateProfileApi, sendOtpApi, verifyOtpApi };