import axios from '../axios.customize';

const getNotificationsApi = (userId) => {
    const URL_API = `/v1/api/notifications`;
    return axios.get(URL_API);
}

const deleteNotificationApi = (notificationId) => {
    const URL_API = `/v1/api/notifications/${notificationId}`;
    return axios.delete(URL_API);
}

export {
    getNotificationsApi,
    deleteNotificationApi,
}
