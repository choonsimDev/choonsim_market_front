import axios from "axios";
import { getCookie } from "cookies-next";

const BASE_URL = `https://port-0-choonsim-market-back-lyscrsym8c0a1309.sel4.cloudtype.app/`;

const jwt = getCookie("jwt");

const headers = {
  "Content-Type": "application/json",
  ...(jwt && { Authorization: `Bearer ${String(jwt)}` }),
};

const axiosClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers,
});

export default axiosClient;
