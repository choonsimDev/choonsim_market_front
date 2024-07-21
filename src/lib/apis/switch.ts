import axiosClient from "../axiosClient";

const BASE_URL = `https://port-0-choonsim-market-back-lyscrsym8c0a1309.sel4.cloudtype.app/switch`;

export const getSwitches = async () => {
  return axiosClient.get(`${BASE_URL}`);
};

export const updateSwitch = async (isActive: boolean) => {
  return axiosClient.patch(`${BASE_URL}`, { isActive });
};
