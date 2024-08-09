import axios from "axios";
import dayjs from "dayjs";

const UPBIT_API_BASE_URL = "https://api.upbit.com/v1";

interface BTCData {
  date: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
}

export const getBTCPriceData = async (): Promise<BTCData[]> => {
  let btcData: BTCData[] = [];
  let remainingCount = 365; // 가져오고자 하는 총 데이터 개수
  let lastCandleDate: string | null = null; // 마지막 캔들 날짜를 추적

  while (remainingCount > 0) {
    const countToFetch = Math.min(remainingCount, 200); // 한 번에 가져올 데이터 개수 (최대 200개)

    const response = await axios.get<
      {
        candle_date_time_utc: string;
        opening_price: number;
        high_price: number;
        low_price: number;
        trade_price: number;
        candle_acc_trade_price: number;
      }[]
    >(`${UPBIT_API_BASE_URL}/candles/days`, {
      params: {
        market: "KRW-BTC",
        count: countToFetch,
        to: lastCandleDate ? lastCandleDate : undefined, // 마지막 캔들 날짜부터 이전 데이터를 가져옴
      },
    });

    const newData: BTCData[] = response.data.map((candle) => ({
      date: dayjs(candle.candle_date_time_utc).format("YYYY-MM-DD"),
      openPrice: candle.opening_price,
      highPrice: candle.high_price,
      lowPrice: candle.low_price,
      closePrice: candle.trade_price,
      volume: candle.candle_acc_trade_price,
    }));

    btcData = btcData.concat(newData); // 새로운 데이터를 기존 데이터에 추가

    remainingCount -= newData.length; // 남은 데이터 개수를 조정
    if (newData.length > 0) {
      lastCandleDate = dayjs(newData[newData.length - 1].date)
        .subtract(1, "day")
        .format("YYYY-MM-DDTHH:mm:ss[Z]"); // 마지막 가져온 캔들의 이전 날짜를 설정
    } else {
      break; // 더 이상 가져올 데이터가 없으면 종료
    }
  }

  return btcData;
};
