import Image from "next/image";
import { useRouter } from "next/router";
import styled from "styled-components";

const CreateOrderNavWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;
  align-items: center;
  gap: 24px;
`;

const CreateOrderNavItem = styled.div<{ $isBuy?: boolean; $isSell?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 11.63px;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => (props.$isBuy ? "red" : props.$isSell ? "blue" : "#333")};
`;

export const CreateOrderNav = () => {
  const router = useRouter();
  return (
    <CreateOrderNavWrapper>
      <CreateOrderNavItem
        $isBuy
        onClick={() => {
          router.push("/create-order/buy");
        }}
      >
        <div>
          <Image
            src={"/svg/buy-button.svg"}
            width={150}
            height={150}
            alt="buy button image"
          />
        </div>
        <div>구매하기</div>
      </CreateOrderNavItem>
      <CreateOrderNavItem
        $isSell
        onClick={() => {
          router.push("/create-order/sell");
        }}
      >
        <div>
          <Image
            src={"/svg/sell-button.svg"}
            width={150}
            height={150}
            alt="sell button image"
          />
        </div>
        <div>판매하기</div>
      </CreateOrderNavItem>
    </CreateOrderNavWrapper>
  );
};
