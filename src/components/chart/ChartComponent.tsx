import styled from "styled-components";
import { SecondaryButton } from "../common/SecondaryButton";
import StockInfoWrapper from "../common/StockInfo";
import { useRouter } from "next/router";
import CandlestickChart from "./CandlestickChart";
import CandlestickBTCChart from "./CandlestickBTCChart";

const ChartComponentBlock = styled.div`
  padding-inline: 17px;
  flex: 1;
`;

export const ChartComponent = () => {
  const router = useRouter();
  return (
    <ChartComponentBlock>
      <StockInfoWrapper />
      <CandlestickChart />
      <CandlestickBTCChart />
      <SecondaryButton
        onClick={() => {
          router.push("/create-order");
        }}
        text="심부름 신청하기"
      />
    </ChartComponentBlock>
  );
};
