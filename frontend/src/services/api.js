// frontend/src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

const getAuthToken = () => {
  const auth = localStorage.getItem("auth");
  return auth ? JSON.parse(auth).token : null;
};

const handleResponse = async (response) => {
  if (response.status === 204) return {};
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || response.statusText);
  }
  return data;
};

const api = {
  get: async (endpoint) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });
    return handleResponse(response);
  },
  post: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  put: async (endpoint, body) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
};

export default api;

export const authApi = {
  login: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    return fetch(`${API_BASE_URL}/auth/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData,
    }).then(handleResponse);
  },
  register: (data) => api.post("/auth/register", data),
  googleLogin: (token) => {
    // This is the special call for Google Sign-In
    return fetch(`${API_BASE_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: token }),
    }).then(handleResponse);
  }
};

export const donorApi = {
  submitFood: (data) => api.post("/donor/food", data),
  getHistory: () => api.get("/donor/food/history"),
};

export const ngoApi = {
  getAvailableFood: () => api.get("/ngo/food/available"),
  claimFood: (foodItemId) => api.post(`/ngo/food/claim/${foodItemId}`, {}),
  getHistory: () => api.get("/ngo/food/history"),
  updateClaimStatus: (claimId, status) => api.put(`/ngo/food/claim/${claimId}`, { status }),
};

export const adminApi = {
  getUsers: () => api.get("/admin/users"),
  verifyUser: (userId) => api.put(`/admin/users/${userId}/verify`, {}),
  getAnalytics: () => api.get("/admin/analytics"),
  getAiAnalytics: () => api.get("/ai/analytics-insight"),
};

export const aiApi = {
    getShelfLife: (description) => api.post("/ai/shelf-life", { description }),
    getNgoMatches: (data) => api.post("/ai/match-ngo", data),
    draftMessage: (data) => api.post("/ai/draft-message", data),
};