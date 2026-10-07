import axios from 'axios';
import {
  ApiResponse,
  Application,
  Company,
  OfficerDashboardData,
  PlacementDrive,
  StudentDashboardData,
  StudentProfile,
  User,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired or unauthorized
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- Auth APIs ---
export const authApi = {
  login: async (email: string, password: string) => {
    const res = await api.post<ApiResponse<any>>('/auth/login', { email, password });
    return res.data;
  },
  register: async (payload: any) => {
    const res = await api.post<ApiResponse<any>>('/auth/register', payload);
    return res.data;
  },
};

// --- Student APIs ---
export const studentApi = {
  getProfile: async () => {
    const res = await api.get<ApiResponse<StudentProfile>>('/students/profile');
    return res.data.data;
  },
  updateProfile: async (payload: Partial<StudentProfile>) => {
    const res = await api.put<ApiResponse<StudentProfile>>('/students/profile', payload);
    return res.data.data;
  },
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post<ApiResponse<string>>('/students/resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },
  deleteResume: async () => {
    const res = await api.delete<ApiResponse<void>>('/students/resume');
    return res.data;
  },
  getDashboard: async () => {
    const res = await api.get<ApiResponse<StudentDashboardData>>('/students/dashboard');
    return res.data.data;
  },
  getMyApplications: async () => {
    const res = await api.get<ApiResponse<Application[]>>('/students/applications');
    return res.data.data;
  },
  getAllStudents: async () => {
    const res = await api.get<ApiResponse<StudentProfile[]>>('/students/all');
    return res.data.data;
  },
};

// --- Company APIs ---
export const companyApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<Company[]>>('/companies');
    return res.data.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<Company>>(`/companies/${id}`);
    return res.data.data;
  },
  create: async (payload: Partial<Company>) => {
    const res = await api.post<ApiResponse<Company>>('/companies', payload);
    return res.data.data;
  },
  update: async (id: number, payload: Partial<Company>) => {
    const res = await api.put<ApiResponse<Company>>(`/companies/${id}`, payload);
    return res.data.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/companies/${id}`);
    return res.data;
  },
};

// --- Placement Drive APIs ---
export const driveApi = {
  getAll: async () => {
    const res = await api.get<ApiResponse<PlacementDrive[]>>('/drives');
    return res.data.data;
  },
  getById: async (id: number) => {
    const res = await api.get<ApiResponse<PlacementDrive>>(`/drives/${id}`);
    return res.data.data;
  },
  create: async (payload: any) => {
    const res = await api.post<ApiResponse<PlacementDrive>>('/drives', payload);
    return res.data.data;
  },
  update: async (id: number, payload: any) => {
    const res = await api.put<ApiResponse<PlacementDrive>>(`/drives/${id}`, payload);
    return res.data.data;
  },
  delete: async (id: number) => {
    const res = await api.delete<ApiResponse<void>>(`/drives/${id}`);
    return res.data;
  },
  updateStatus: async (id: number, status: string) => {
    const res = await api.put<ApiResponse<PlacementDrive>>(`/drives/${id}/status?status=${status}`);
    return res.data.data;
  },
  apply: async (driveId: number, remarks?: string) => {
    const res = await api.post<ApiResponse<Application>>(`/drives/${driveId}/apply`, { remarks });
    return res.data;
  },
  getApplicants: async (driveId: number) => {
    const res = await api.get<ApiResponse<Application[]>>(`/drives/${driveId}/applications`);
    return res.data.data;
  },
};

// --- Application APIs ---
export const applicationApi = {
  updateStatus: async (id: number, status: string, remarks?: string) => {
    const res = await api.put<ApiResponse<Application>>(`/applications/${id}/status`, { status, remarks });
    return res.data.data;
  },
  getAll: async () => {
    const res = await api.get<ApiResponse<Application[]>>('/applications/all');
    return res.data.data;
  },
};

// --- Admin Dashboard APIs ---
export const adminApi = {
  getDashboard: async () => {
    const res = await api.get<ApiResponse<OfficerDashboardData>>('/admin/dashboard');
    return res.data.data;
  },
};

export default api;
