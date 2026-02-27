import axios from 'axios';

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

// 🔥 Response Interceptor: Redirection Loop rokne ke liye
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // Agar 401 error aaye (Token expired ya invalid)
        if (error.response?.status === 401) {
            console.warn("Unauthorized! Clearing token to stop loops.");
            if (typeof window !== 'undefined') {
                localStorage.removeItem('userToken');
                localStorage.removeItem('userGender');
                localStorage.removeItem('loginTimestamp');

                // Sirf tab redirect karein jab hum pehle se login page par na hon
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
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
export const unlockProfile = (profileId: string) => API.post('/users/unlock-profile', { profileId });

/* ================= ADMIN ENDPOINTS ================= */
export const adminLogin = (formData: any) => API.post('/auth/admin-login', formData);
export const fetchRegistrations = () => API.get('/admin/registrations');
export const approveUser = (userId: string) => API.put(`/admin/approve/${userId}`);
export const deleteRegistration = (id: string) => API.delete(`/admin/registration/${id}`);

export default API;