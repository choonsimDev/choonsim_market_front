import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { matchOrders, updateOrderStatus, processOrder } from "@/lib/apis/order";
import { getAllTrades } from "@/lib/apis/trade";
import { set } from "date-fns";

const OptionButtonContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const Button = styled.button<{ highlight?: boolean }>`
  width: 90px;
  height: 20px;
  border: 1px solid #bbbfc1;
  border-radius: 0.09794rem;
  background: ${({ highlight }) => (highlight ? "#00FFA3" : "#fff")};
  color: #242731;
  font-family: Poppins;
  font-size: 0.5rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  margin-left: 0rem;
  background: #fff;
  border: 0.392px solid #bbbfc1;
  border-radius: 0.09794rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const DropdownItem = styled.div<{ disabled?: boolean }>`
  width: 5rem;
  padding: 10px;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: ${({ disabled }) => (disabled ? "#bbbfc1" : "#242731")};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  &:hover {
    background: ${({ disabled }) => (disabled ? "inherit" : "#faff00")};
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;

const PopupContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0.5rem;
`;

const Popup = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 0.3125rem;
  background: #fff;
  padding: 0.5rem 0.8rem;
`;

const PopupTitle = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #000;
  font-size: 28px;
  font-weight: bold;
  padding: 1rem;
`;

const PopupText = styled.p`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 300px;
  color: #575f6e;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.75rem; /* 140% */
  padding-left: 1rem;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const AddressText = styled.p`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  color: #575f6e;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.75rem; /* 140% */
  padding-left: 1rem;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const PopupTextContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid #575f6e;
`;

const HighlightedBuy = styled.span`
  color: #f00;
  font-family: Poppins;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.75rem;
`;

const HighlightedSell = styled.span`
  color: #0038ff;
  font-family: Poppins;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.75rem;
`;

const CloseButton = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  border-radius: 10px;
  border: 1px solid #bbbfc1;
  background: #00ffa3;
  text-align: center;
  font-size: 14px;
  color: #000;
  text-transform: capitalize;
  padding: 1rem 1.5rem 1rem 1.5rem;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const CopyButton = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: blue;
  text-align: center;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem; /* 150% */
  text-transform: capitalize;
  transition: color 0.3s;
  padding: 1rem 1.5rem 1rem 1.5rem;
  cursor: pointer;
  &:hover {
    color: blue;
    text-decoration: underline;
  }
  &:active {
    transform: translateY(1px);
  }
`;

const BankInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #dba8a8;
  font-family: Inter;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  padding-left: 1rem;
  margin-bottom: 1rem;
`;

const SubText = styled.p`
  display: flex;
  flex-direction: row;
  font-family: Poppins;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.75rem;
  margin: 0;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 5rem;
  border: 1px solid #bbbfc1;
  border-radius: 0.25rem;
  font-family: Poppins;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
  resize: none;
`;

const CopyText = styled(PopupText)`
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
  cursor: pointer;
`;

export interface DataItem {
  id: string;
  type: "BUY" | "SELL";
  status: number;
  price: number;
  amount: number;
  remainingAmount: number;
  nickname: string;
  phoneNumber: string;
  blockchainAddress: string;
  bankName: string;
  username: string;
  accountNumber: string;
  processed: boolean; // Add processed field
  createdAt: string; // 날짜 정보를 포함하는 필드 추가
  orderNumber: string; // 날짜 정보를 포함하는 필드 추가
}

export interface TradeItem {
  amount: number;
  buyOrderId: string;
  sellOrderId: string;
  createdAt: string;
  buyNickname: string;
  sellNickname: string;
  price: number;
}

interface OptionButtonProps {
  value: string;
  onChange: (value: string, status: number, processed?: boolean) => void;
  item: DataItem;
  highlight?: boolean;
}

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  const notification = document.createElement("div");
  notification.textContent = "복사되었습니다.";
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.left = "50%";
  notification.style.transform = "translateX(-50%)";
  notification.style.backgroundColor = "#333";
  notification.style.color = "#fff";
  notification.style.padding = "10px 20px";
  notification.style.borderRadius = "5px";
  notification.style.zIndex = "1000";
  document.body.appendChild(notification);

  setTimeout(() => {
    document.body.removeChild(notification);
  }, 2000);
};

