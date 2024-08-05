import axiosClient from "../axiosClient";

const BASE_URL = `http://localhost:3500/switch`;

export const getSwitches = async () => {
  return axiosClient.get(`${BASE_URL}`);
};

export const updateSwitch = async (isActive: boolean) => {
  return axiosClient.patch(`${BASE_URL}`, { isActive });
};
