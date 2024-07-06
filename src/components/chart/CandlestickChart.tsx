import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { ApexOptions } from "apexcharts";
import { getDailyTradeStats } from "@/lib/apis/trade";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartContainer = styled.div`
  font-size: 18px;
  font-weight: bold;
  padding-top: 26px;
`;

const TitleContainer = styled.div`
  margin-top: 20px;
  padding-bottom: 10px;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const Button = styled.button`
  margin-right: 8px;
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

interface TradeData {
  date: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  totalPrice: number;
}

interface CandlestickData {
  x: Date;
  y: number[];
}

interface VolumeData {
  x: Date;
  y: number;
}

const CandlestickChart: React.FC = () => {
  const [series, setSeries] = useState<
    { name: string; type: string; data: CandlestickData[] | VolumeData[] }[]
  >([
    {
      name: "Candlestick",
      type: "candlestick",
      data: [],
    },
    {
      name: "Volume",
      type: "bar",
      data: [],
    },
  ]);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxVolume, setMaxVolume] = useState(0);
  const [timeframe, setTimeframe] = useState("daily");
  const [originalData, setOriginalData] = useState<TradeData[]>([]);

  useEffect(() => {
    const run = async () => {
      const { data } = await getDailyTradeStats();
      const candlestickData = data.map((stat: TradeData) => ({
        x: new Date(stat.date),
        y: [stat.openPrice, stat.highPrice, stat.lowPrice, stat.closePrice],
      }));
      const volumeData = data.map((stat: TradeData) => ({
        x: new Date(stat.date),
        y: stat.totalPrice,
      }));

      setSeries([
        { name: "Candlestick", type: "candlestick", data: candlestickData },
        { name: "Volume", type: "bar", data: volumeData },
      ]);

      const allLowPrices = data.map((stat: TradeData) => stat.lowPrice);
      const allHighPrices = data.map((stat: TradeData) => stat.highPrice);
      const allTotalPrices = data.map((stat: TradeData) => stat.totalPrice);
      const lowestPrice = Math.min(...allLowPrices);
      const highestPrice = Math.max(...allHighPrices);
      const highestVolume = Math.max(...allTotalPrices);

      const adjustedMinPrice = Math.floor(lowestPrice / 50000) * 50000;
      const adjustedMaxPrice = Math.ceil(highestPrice / 50000) * 50000;

      setMinPrice(adjustedMinPrice);
      setMaxPrice(adjustedMaxPrice);
      setMaxVolume(highestVolume * 30);

      setOriginalData(data); // Save the original data
      updateChart("daily", data);
    };

    run();
  }, []);

  const aggregateData = (data: TradeData[], interval: number) => {
    const aggregatedData: TradeData[] = [];
    for (let i = 0; i < data.length; i += interval) {
      const subset = data.slice(i, i + interval);
      const aggregated = subset.reduce(
        (acc, cur) => {
          acc.lowPrice = Math.min(acc.lowPrice, cur.lowPrice);
          acc.highPrice = Math.max(acc.highPrice, cur.highPrice);
          acc.openPrice = acc.openPrice === 0 ? cur.openPrice : acc.openPrice;
          acc.closePrice = cur.closePrice;
          acc.totalPrice += cur.totalPrice;
          return acc;
        },
        {
          date: subset[0].date,
          openPrice: 0,
          highPrice: 0,
          lowPrice: Infinity,
          closePrice: 0,
          totalPrice: 0,
        }
      );

      aggregatedData.push(aggregated);
    }
    return aggregatedData;
  };

  const updateChart = (timeframe: string, data: TradeData[]) => {
    let filteredData: TradeData[];

    if (timeframe === "weekly") {
      filteredData = aggregateData(data, 7);
    } else if (timeframe === "monthly") {
      filteredData = aggregateData(data, 30);
    } else {
      filteredData = data;
    }

    const candlestickData = filteredData.map((stat: TradeData) => ({
      x: new Date(stat.date),
      y: [stat.openPrice, stat.highPrice, stat.lowPrice, stat.closePrice],
    }));
    const volumeData = filteredData.map((stat: TradeData) => ({
      x: new Date(stat.date),
      y: stat.totalPrice,
    }));

    setSeries([
      { name: "Candlestick", type: "candlestick", data: candlestickData },
      { name: "Volume", type: "bar", data: volumeData },
    ]);

    const allLowPrices = filteredData.map((stat: TradeData) => stat.lowPrice);
    const allHighPrices = filteredData.map((stat: TradeData) => stat.highPrice);
    const allTotalPrices = filteredData.map(
      (stat: TradeData) => stat.totalPrice
    );
    const lowestPrice = Math.min(...allLowPrices);
    const highestPrice = Math.max(...allHighPrices);
    const highestVolume = Math.max(...allTotalPrices);

    const adjustedMinPrice = Math.floor(lowestPrice / 50000) * 50000;
    const adjustedMaxPrice = Math.ceil(highestPrice / 50000) * 50000;

    setMinPrice(adjustedMinPrice);
    setMaxPrice(adjustedMaxPrice);
    setMaxVolume(highestVolume * 30);

    setTimeframe(timeframe);
  };

  const options: ApexOptions = {
    chart: {
      height: 500,
      toolbar: {
        show: true,
        tools: {
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    xaxis: {
      type: "datetime",
      min: new Date().setMonth(new Date().getMonth() - 3), // 최근 3개월치 데이터를 보이게 설정
      max: new Date().getTime(),
    },
    yaxis: [
      {
        title: {
          text: "Price (WON)",
        },
        show: true,
        min: minPrice,
        max: maxPrice,
        tickAmount: Math.ceil((maxPrice - minPrice) / 50000), // 레이블을 50,000원 단위로 설정
        labels: {
          formatter: (value) => value.toLocaleString(),
        },
      },
      {
        seriesName: "Volume",
        opposite: true,
        show: false,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
        },
        labels: {
          style: {
            colors: "#00E396",
          },
        },
        title: {
          text: "Volume",
          style: {
            color: "#00E396",
          },
        },
        min: 0,
        max: maxVolume,
      },
    ],
    plotOptions: {
      bar: {
        columnWidth: "80%",
        colors: {
          ranges: [
            {
              from: 0,
              to: Infinity,
              color: "#e6e6e6",
            },
          ],
        },
        dataLabels: {
          position: "top",
        },
      },
      candlestick: {
        colors: {
          upward: "#00E396",
          downward: "#FF4560",
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      shared: true,
    },
  };

  return (
    <ChartContainer>
      <TitleContainer>
        <div>MOBICK/WON</div>
        <ButtonContainer>
          <Button onClick={() => updateChart("daily", originalData)}>
            Day
          </Button>
          <Button onClick={() => updateChart("weekly", originalData)}>
            Week
          </Button>
          <Button onClick={() => updateChart("monthly", originalData)}>
            Month
          </Button>
        </ButtonContainer>
      </TitleContainer>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={250}
      />
    </ChartContainer>
  );
};

export default CandlestickChart;
