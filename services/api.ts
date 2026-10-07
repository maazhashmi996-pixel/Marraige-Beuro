import axios from 'axios';

// 🔥 PRODUCTION CHECK: Agar .env mein URL hai toh wo use karega, warna default localhost
// Next.js mein environment variables 'NEXT_PUBLIC_' se shuru hona zaroori hain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const API = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000, // 15 seconds timeout taake request stuck na rahe
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
}, (error) => {
    return Promise.reject(error);
});

// 🔥 Response Interceptor: Error Handling & Redirects
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network Error (Backend down ho ya connection ka masla ho)
        if (!error.response) {
            console.error("Network Error: Check if your backend is running!");
        }

        // 401 Unauthorized: Token expired ya invalid
        if (error.response?.status === 401) {
            console.warn("Unauthorized! Clearing session...");
            if (typeof window !== 'undefined') {
                localStorage.clear(); // Saara purana data saaf karein

                // Infinite loop se bachne ke liye check karein
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login?session=expired';
                }
            }
        }

        // 403 Forbidden: Permission issues
        if (error.response?.status === 403) {
            console.error("Access Denied: You don't have permission for this.");
        }

        return Promise.reject(error);
    }
);

/* ================= USER ENDPOINTS ================= */
export const loginUser = (formData: any) => API.post('/users/login', formData);

export const registerUser = (formData: any) => API.post('/users/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export const fetchMatches = () => API.get('/users/matches');

// Unlocking profile (Uses credits)
export const unlockProfile = (profileId: string) => API.post('/users/unlock-profile', { profileId });

/* ================= ADMIN ENDPOINTS ================= */
export const adminLogin = (formData: any) => API.post('/auth/admin-login', formData);
export const fetchRegistrations = () => API.get('/admin/registrations');
export const approveUser = (userId: string) => API.put(`/admin/approve/${userId}`);
export const deleteRegistration = (id: string) => API.delete(`/admin/registration/${id}`);

// Admin direct profile creation
export const adminCreateProfile = (formData: any) => API.post('/admin/create-profile', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});

export default API;