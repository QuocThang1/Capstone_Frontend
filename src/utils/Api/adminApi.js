import axios from '../axios.customize';

// ========== ORGANIZATIONS ==========
export const getAllOrganizationsApi = (params) => {
  return axios.get("/v1/api/admin/organizations", { params });
};

export const getOrganizationByIdApi = (orgId) => {
  return axios.get(`/v1/api/admin/organizations/${orgId}`);
};

export const createOrganizationApi = (data) => {
  return axios.post("/v1/api/admin/organizations", data);
};

export const updateOrganizationApi = (orgId, data) => {
  return axios.put(`/v1/api/admin/organizations/${orgId}`, data);
};

export const deleteOrganizationApi = (orgId) => {
  return axios.delete(`/v1/api/admin/organizations/${orgId}`);
};

export const toggleOrganizationStatusApi = (orgId) => {
  return axios.patch(`/v1/api/admin/organizations/${orgId}/toggle-status`);
};

// ========== PLATFORM USERS ==========
export const getAllPlatformUsersApi = (params) => {
  return axios.get("/v1/api/users", { params });
};

export const getPlatformUserByIdApi = (userId) => {
  return axios.get(`/v1/api/users/${userId}`);
};

export const createPlatformUserApi = (data) => {
  return axios.post("/v1/api/users", data);
};

export const updatePlatformUserApi = (userId, data) => {
  return axios.put(`/v1/api/users/${userId}`, data);
};

export const togglePlatformUserLockApi = (userId) => {
  return axios.patch(`/v1/api/users/${userId}/toggle-status`);
};

export const deletePlatformUserApi = (userId) => {
  return axios.delete(`/v1/api/users/${userId}`);
};

export const impersonateUserApi = (userId) => {
  return axios.post(`/v1/api/admin/platform-users/${userId}/impersonate`);
};

// ========== SUPPORT TICKETS ==========
export const getAllSupportTicketsApi = (params) => {
  return axios.get("/v1/api/admin/support-tickets", { params });
};

export const getSupportTicketByIdApi = (ticketId) => {
  return axios.get(`/v1/api/admin/support-tickets/${ticketId}`);
};

export const updateSupportTicketApi = (ticketId, data) => {
  return axios.put(`/v1/api/admin/support-tickets/${ticketId}`, data);
};

export const closeSupportTicketApi = (ticketId) => {
  return axios.patch(`/v1/api/admin/support-tickets/${ticketId}/close`);
};

export const assignSupportTicketApi = (ticketId, assigneeId) => {
  return axios.patch(`/v1/api/admin/support-tickets/${ticketId}/assign`, { assigneeId });
};

// ========== AUDIT LOGS ==========
export const getAllAuditLogsApi = (params) => {
  return axios.get("/v1/api/admin/audit-logs", { params });
};

export const getAuditLogByIdApi = (logId) => {
  return axios.get(`/v1/api/admin/audit-logs/${logId}`);
};

export const exportAuditLogsApi = (params) => {
  return axios.get("/v1/api/admin/audit-logs/export", { params, responseType: 'blob' });
};

// ========== SYSTEM HEALTH ==========
export const getSystemHealthApi = () => {
  return axios.get("/v1/api/admin/system/health");
};

export const runHealthCheckApi = () => {
  return axios.post("/v1/api/admin/system/health-check");
};

export const getSystemMetricsApi = () => {
  return axios.get("/v1/api/admin/system/metrics");
};

// ========== GLOBAL NOTIFICATIONS ==========
export const createGlobalNotificationApi = (data) => {
  return axios.post("/v1/api/admin/notifications/global", data);
};

export const getAllGlobalNotificationsApi = (params) => {
  return axios.get("/v1/api/admin/notifications/global", { params });
};

export const deleteGlobalNotificationApi = (notifId) => {
  return axios.delete(`/v1/api/admin/notifications/global/${notifId}`);
};

// ========== DATA SECURITY & PRIVACY ==========
export const getAllDataRequestsApi = (params) => {
  return axios.get("/v1/api/admin/data-requests", { params });
};

export const getDataRequestByIdApi = (requestId) => {
  return axios.get(`/v1/api/admin/data-requests/${requestId}`);
};

export const approveDataRequestApi = (requestId) => {
  return axios.patch(`/v1/api/admin/data-requests/${requestId}/approve`);
};

export const rejectDataRequestApi = (requestId) => {
  return axios.patch(`/v1/api/admin/data-requests/${requestId}/reject`);
};

// ========== ROLES & PERMISSIONS ==========
export const getAllRolesApi = () => {
  return axios.get("/v1/api/admin/roles");
};

export const getRoleByIdApi = (roleId) => {
  return axios.get(`/v1/api/admin/roles/${roleId}`);
};

export const updateRolePermissionsApi = (roleId, permissions) => {
  return axios.put(`/v1/api/admin/roles/${roleId}/permissions`, { permissions });
};

// ========== SYSTEM SETTINGS ==========
export const getSystemSettingsApi = () => {
  return axios.get("/v1/api/admin/settings");
};

export const updateSystemSettingsApi = (settings) => {
  return axios.put("/v1/api/admin/settings", settings);
};

export const resetSystemSettingsApi = () => {
  return axios.post("/v1/api/admin/settings/reset");
};