const OptionButton: React.FC<OptionButtonProps> = ({
  value,
  onChange,
  item,
  highlight,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);
  const [showPopup3, setShowPopup3] = useState(false);
  const [popupData, setPopupData] = useState<DataItem | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [matchAmount, setMatchAmount] = useState(0);
  const [tradeData, setTradeData] = useState<TradeItem[] | null>(null);
  const [latestAmount, setLatestAmount] = useState<number | null>(null);
  const [buyNickname, setBuyNickname] = useState<string | null>(null); // 추가된 부분
  const [sellNickname, setSellNickname] = useState<string | null>(null); // 추가된 부분

  const fetchTradeData = async () => {
    try {
      const response = await getAllTrades();
      setTradeData(response.data);
      console.log(
        "Trade data fetched:",
        response.data[response.data.length - 1]
      );
    } catch (error) {
      console.error("Failed to fetch trade data:", error);
    }
  };

  useEffect(() => {
    if (tradeData) {
      const relevantTrades = tradeData.filter(
        (trade) => trade.buyOrderId === item.id || trade.sellOrderId === item.id
      );

      if (relevantTrades.length > 0) {
        const latestTrade = relevantTrades.reduce((latest, current) =>
          new Date(latest.createdAt) > new Date(current.createdAt)
            ? latest
            : current
        );
        setLatestAmount(latestTrade.amount);
        // 판매자의 닉네임을 설정합니다.
        if (item.type === "BUY") {
          setSellNickname(latestTrade.sellNickname);
          setBuyNickname(latestTrade.buyNickname);
        }
      }
    }
  }, [tradeData, item.id]);

  const handleOptionClick = async (option: string) => {
    await fetchTradeData();

    setShowOptions(false);
    if (option === "진행중") {
      setPopupData(item);
      setShowPopup1(true);
    } else if (option === "처리 대기") {
      setPopupData(item);
      setShowPopup2(true);
    } else if (option === "입금 확인중") {
      try {
        await updateOrderStatus(item.id, { status: 0 });
        console.log("Status updated to 0");
        onChange(option, 0); // 상태 업데이트 후 상태 갱신
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    } else if (option == "매칭 완료") {
      try {
        await updateOrderStatus(item.id, { status: 3 });
        console.log("Status updated to 3");
        onChange(option, 3);
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    } else if (option === "반환/취소") {
      setPopupData(item);
      setShowPopup3(true);
    }
  };

  const handleDirectPopupClick = () => {
    setPopupData(item);
    setShowPopup2(true);
  };

  const handleConfirmClick = async () => {
    try {
      await updateOrderStatus(item.id, { status: 1 });
      await matchOrders();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleConfirmProcessing = async () => {
    if (!popupData) return; // popupData가 null인 경우 함수를 종료합니다.

    try {
      // 구매자와 판매자의 remainingAmount 중 작은 값을 matchAmount로 설정합니다.
      const matchA = Math.min(item.remainingAmount, popupData.remainingAmount);
      setMatchAmount(matchA);

      // 구매자의 remainingAmount를 차감한 값을 updatedItemRemainingAmount로 설정합니다.
      const updatedItemRemainingAmount = item.remainingAmount - matchAmount;
      console.log(
        `Updating item ${item.id} with remainingAmount: ${updatedItemRemainingAmount}`
      );

      // 구매자의 상태와 remainingAmount를 업데이트합니다.
      await updateOrderStatus(item.id, {
        status: updatedItemRemainingAmount === 0 ? 3 : 1, // remainingAmount가 0이면 상태를 3으로, 그렇지 않으면 1로 설정합니다.
        remainingAmount: updatedItemRemainingAmount, // 차감된 remainingAmount를 설정합니다.
      });

      // 판매자의 remainingAmount를 차감한 값을 updatedPopupRemainingAmount로 설정합니다.
      const updatedPopupRemainingAmount =
        popupData.remainingAmount - matchAmount;
      console.log(
        `Updating popupData ${popupData.id} with remainingAmount: ${updatedPopupRemainingAmount}`
      );

      // 판매자의 상태와 remainingAmount를 업데이트합니다.
      await updateOrderStatus(popupData.id, {
        status: updatedPopupRemainingAmount === 0 ? 3 : 1, // remainingAmount가 0이면 상태를 3으로, 그렇지 않으면 1로 설정합니다.
        remainingAmount: updatedPopupRemainingAmount, // 차감된 remainingAmount를 설정합니다.
      });

      onChange("입금 완료", 3); // 상태 변경을 호출합니다.
      setShowPopup2(false); // 팝업을 닫습니다.
    } catch (error) {
      console.error("Failed to update order status:", error); // 에러가 발생하면 콘솔에 에러 메시지를 출력합니다.
    }
  };

  const handleCompletePayment = async () => {
    try {
      if (item.remainingAmount === 0) {
        await updateOrderStatus(item.id, { status: 3 });
        onChange("입금 완료", 3);
      } else {
        await updateOrderStatus(item.id, { status: 1 });
        onChange("진행중", 1);
      }
    } catch (error) {
      console.error("Failed to complete payment:", error);
    }
  };

  const handleConfirmCancellation = async () => {
    try {
      await updateOrderStatus(item.id, { status: 4, cancellationReason });
      onChange("반환/취소", 4);
      setShowPopup3(false);
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const isProcessing = item.status === 2 && !item.processed;

  return (
    <OptionButtonContainer>
      <Button
        onClick={() =>
          isProcessing ? handleDirectPopupClick() : setShowOptions(!showOptions)
        }
        highlight={highlight}
      >
        {isProcessing ? "처리 대기" : value}
      </Button>
      {showOptions && (
        <Dropdown>
          {item.status === 0 ? (
            <>
              <DropdownItem disabled>입금 확인중</DropdownItem>
              <DropdownItem onClick={() => handleOptionClick("진행중")}>
                입금 확인
              </DropdownItem>
              <DropdownItem onClick={() => handleOptionClick("반환/취소")}>
                반환/취소
              </DropdownItem>
            </>
          ) : item.status === 2 ? (
            <>
              <DropdownItem onClick={() => handleOptionClick("입금 확인중")}>
                입금 확인중
              </DropdownItem>
              <DropdownItem disabled>진행중</DropdownItem>
              <DropdownItem
                onClick={() => handleOptionClick("처리 대기")}
                style={{ color: "#329EFF", fontWeight: "bold" }}
              >
                입금 완료
              </DropdownItem>
              <DropdownItem disabled>반환/취소</DropdownItem>
            </>
          ) : item.status === 1 ? (
            <>
              <DropdownItem onClick={() => handleOptionClick("입금 확인중")}>
                입금 확인중
              </DropdownItem>
              <DropdownItem disabled>진행중</DropdownItem>
              <DropdownItem onClick={() => handleOptionClick("매칭 완료")}>
                매칭 완료
              </DropdownItem>
            </>
          ) : item.status === 3 ? (
            <>
              <DropdownItem onClick={() => handleOptionClick("입금 확인중")}>
                입금 확인중
              </DropdownItem>
              <DropdownItem disabled>진행중</DropdownItem>
              <DropdownItem disabled>매칭 완료</DropdownItem>
            </>
          ) : (
            <>
              <DropdownItem onClick={() => handleOptionClick("입금 확인중")}>
                입금 확인중
              </DropdownItem>

              <DropdownItem onClick={() => handleOptionClick("반환/취소")}>
                반환/취소
              </DropdownItem>
            </>
          )}
        </Dropdown>
      )}
      {showPopup1 && popupData && (
        <Backdrop onClick={() => setShowPopup1(false)}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            {popupData.type === "BUY" ? (
              <Popup>
                <PopupTitle>입금확인</PopupTitle>
                <PopupText>
                  구분 : <HighlightedBuy>구매자</HighlightedBuy>
                </PopupText>
                <PopupTextContainer>
                  <PopupText>입금자명 : {popupData.username}</PopupText>
                  <div>|</div>
                  <PopupText>닉네임 : {popupData.nickname}</PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>
                    신청 가격 : {popupData.price.toLocaleString()}원
                  </PopupText>
                  <div>|</div>
                  <PopupText>신청 수량 : {popupData.amount} 개</PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>
                    입금 확인 금액 :{" "}
                    <HighlightedBuy
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      {(popupData.price * popupData.amount).toLocaleString()}원
                    </HighlightedBuy>
                  </PopupText>
                </PopupTextContainer>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmClick}>
                    확인했습니다
                  </CloseButton>
                </ButtonContainer>
              </Popup>
            ) : (
              <Popup>
                <PopupTitle>입금확인</PopupTitle>

                <PopupText>
                  구분 : <HighlightedSell>판매자</HighlightedSell>
                </PopupText>
                <PopupTextContainer>
                  <PopupText>입금자명 : {popupData.username}</PopupText>
                  <div>|</div>
                  <PopupText>닉네임 : {popupData.nickname}</PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>
                    신청 가격 : {popupData.price.toLocaleString()}원
                  </PopupText>
                  <div>|</div>

                  <PopupText>신청 수량 : {popupData.amount} 개</PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <AddressText>
                    입금 주소 :{" "}
                    <HighlightedSell>
                      {popupData.blockchainAddress}
                    </HighlightedSell>
                  </AddressText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>
                    입금 확인 수량 :{" "}
                    <HighlightedSell
                      style={{ color: "blue", fontWeight: "bold" }}
                    >
                      {popupData.amount} 개
                    </HighlightedSell>
                  </PopupText>
                  <div>|</div>
                  <PopupText>
                    <HighlightedSell
                      style={{
                        color: "blue",
                        textDecoration: "underline",
                      }}
                      onClick={() =>
                        handleCopy(
                          `${popupData.username} / ${(popupData.price / 10000)
                            .toFixed(2)
                            .toLocaleString()}만원 / ${popupData.amount}개`
                        )
                      }
                    >
                      {popupData.username} /{" "}
                      {(popupData.price / 10000).toFixed(2).toLocaleString()}
                      만원 / {popupData.amount} 개
                    </HighlightedSell>
                  </PopupText>
                </PopupTextContainer>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmClick}>
                    확인했습니다
                  </CloseButton>
                </ButtonContainer>
              </Popup>
            )}
          </PopupContainer>
        </Backdrop>
      )}

      {showPopup2 && popupData && (
        <Backdrop onClick={() => setShowPopup2(false)}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            {popupData.type === "BUY" ? (
              <Popup>
                <PopupTitle>입금을 완료하세요.</PopupTitle>
                <PopupTextContainer />
                <PopupTextContainer>
                  <PopupText>
                    구분 : <HighlightedBuy>구매자</HighlightedBuy>
                  </PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>신청자명 : {popupData.username}</PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>
                    신청 가격 : {popupData.price.toLocaleString()}원
                  </PopupText>
                  <div>|</div>

                  <PopupText>
                    신청 수량 : {popupData.amount - popupData.remainingAmount}{" "}
                    개
                  </PopupText>
                </PopupTextContainer>
                <PopupTextContainer />
                <PopupTextContainer>
                  <AddressText>
                    주소 :{" "}
                    <HighlightedBuy>
                      {" "}
                      {popupData.blockchainAddress}
                    </HighlightedBuy>
                  </AddressText>
                  <div>|</div>
                  <PopupText>
                    입금액 :{" "}
                    <HighlightedBuy>
                      {" "}
                      {latestAmount !== null
                        ? `${latestAmount} Mo`
                        : "N/A"}{" "}
                    </HighlightedBuy>
                  </PopupText>
                </PopupTextContainer>

                <PopupTextContainer>
                  <PopupText>
                    {popupData.blockchainAddress}, {popupData.amount} 개
                  </PopupText>{" "}
                  <CopyButton
                    onClick={() =>
                      handleCopy(
                        `${popupData.blockchainAddress}, ${
                          latestAmount !== null ? latestAmount : "N/A"
                        }`
                      )
                    }
                  >
                    복사하기
                  </CopyButton>
                </PopupTextContainer>
                {/* <PopupTextContainer>[DataItem의 username]과, [DataItem의 id와 일치하는 TradeItem의 sellOrderId]가 있는 경우, 해당 TradeItem의 sellNickName을 불러오고싶</PopupTextContainer> */}
                <PopupTextContainer>
                  <CopyText
                    onClick={() =>
                      //아래 내용 복사하기
                      handleCopy(
                        `구매자 : ${
                          buyNickname ? buyNickname : "loading"
                        } | 판매자 : ${
                          sellNickname ? sellNickname : "loading"
                        } | ${
                          latestAmount !== null ? latestAmount : "N/A"
                        } Mo | ${popupData.price.toLocaleString()}원`
                      )
                    }
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      color: "blue",
                    }}
                  >
                    {" "}
                    {buyNickname ? (
                      <span>구매자 : {buyNickname}</span>
                    ) : (
                      <span>loading</span>
                    )}{" "}
                    |{" "}
                    {sellNickname ? (
                      <span>판매자 : {sellNickname}</span>
                    ) : (
                      <span>loading</span>
                    )}
                    | {latestAmount !== null ? `${latestAmount} Mo` : "N/A"} |{" "}
                    {popupData.price.toLocaleString()}원
                  </CopyText>
                </PopupTextContainer>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmProcessing}>
                    모빅 전송 완료
                  </CloseButton>
                </ButtonContainer>
              </Popup>
            ) : (
              <Popup>
                <PopupTitle>입금을 완료하세요.</PopupTitle>
                <PopupTextContainer />
                <PopupTextContainer>
                  <PopupText>
                    구분 : <HighlightedSell>판매자</HighlightedSell>
                  </PopupText>
                </PopupTextContainer>{" "}
                <PopupTextContainer>
                  <PopupText>신청자명 : {popupData.username}</PopupText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <PopupText>
                    신청 가격 : {popupData.price.toLocaleString()}원
                  </PopupText>
                  <PopupText>
                    신청 수량 : {popupData.amount - popupData.remainingAmount}{" "}
                    개
                  </PopupText>
                </PopupTextContainer>
                <PopupTextContainer />
                <PopupTextContainer>
                  <CopyText
                    onClick={() =>
                      handleCopy(
                        `${(
                          popupData.price *
                          (popupData.amount - popupData.remainingAmount)
                        ).toLocaleString()}`
                      )
                    }
                  >
                    입금액 :{" "}
                    <HighlightedSell style={{ textDecoration: "underline" }}>
                      {(
                        popupData.price *
                        (popupData.amount - popupData.remainingAmount)
                      ).toLocaleString()}
                      원
                    </HighlightedSell>
                  </CopyText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <CopyText onClick={() => handleCopy(popupData.bankName)}>
                    은행명 :{" "}
                    <HighlightedSell style={{ textDecoration: "underline" }}>
                      {popupData.bankName}
                    </HighlightedSell>
                  </CopyText>
                  <CopyText onClick={() => handleCopy(popupData.username)}>
                    입금자명 :{" "}
                    <HighlightedSell style={{ textDecoration: "underline" }}>
                      {popupData.username}
                    </HighlightedSell>
                  </CopyText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <CopyText onClick={() => handleCopy(popupData.accountNumber)}>
                    계좌번호 :{" "}
                    <HighlightedSell style={{ textDecoration: "underline" }}>
                      {popupData.accountNumber}
                    </HighlightedSell>
                  </CopyText>
                </PopupTextContainer>
                <PopupTextContainer>
                  <CopyText>
                    메모 :
                    <HighlightedSell
                      style={{ textDecoration: "underline" }}
                      onClick={() =>
                        handleCopy(
                          `${(popupData.price / 10000)
                            .toFixed(2)
                            .toLocaleString()}만, ${
                            latestAmount !== null ? latestAmount : "N/A"
                          }개`
                        )
                      }
                    >
                      {`${(popupData.price / 10000)
                        .toFixed(2)
                        .toLocaleString()}만, ${
                        latestAmount !== null ? latestAmount : "N/A"
                      }개`}
                    </HighlightedSell>
                  </CopyText>
                </PopupTextContainer>
                <ButtonContainer>
                  <CloseButton onClick={handleCompletePayment}>
                    원화 입금 완료
                  </CloseButton>
                </ButtonContainer>
              </Popup>
            )}
          </PopupContainer>
        </Backdrop>
      )}
      {showPopup3 && popupData && (
        <Backdrop onClick={() => setShowPopup3(false)}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <Popup>
              <PopupText>반환 사유를 적어주세요</PopupText>
              <Textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
              />
              <ButtonContainer>
                <CloseButton onClick={handleConfirmCancellation}>
                  완료
                </CloseButton>
              </ButtonContainer>
            </Popup>
          </PopupContainer>
        </Backdrop>
      )}
    </OptionButtonContainer>
  );
};

export default OptionButton;
