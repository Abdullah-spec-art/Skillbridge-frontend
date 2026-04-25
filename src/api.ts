import axios from 'axios';

// 1. Create the base instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  // baseURL: 'http://127.0.0.1:8000', // Change this once when you deploy to production!
});

// 2. Add a Request Interceptor
// Think of this as a toll booth that every request passes through before leaving your app.
api.interceptors.request.use(
  (config) => {
    // Check if we have a VIP wristband (token)
    const token = localStorage.getItem('token');
    
    // If we do, staple it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;