import axios from "../axios.customize";

export const exportProjectExcelApi = (projectId) => {
  return axios.get(`/v1/api/projects/${projectId}/export/excel`, {
    responseType: "blob",
  });
};

export const exportProjectPdfApi = (projectId) => {
  return axios.get(`/v1/api/projects/${projectId}/export/pdf`, {
    responseType: "blob",
  });
};
