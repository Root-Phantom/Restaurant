import axios from 'axios';

const baseURL = '/api';


export const http = axios.create({
    baseURL,
    headers: {'Content-Type': 'application/json'}
});

http.interceptors.response.use(
    res => res,
    err => {
        const msg =
            err?.response?.data?.title ||
            err?.response?.data?.message ||
            err.message;
        console.error('HTTP Error:', err?.response?.status, msg);
        return Promise.reject(err);
    }
);
