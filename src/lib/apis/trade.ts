import axios from "axios";

// const BASE_URL = `${process.env.NEXT_PUBLIC_API_URL}/trades`;
const BASE_URL = `http://localhost:3500/trades`;

export const getAllTrades = async () => {
  return axios.get(`${BASE_URL}`);
};

export const getDailyTradeStats = async () => {
  return axios.get(`${BASE_URL}/daily-stats`);
};

export const getPaginatedDailyTradeStats = async (page: any, limit: any) => {
  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  if (isNaN(pageNumber) || isNaN(limitNumber)) {
    throw new Error("Page and limit must be valid numbers");
  }

  return axios.get(`${BASE_URL}/paginated-daily-stats`, {
    params: {
      page: pageNumber,
      limit: limitNumber,
    },
  });
};

export const saveTodayStats = async () => {
  return axios.post(`${BASE_URL}/save-today-stats`);
};

export const getTodayStats = async () => {
  return axios.get(`${BASE_URL}/today-stats`);
};

export const getTodayMatch = async () => {
  return axios.get(`${BASE_URL}/today-match`);
};
