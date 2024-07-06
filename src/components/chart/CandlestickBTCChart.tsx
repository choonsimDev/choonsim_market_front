import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styled from "styled-components";
import { ApexOptions } from "apexcharts";
import { getDailyTradeStats } from "@/lib/apis/trade";
import { getBTCPriceData } from "@/lib/apis/upbit";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const ChartContainer = styled.div`
  font-size: 18px;
  font-weight: bold;
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

interface BTCData {
  date: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  volume: number;
}

interface MobickData {
  date: string;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  closePrice: number;
  totalPrice: number;
}

interface CombinedData {
  date: string;
  mobickAveragePrice: number;
  btcPrice: number;
  ratio: number;
  totalPrice: number;
}

interface RatioData {
  x: Date;
  y: number;
}

const CandlestickBTCChart: React.FC = () => {
  const [series, setSeries] = useState<
    { name: string; type: string; data: RatioData[] }[]
  >([
    {
      name: "MOBICK/BTC",
      type: "line",
      data: [],
    },
  ]);
  const [combinedData, setCombinedData] = useState<CombinedData[]>([]);
  const [minRatio, setMinRatio] = useState(0);
  const [maxRatio, setMaxRatio] = useState(0);
  const [timeframe, setTimeframe] = useState("daily");
  const [originalData, setOriginalData] = useState<CombinedData[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        const { data: mobickData } = await getDailyTradeStats();
        const btcData: BTCData[] = await getBTCPriceData();

        const btcDataMap = btcData.reduce<Record<string, BTCData>>(
          (acc, btc) => {
            acc[btc.date] = btc;
            return acc;
          },
          {}
        );

        const combinedData: CombinedData[] = mobickData
          .filter((stat: MobickData) => btcDataMap[stat.date])
          .map((stat: MobickData) => {
            const btc = btcDataMap[stat.date];
            const mobickAveragePrice = (stat.openPrice + stat.closePrice) / 2;
            const btcPrice = (btc.openPrice + btc.closePrice) / 2;
            const ratio = mobickAveragePrice / btcPrice;
            return {
              date: stat.date,
              mobickAveragePrice,
              btcPrice,
              ratio,
              totalPrice: stat.totalPrice,
            };
          });

        setOriginalData(combinedData); // Save the original data
        updateChart("daily", combinedData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    run();
  }, []);

  const aggregateData = (data: CombinedData[], interval: number) => {
    const aggregatedData: CombinedData[] = [];
    for (let i = 0; i < data.length; i += interval) {
      const subset = data.slice(i, i + interval);
      const aggregated = subset.reduce(
        (acc, cur) => {
          acc.mobickAveragePrice += cur.mobickAveragePrice;
          acc.btcPrice += cur.btcPrice;
          acc.ratio += cur.ratio;
          acc.totalPrice += cur.totalPrice;
          return acc;
        },
        {
          date: subset[0].date,
          mobickAveragePrice: 0,
          btcPrice: 0,
          ratio: 0,
          totalPrice: 0,
        }
      );

      aggregated.mobickAveragePrice /= subset.length;
      aggregated.btcPrice /= subset.length;
      aggregated.ratio /= subset.length;
      aggregatedData.push(aggregated);
    }
    return aggregatedData;
  };

  const updateChart = (timeframe: string, data: CombinedData[]) => {
    let filteredData: CombinedData[];

    if (timeframe === "weekly") {
      filteredData = aggregateData(data, 7);
    } else if (timeframe === "monthly") {
      filteredData = aggregateData(data, 30);
    } else {
      filteredData = data;
    }

    const ratioData = filteredData.map((stat) => ({
      x: new Date(stat.date),
      y: stat.ratio,
    }));

    const allRatios = filteredData.map((stat) => stat.ratio);
    const lowestRatio = Math.min(...allRatios);
    const highestRatio = Math.max(...allRatios);

    const adjustedMinRatio = Math.floor(lowestRatio / 0.0005) * 0.0005;
    const adjustedMaxRatio = Math.ceil(highestRatio / 0.0005) * 0.0005;

    setMinRatio(adjustedMinRatio);
    setMaxRatio(adjustedMaxRatio);
    setSeries([{ name: "MOBICK/BTC", type: "line", data: ratioData }]);
    setCombinedData(filteredData); // Save the filtered data for tooltip
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
    yaxis: {
      title: {
        text: "MOBICK/BTC Ratio",
      },
      min: minRatio,
      max: maxRatio,
      tickAmount: Math.ceil((maxRatio - minRatio) / 0.0005), // 레이블을 0.0005 단위로 설정
      labels: {
        formatter: (val) => val.toFixed(6),
      },
    },
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
    colors: ["#00E396"],
    legend: {
      show: false,
    },
    tooltip: {
      shared: true,
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const data = combinedData[dataPointIndex];
        if (!data) return `<div>No data available</div>`;
        return `
          <div class="apexcharts-tooltip-candlestick">
            <div>Date: ${data.date}</div>
            <div>MOBICK Average Price: ${data.mobickAveragePrice.toFixed(
              2
            )}</div>
            <div>BTC Price: ${data.btcPrice.toFixed(2)}</div>
            <div>1 MOBICK = ${data.ratio.toFixed(6)} BTC</div>
          </div>
        `;
      },
    },
  };

  return (
    <ChartContainer>
      <TitleContainer>
        <div>MOBICK/BTC</div>
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
        type="line"
        height={250}
      />
    </ChartContainer>
  );
};

export default CandlestickBTCChart;
