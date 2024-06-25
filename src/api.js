// src/api.js

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000/', // Django backend URL
    timeout: 5000, // 5 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

export default axiosInstance;
