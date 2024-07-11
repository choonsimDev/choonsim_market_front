import styled from "styled-components";
import StockInfoWrapper from "../common/StockInfo";
import OrderTable from "./OrderTable";
import { useRouter } from "next/router";

const MainComponentBlock = styled.div`
  padding-inline: 1.5rem;
  flex: 1;
`;

const OrderButtonBlock = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const OrderBuyButton = styled.button`
  border: 0.0625rem solid #ffe2e1;
  border-radius: 8px;
  width: 9.4375rem;
  height: 2.5rem;
  color: #ff362f;
  font-size: 1.125rem;
  font-weight: bold;
  background-color: #fff4f4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
`;
const OrderSellButton = styled.button`
  border: 0.0625rem solid #daecff;
  border-radius: 8px;
  width: 9.4375rem;
  height: 2.5rem;
  color: #0078ff;
  font-size: 1.125rem;
  font-weight: bold;
  background-color: #f2f8ff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.05);
`;

export const MainComponent = () => {
  const router = useRouter();
  return (
    <MainComponentBlock>
      <StockInfoWrapper />
      <OrderTable />
      <OrderButtonBlock>
        <OrderBuyButton onClick={() => router.push("/create-order/buy")}>
          <img src="/svg/icon/button_buy.png" width={20} />
          구매하기
        </OrderBuyButton>
        <OrderSellButton onClick={() => router.push("/create-order/sell")}>
          <img src="/svg/icon/button_sell.png" width={20} />
          판매하기
        </OrderSellButton>
      </OrderButtonBlock>
    </MainComponentBlock>
  );
};
