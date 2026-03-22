// BME/client/lib/api.js
// API Client for frontend-backend communication

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (data) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (data) => apiRequest('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),
  resetPassword: (data) => apiRequest('/auth/reset-password', { method: 'POST', body: JSON.stringify(data) }),
  logout: () => apiRequest('/auth/logout', { method: 'POST' }),
  getMe: () => apiRequest('/auth/me')
};

// Staff API
export const staffAPI = {
  getAll: (status) => apiRequest(`/staff${status ? `?status=${status}` : ''}`),
  getById: (id) => apiRequest(`/staff/${id}`),
  create: (data) => apiRequest('/staff', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/staff/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/staff/${id}`, { method: 'DELETE' }),
  changeStatus: (id, status) => apiRequest(`/staff/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  })
};

// Users / Approvals API
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  create: (data) => apiRequest('/users', { method: 'POST', body: JSON.stringify(data) }),
  getPending: () => apiRequest('/users/pending'),
  approve: (id) => apiRequest(`/users/${id}/approve`, { method: 'POST' }),
  reject: (id) => apiRequest(`/users/${id}/reject`, { method: 'POST' })
};

// Entries API
export const entriesAPI = {
  getAll: (startDate, endDate) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return apiRequest(`/entries?${params.toString()}`);
  },
  getByDate: (date) => apiRequest(`/entries/date/${date}`),
  create: (data) => apiRequest('/entries', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/entries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/entries/${id}`, { method: 'DELETE' })
};

// Attendance API
export const attendanceAPI = {
  getAll: (params) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/attendance${queryParams ? `?${queryParams}` : ''}`);
  },
  create: (data) => apiRequest('/attendance', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/attendance/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/attendance/${id}`, { method: 'DELETE' })
};

// Salary API
export const salaryAPI = {
  getMonthly: (startDate, endDate, staffId) => {
    const params = new URLSearchParams({ startDate, endDate });
    if (staffId) params.append('staffId', staffId);
    return apiRequest(`/salary?${params.toString()}`);
  },
  create: (data) => apiRequest('/salary', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/salary/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/salary/${id}`, { method: 'DELETE' })
};

// Bank Accounts API
export const bankAPI = {
  getAll: () => apiRequest('/bank'),
  getById: (id) => apiRequest(`/bank/${id}`),
  create: (data) => apiRequest('/bank', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/bank/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/bank/${id}`, { method: 'DELETE' }),
  // Transactions
  addTransaction: (accountId, data) => apiRequest(`/bank/${accountId}/transactions`, { method: 'POST', body: JSON.stringify(data) }),
  deleteTransaction: (accountId, txnId) => apiRequest(`/bank/${accountId}/transactions/${txnId}`, { method: 'DELETE' }),
  // Categories
  getCategories: () => apiRequest('/bank/categories'),
  createCategory: (data) => apiRequest('/bank/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => apiRequest(`/bank/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => apiRequest(`/bank/categories/${id}`, { method: 'DELETE' })
};

// Creditors API
export const creditorsAPI = {
  getAll: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/creditors${queryParams ? `?${queryParams}` : ''}`);
  },
  create: (data) => apiRequest('/creditors', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/creditors/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  settle: (id, data) => apiRequest(`/creditors/${id}/settle`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/creditors/${id}`, { method: 'DELETE' })
};

// Inventory API
export const inventoryAPI = {
  getAll: () => apiRequest('/inventory'),
  create: (data) => apiRequest('/inventory', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/inventory/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/inventory/${id}`, { method: 'DELETE' })
};

// Indent API
export const indentAPI = {
  getAll: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/indent${queryParams ? `?${queryParams}` : ''}`);
  },
  create: (data) => apiRequest('/indent', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/indent/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  save: (id) => apiRequest(`/indent/${id}/save`, { method: 'PATCH' }),
  delete: (id) => apiRequest(`/indent/${id}`, { method: 'DELETE' })
};

// Savings API
export const savingsAPI = {
  getAll: () => apiRequest('/savings'),
  getById: (id) => apiRequest(`/savings/${id}`),
  create: (data) => apiRequest('/savings', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiRequest(`/savings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => apiRequest(`/savings/${id}`, { method: 'DELETE' }),
  // Transactions
  addTransaction: (accountId, data) => apiRequest(`/savings/${accountId}/transactions`, { method: 'POST', body: JSON.stringify(data) }),
  deleteTransaction: (accountId, txnId) => apiRequest(`/savings/${accountId}/transactions/${txnId}`, { method: 'DELETE' })
};

// Pigmy API
export const pigmyAPI = {
  // Pigmy R (Retrieval)
  getAllR: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/pigmy/r${queryParams ? `?${queryParams}` : ''}`);
  },
  createR: (data) => apiRequest('/pigmy/r', { method: 'POST', body: JSON.stringify(data) }),
  updateR: (id, data) => apiRequest(`/pigmy/r/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteR: (id) => apiRequest(`/pigmy/r/${id}`, { method: 'DELETE' }),
  // Pigmy S (read-only from entries)
  getAllS: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/pigmy/s${queryParams ? `?${queryParams}` : ''}`);
  }
};

// Maintenance API
export const maintenanceAPI = {
  // Tickets
  getTickets: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/maintenance/tickets${queryParams ? `?${queryParams}` : ''}`);
  },
  createTicket: (data) => apiRequest('/maintenance/tickets', { method: 'POST', body: JSON.stringify(data) }),
  updateTicket: (id, data) => apiRequest(`/maintenance/tickets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTicket: (id) => apiRequest(`/maintenance/tickets/${id}`, { method: 'DELETE' }),
  // Entries
  getEntries: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/maintenance/entries${queryParams ? `?${queryParams}` : ''}`);
  },
  createEntry: (data) => apiRequest('/maintenance/entries', { method: 'POST', body: JSON.stringify(data) }),
  updateEntry: (id, data) => apiRequest(`/maintenance/entries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEntry: (id) => apiRequest(`/maintenance/entries/${id}`, { method: 'DELETE' }),
  // Categories
  getCategories: () => apiRequest('/maintenance/categories'),
  createCategory: (data) => apiRequest('/maintenance/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => apiRequest(`/maintenance/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => apiRequest(`/maintenance/categories/${id}`, { method: 'DELETE' })
};

// Logs API
export const logsAPI = {
  getAll: () => apiRequest('/logs'),
  getByUser: (username) => apiRequest(`/logs/user/${username}`),
  clear: () => apiRequest('/logs', { method: 'DELETE' })
};

// Dashboard / Analytics API  
export const dashboardAPI = {
  getSummary: () => apiRequest('/dashboard/summary'),
  getAnalytics: (params) => {
    const queryParams = params ? new URLSearchParams(params).toString() : '';
    return apiRequest(`/dashboard/analytics${queryParams ? `?${queryParams}` : ''}`);
  }
};