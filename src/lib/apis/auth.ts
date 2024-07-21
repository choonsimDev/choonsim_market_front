import axios from "axios";
import { getCookie } from "cookies-next";
import axiosClient from "../axiosClient";

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
const BASE_URL = `http://localhost:8080/auth`;

export const login = async (code: string) => {
  return axios.post(`${BASE_URL}/login`, { code }, { withCredentials: true });
};

export const validateToken = async () => {
  return axiosClient.get("/auth/validate");
};
