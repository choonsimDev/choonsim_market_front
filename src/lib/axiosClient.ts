import axios from 'axios';
import { getCookie } from 'cookies-next';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

const jwt = getCookie('jwt');

const headers = {
    'Content-Type': 'application/json',
    ...(jwt && { 'Authorization': `Bearer ${String(jwt)}` })
};

const axiosClient = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers,
});

export default axiosClient;
