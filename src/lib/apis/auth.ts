import axios from "axios";
import { getCookie } from "cookies-next";
import axiosClient from "../axiosClient";

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/auth`;
// const BASE_URL = `http://localhost:3500/auth`;
const BASE_URL = `https://port-0-choonsim-market-back-lyscrsym8c0a1309.sel4.cloudtype.app/auth`;

// export const login = async (code: string) => {
//   return axios.post(`${BASE_URL}/login`, { code }, { withCredentials: true });
// };

// export const validateToken = async () => {
//   return axiosClient.get("/auth/validate");
// };

export const login = async (code: string) => {
  return axios.post(`${BASE_URL}/login`, { code }, { withCredentials: true });
};

export const validateToken = async () => {
  return axiosClient.get("/auth/validate", { withCredentials: true });
};
