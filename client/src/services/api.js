const API_BASE = '/api';

/**
 * Common fetch helper with JWT header
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('lifevault_token');
  const headers = {
    ...(options.headers || {})
  };

  // Only set application/json if not sending FormData
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        // Clear token on unauthorized if not on public routes
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register') && window.location.pathname !== '/') {
          localStorage.removeItem('lifevault_token');
          localStorage.removeItem('lifevault_user');
          window.location.href = '/login';
        }
      }
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  demoLogin: (role) => request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ role }) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Assets
  getAssets: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/assets${qs ? `?${qs}` : ''}`);
  },
  getAssetById: (id) => request(`/assets/${id}`),
  getCategories: () => request('/assets/categories'),
  createAsset: (data) => request('/assets', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (id, data) => request(`/assets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAsset: (id) => request(`/assets/${id}`, { method: 'DELETE' }),

  // Nominees
  getNominees: () => request('/nominees'),
  createNominee: (data) => request('/nominees', { method: 'POST', body: JSON.stringify(data) }),
  updateNominee: (id, data) => request(`/nominees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteNominee: (id) => request(`/nominees/${id}`, { method: 'DELETE' }),
  getNomineePermissions: (id) => request(`/nominees/${id}/permissions`),
  updateNomineePermissions: (id, permissions) => request(`/nominees/${id}/permissions`, {
    method: 'PUT',
    body: JSON.stringify({ permissions })
  }),

  // Documents
  getDocuments: (category) => request(`/documents${category && category !== 'All' ? `?category=${category}` : ''}`),
  uploadDocument: (formData) => request('/documents/upload', { method: 'POST', body: formData }),
  deleteDocument: (id) => request(`/documents/${id}`, { method: 'DELETE' }),
  getDownloadUrl: (id) => `${API_BASE}/documents/${id}/download`,

  // AI & Gap Detection
  getLegacyReadiness: () => request('/ai/readiness'),
  getGapAnalysis: () => request('/ai/gaps'),
  askAssistant: (question) => request('/ai/assistant', { method: 'POST', body: JSON.stringify({ question }) }),

  // Inactivity & Emergency Activation
  getActivationSettings: () => request('/activation/settings'),
  updateActivationSettings: (data) => request('/activation/settings', { method: 'PUT', body: JSON.stringify(data) }),
  checkIn: () => request('/activation/check-in', { method: 'POST' }),
  simulateInactivity: () => request('/activation/simulate-inactivity', { method: 'POST' }),
  submitVerification: (data) => request('/activation/submit-verification', { method: 'POST', body: JSON.stringify(data) }),
  getNomineeReleasedData: () => request('/activation/nominee-released'),

  // Security Center
  getSecurityOverview: () => request('/security/overview'),
  testEncryption: (plaintext) => request('/security/test-encryption', { method: 'POST', body: JSON.stringify({ plaintext }) }),
  toggle2FA: (enabled) => request('/security/toggle-2fa', { method: 'POST', body: JSON.stringify({ enabled }) }),

  // Audit Logs
  getAuditLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/audit${qs ? `?${qs}` : ''}`);
  },

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: () => request('/admin/users'),
  getVerificationRequests: () => request('/admin/verifications'),
  reviewVerificationRequest: (id, data) => request(`/admin/verifications/${id}/review`, { method: 'PUT', body: JSON.stringify(data) }),
  getAdminAuditLogs: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/admin/audit-logs${qs ? `?${qs}` : ''}`);
  },

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
