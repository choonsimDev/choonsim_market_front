import axiosClient from "../axiosClient";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/switch`;

export const getSwitches = async () => {
  return axiosClient.get(`${BASE_URL}`);
};

export const updateSwitch = async (isActive: boolean) => {
  return axiosClient.patch(`${BASE_URL}`, { isActive });
};