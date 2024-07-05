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

const CandlestickChart: React.FC = () => {
  const [series, setSeries] = useState([
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

  useEffect(() => {
    const run = async () => {
      const { data } = await getDailyTradeStats();
      const candlestickData = data.map((stat: any) => ({
        x: new Date(stat.date),
        y: [stat.openPrice, stat.highPrice, stat.lowPrice, stat.closePrice],
      }));
      const volumeData = data.map((stat: any) => ({
        x: new Date(stat.date),
        y: stat.totalPrice,
      }));

      const allLowPrices = data.map((stat: any) => stat.lowPrice);
      const allHighPrices = data.map((stat: any) => stat.highPrice);
      const allTotalPrices = data.map((stat: any) => stat.totalPrice);
      const lowestPrice = Math.min(...allLowPrices);
      const highestPrice = Math.max(...allHighPrices);
      const highestVolume = Math.max(...allTotalPrices);

      setMinPrice(
        (lowestPrice > 100 ? lowestPrice - (lowestPrice % 100) : 100) * 0.9
      );
      setMaxPrice((highestPrice + (1000 - (highestPrice % 1000))) * 1.1);
      setMaxVolume(highestVolume * 30);

      setSeries([
        { name: "Candlestick", type: "candlestick", data: candlestickData },
        { name: "Volume", type: "bar", data: volumeData },
      ]);
    };

    run();
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 238,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      type: "datetime",
      min: new Date().setDate(new Date().getDate() - 30),
      max: new Date().getTime(),
      labels: {
        show: false,
      },
    },
    yaxis: [
      {
        title: {
          text: "Price",
        },
        show: false,
        min: minPrice,
        max: maxPrice,
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
      <div>MOBICK/WON</div>
      <ReactApexChart
        options={options}
        series={series}
        type="candlestick"
        height={500}
      />
    </ChartContainer>
  );
};

export default CandlestickChart;
