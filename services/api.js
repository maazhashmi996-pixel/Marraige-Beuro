import axios from 'axios';

// Base URL ko '/api' par set kiya hai taake endpoints chote rahein
const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Request Interceptor: Har request ke saath token bhejta hai
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('userToken');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

/* ================= USER ENDPOINTS ================= */

// Login aur Register
export const loginUser = (formData) => API.post('/users/login', formData);
export const registerUser = (formData) => API.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

// Matches aur Profile Unlock (Jo pehle 404 de rahe thay)
export const fetchMatches = () => API.get('/users/matches');
export const unlockProfile = (profileId) => API.post('/users/unlock-profile', { profileId });


/* ================= ADMIN ENDPOINTS ================= */

export const adminLogin = (formData) => API.post('/auth/admin-login', formData);
export const fetchRegistrations = () => API.get('/admin/registrations');
export const approveUser = (userId) => API.put(`/admin/approve/${userId}`);
export const deleteRegistration = (id) => API.delete(`/admin/registration/${id}`);


/* ================= PUBLIC ENDPOINTS ================= */

export const fetchPublicProfiles = () => API.get('/public/profiles');

export default API;