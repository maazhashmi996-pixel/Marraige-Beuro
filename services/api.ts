import axios from 'axios';

// Base URL configuration
const API = axios.create({
    baseURL: 'http://localhost:5000/api'
});

// Request Interceptor: Token injection
API.interceptors.request.use((req) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('userToken');
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }
    return req;
});

/* ================= USER ENDPOINTS ================= */

// Login & Register
export const loginUser = (formData: any) => API.post('/users/login', formData);
export const registerUser = (formData: any) => API.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Matches (Ye /api/users/matches call karega)
export const fetchMatches = () => API.get('/users/matches');

// Profile Unlock
export const unlockProfile = (profileId: string) => API.post('/users/unlock-profile', { profileId });

/* ================= ADMIN ENDPOINTS ================= */

export const adminLogin = (formData: any) => API.post('/auth/admin-login', formData);
export const fetchRegistrations = () => API.get('/admin/registrations');
export const approveUser = (userId: string) => API.put(`/admin/approve/${userId}`);
export const deleteRegistration = (id: string) => API.delete(`/admin/registration/${id}`);

export default API;