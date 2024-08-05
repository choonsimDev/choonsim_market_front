import axiosClient from "../axiosClient";
import {
  CreateOrderDto,
  MatchOrderDto,
  UpdateOrderStatusDto,
} from "../types/order";

// const BASE_URL = `https://port-0-choonsim-market-back-lyscrsym8c0a1309.sel4.cloudtype.app/orders`;
const BASE_URL = `http://localhost:3500/orders`;

export const createOrder = async (orderData: CreateOrderDto) => {
  return axiosClient.post(`${BASE_URL}`, orderData);
};

export const getAllOrders = async () => {
  return axiosClient.get(`${BASE_URL}`);
};

export const getTodayOrders = async () => {
  return axiosClient.get(`${BASE_URL}/today`);
};

export const getOrdersByStatus = async (status: number) => {
  return axiosClient.get(`${BASE_URL}/status/${status}`);
};
export const updateOrderStatus = async (
  id: string,
  updateData: UpdateOrderStatusDto
) => {
  return axiosClient.patch(`${BASE_URL}/${id}/status`, updateData);
};

export const matchOrders = async () => {
  return axiosClient.post(`${BASE_URL}/match`);
};

export const matchSpecificOrders = async (matchData: MatchOrderDto) => {
  return axiosClient.post(`${BASE_URL}/match-order`, matchData);
};

export const processOrder = async (id: string, processed: boolean) => {
  return axiosClient.put(`${BASE_URL}/${id}/process`, { processed });
};
