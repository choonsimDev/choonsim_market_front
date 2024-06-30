import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { ApexOptions } from 'apexcharts';
import { getDailyTradeStats } from '@/lib/apis/trade';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartContainer = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const roundUpPriceBTC = (price: number) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(price) + 1));
    return Math.ceil(price * magnitude) / magnitude;
};

const roundDownPriceBTC = (price: number) => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(price) + 1));
    return Math.floor(price * magnitude) / magnitude;
};

const CandlestickBTCChart: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: "Candlestick",
      type: "candlestick",
      data: []
    },
    {
      name: "Volume",
      type: "bar",
      data: []
    }
  ]);

  const [minPriceBTC, setMinPriceBTC] = useState(0);
  const [maxPriceBTC, setMaxPriceBTC] = useState(0);
  const [maxVolume, setMaxVolume] = useState(0);

  useEffect(() => {
    const run = async () => {
        const { data } = await getDailyTradeStats();
        const candlestickData = data.map((stat: any) => ({
            x: new Date(stat.date),
            y: [stat.openPriceBTC, stat.highPriceBTC, stat.lowPriceBTC, stat.closePriceBTC]
        }));
        const volumeData = data.map((stat: any) => ({
            x: new Date(stat.date),
            y: stat.totalPrice
        }));

        const allLowPricesBTC = data.map((stat: any) => stat.lowPriceBTC);
        const allHighPricesBTC = data.map((stat: any) => stat.highPriceBTC);
        const lowestPriceBTC = Math.min(...allLowPricesBTC);
        const highestPriceBTC = Math.max(...allHighPricesBTC);

        setMinPriceBTC(lowestPriceBTC * 0.9);
        setMaxPriceBTC(highestPriceBTC * 1.1);
        setMaxVolume(Math.max(...data.map((stat: any) => stat.totalPrice)) * 30);

        setSeries([
            { name: "Candlestick", type: "candlestick", data: candlestickData },
            { name: "Volume", type: "bar", data: volumeData }
        ]);
    };

    run();
  }, []);

  const options: ApexOptions = {
    chart: {
      height: 238,
      toolbar: {
        show: false
      }
    },
    xaxis: {
      type: 'datetime',
      min: new Date().setDate(new Date().getDate() - 30),
      max: new Date().getTime(),
      labels: {
        show: false
      },
    },
    yaxis: [{
      title: {
        text: 'Price (BTC)',
      },
      show: false,
      min: minPriceBTC,
      max: maxPriceBTC,
    }, {
      seriesName: 'Volume',
      opposite: true,
      show: false,
      axisTicks: {
        show: true
      },
      axisBorder: {
        show: true
      },
      labels: {
        style: {
          colors: '#00E396',
        },
      },
      title: {
        text: 'Volume',
        style: {
          color: '#00E396',
        }
      },
      min: 0,
      max: maxVolume,
    }],
    plotOptions: {
      bar: {
        columnWidth: '80%',
        colors: {
            ranges: [{
              from: 0,
              to: Infinity,
              color: '#e6e6e6'
            }],
        },
        dataLabels: {
          position: 'top'
        }
      },
      candlestick: {
        colors: {
          upward: '#00E396',
          downward: '#FF4560'
        }
      }
    },
    legend: {
        show: false
    },
    tooltip: {
      shared: true,
    }
  };

  return (
    <ChartContainer>
      <div>MOBICK/BTC</div>
      <ReactApexChart options={options} series={series} type="candlestick" height={238} />
    </ChartContainer>
  );
};

export default CandlestickBTCChart;
