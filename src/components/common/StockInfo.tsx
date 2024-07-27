import { getTodayStats } from "@/lib/apis/trade";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const StoreInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  margin-top: 30px;
`;

const StoreInfoText = styled.div`
  width: 120px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 10px;
  background-color: #0078ff;
  font-size: 14px;
  font-weight: bold;
  color: white;
  position: absolute;
  top: -14px;
  left: 14px;
`;

const StockInfoContainer = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  padding: 20px 20px 10px 20px; /* top, right, bottom, left 순서 */
  border: 2px solid #f5f5f5;
  border-radius: 10px;
  justify-content: space-between;
  background-color: #fbfbfb;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TodayPrice = styled.div`
  color: black;
  font-size: 22px;
  font-weight: bold;
`;

const PriceInfo = styled.div<PriceInfoProps>`
  margin-right: auto;
  color: ${(props) => (props.isPositive ? "#ff0000" : "#0055ff")};
  font-size: 16px;
  font-weight: bold;
`;

const CandlestickChart = styled.img``;

interface PriceInfoProps {
  isPositive: boolean;
}

interface StockInfoProps {
  todayAvgPrice: number;
  yesterdayAvgPrice: number;
  difference: number;
  percentageChange: number;
}

const StockInfo: React.FC<StockInfoProps> = ({
  todayAvgPrice,
  difference,
  percentageChange,
}) => {
  const isPositive = difference >= 0;
  const icon = isPositive ? "▲" : "▼";
  const router = useRouter();
  const handleClickCandlestickChart = () => {
    if (router.pathname === "/") {
      router.push("/chart");
    } else {
      router.push("/");
    }
  };

  // todayAvgPrice를 포맷팅하는 함수
  const formatPrice = (price: number) => {
    return (
      new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: "KRW",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
        .format(price)
        .replace("₩", "") + "원"
    );
  };

  return (
    <StoreInfoBlock>
      <StoreInfoText>오늘의 평균 가격</StoreInfoText>
      <StockInfoContainer>
        <PriceContainer>
          <TodayPrice>{formatPrice(todayAvgPrice)}</TodayPrice>
          <PriceInfo isPositive={isPositive}>
            {isPositive ? "+" : "-"}
            {formatPrice(Math.abs(difference))} {icon}{" "}
            {Math.abs(percentageChange).toFixed(2)}% (전일대비)
          </PriceInfo>
        </PriceContainer>
        <CandlestickChart
          src="/svg/candle-image.svg"
          onClick={handleClickCandlestickChart}
        />
      </StockInfoContainer>
    </StoreInfoBlock>
  );
};

const StockInfoWrapper: React.FC = () => {
  const [stats, setStats] = useState<StockInfoProps | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await getTodayStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats) return null;

  return <StockInfo {...stats} />;
};

export default StockInfoWrapper;
