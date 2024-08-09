import axios from "axios";
import dayjs from "dayjs";

const UPBIT_API_BASE_URL = "https://api.upbit.com/v1";

export const getBTCPriceData = async () => {
  const response = await axios.get(`${UPBIT_API_BASE_URL}/candles/days`, {
    params: {
      market: "KRW-BTC",
      count: 365,
    },
  });
  return response.data.map((candle: any) => ({
    date: dayjs(candle.candle_date_time_utc).format("YYYY-MM-DD"),
    openPrice: candle.opening_price,
    highPrice: candle.high_price,
    lowPrice: candle.low_price,
    closePrice: candle.trade_price,
    volume: candle.candle_acc_trade_price,
  }));
};
