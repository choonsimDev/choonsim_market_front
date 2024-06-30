import { getTodayStats } from '@/lib/apis/trade';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StoreInfoBlock = styled.div`
  display: flex;
  flex-direction: column;
`;

const StoreInfoText = styled.div`
  font-size: 12px;
  font-weight: bold;
  height: 24px;
`;

const StockInfoContainer = styled.div`
  display: flex;
  align-items: center;
  color: #fff;
  padding: 12px 27px;
  border: 1px solid #BBBFC1;
  border-radius: 5px;
  justify-content: space-between;
`;

const PriceContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const TodayPrice = styled.div`
  color: black;
  font-size: 18px;
  font-weight: bold;
`;

const PriceInfo = styled.div<PriceInfoProps>`
  margin-right: auto;
  color: ${props => (props.isPositive ? '#ff0000' : '#00ff00')};
  font-size: 14px;
  font-weight: bold;
`;

const CandlestickChart = styled.img`
`;

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
  const icon = isPositive ? '▲' : '▼';
  const router = useRouter();
  const handleClickCandlestickChart = () => {
    if(router.pathname === '/') {
      router.push('/chart');
    } else {
      router.push('/');
    }
  }

  return (
    <StoreInfoBlock>
      <StoreInfoText>오늘 평균 가격:</StoreInfoText>
      <StockInfoContainer>
        <PriceContainer>
          <TodayPrice>{todayAvgPrice}</TodayPrice>
          <PriceInfo isPositive={isPositive}>
            {isPositive ? '+' : '-'}{Math.abs(difference)} {icon} {Math.abs(percentageChange).toFixed(2)}% (전일대비)
          </PriceInfo>
        </PriceContainer>
        <CandlestickChart src="/svg/candle-image.svg" onClick={handleClickCandlestickChart}/>
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
