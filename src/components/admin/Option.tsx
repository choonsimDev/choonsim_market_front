import styled from "styled-components";
import React, { useState } from "react";
import { matchOrders, updateOrderStatus, processOrder } from "@/lib/apis/order";

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
}

interface OptionButtonProps {
  value: string;
  onChange: (value: string, status: number, processed?: boolean) => void;
  item: DataItem;
  highlight?: boolean;
}

const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("클립보드에 복사되었습니다.");
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

  const handleOptionClick = async (option: string) => {
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
        window.location.reload();
      } catch (error) {
        console.error("Failed to update order status:", error);
      }
    } else if (option == "매칭 완료") {
      try {
        await updateOrderStatus(item.id, { status: 2 });
        console.log("Status updated to 2");
        onChange(option, 2);
        window.location.reload();
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
      window.location.reload();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleConfirmProcessing = async () => {
    try {
      await processOrder(item.id, true);
      onChange("매칭 대기중", 1, true);
      if (item.remainingAmount === 0) {
        await updateOrderStatus(item.id, { status: 2 });
        onChange("매칭 완료", 2);
      }
      setShowPopup1(false);
      setShowPopup2(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const handleConfirmCancellation = async () => {
    try {
      await updateOrderStatus(item.id, { status: 3, cancellationReason });
      onChange("반환/취소", 3);
      setShowPopup3(false);
      window.location.reload();
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  const isProcessing = item.status === 1 && !item.processed;

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
          <DropdownItem onClick={() => handleOptionClick("입금 확인중")}>
            입금 확인중
          </DropdownItem>
          <DropdownItem onClick={() => handleOptionClick("진행중")}>
            진행중
          </DropdownItem>
          <DropdownItem onClick={() => handleOptionClick("매칭 완료")}>
            매칭 완료
          </DropdownItem>
          <DropdownItem onClick={() => handleOptionClick("반환/취소")}>
            반환/취소
          </DropdownItem>
        </Dropdown>
      )}
      {showPopup1 && popupData && (
        <Backdrop onClick={() => setShowPopup1(false)}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            {popupData.type === "BUY" ? (
              <Popup>
                <PopupText>
                  구분 : <HighlightedBuy>구매</HighlightedBuy>
                </PopupText>
                <PopupText>입금자명 : {popupData.username}</PopupText>
                <PopupText>
                  신청 가격 : {popupData.price.toLocaleString()}원
                </PopupText>
                <PopupText>신청 수량 : {popupData.amount} 개</PopupText>
                <PopupText>
                  입금한 금액 :{" "}
                  <HighlightedBuy>
                    {(popupData.price * popupData.amount).toLocaleString()}원
                  </HighlightedBuy>
                </PopupText>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmClick}>
                    확인 완료
                  </CloseButton>
                </ButtonContainer>
              </Popup>
            ) : (
              <Popup>
                <PopupText>
                  구분 : <HighlightedSell>판매</HighlightedSell>
                </PopupText>
                <PopupText>지갑주소 : {popupData.blockchainAddress}</PopupText>
                <PopupText>
                  신청 가격 : {popupData.price.toLocaleString()}원
                </PopupText>
                <PopupText>
                  신청 수량 :{" "}
                  <HighlightedSell>{popupData.amount} 개</HighlightedSell>
                </PopupText>
                <PopupText>
                  입금받은 수량 :{" "}
                  <HighlightedSell>{popupData.amount} 개</HighlightedSell>
                </PopupText>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmClick}>
                    확인 완료
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
                <PopupText>구분 : 구매자</PopupText>
                <PopupText>신청자명 : {popupData.username}</PopupText>
                <PopupText>
                  신청 가격 : {popupData.price.toLocaleString()}원
                </PopupText>
                <PopupText>
                  신청 수량 : {popupData.amount - popupData.remainingAmount} 개
                </PopupText>
                <PopupText>
                  입금액 :{" "}
                  <HighlightedSell>
                    {" "}
                    {popupData.amount - popupData.remainingAmount} Mo{" "}
                  </HighlightedSell>
                </PopupText>
                <BlockChainAddressContainer>
                  <BlockChainAddress>
                    {popupData.blockchainAddress}
                  </BlockChainAddress>
                  <CopyButton
                    onClick={() => handleCopy(popupData.blockchainAddress)}
                  >
                    복사
                  </CopyButton>
                </BlockChainAddressContainer>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmProcessing}>
                    입금 완료
                  </CloseButton>
                </ButtonContainer>
              </Popup>
            ) : (
              <Popup>
                <PopupText>구분 : 판매자</PopupText>
                <PopupText>신청자명 : {popupData.username}</PopupText>
                <PopupText>
                  신청 가격 : {popupData.price.toLocaleString()}원
                </PopupText>
                <PopupText>
                  신청 수량 : {popupData.amount - popupData.remainingAmount} 개
                </PopupText>
                <PopupText>
                  입금액 :{" "}
                  <HighlightedBuy>
                    {(
                      popupData.price *
                      (popupData.amount - popupData.remainingAmount)
                    ).toLocaleString()}
                    원
                  </HighlightedBuy>
                  <CopyButton
                    onClick={() =>
                      handleCopy(
                        (
                          popupData.price *
                          (popupData.amount - popupData.remainingAmount)
                        ).toString()
                      )
                    }
                  >
                    복사
                  </CopyButton>
                </PopupText>
                <BankInfo>
                  <SubText>은행명 : {popupData.bankName}</SubText>
                  <SubText>
                    계좌번호 : {popupData.accountNumber}{" "}
                    <CopyButton
                      onClick={() => handleCopy(popupData.accountNumber)}
                    >
                      복사
                    </CopyButton>
                  </SubText>
                </BankInfo>
                <ButtonContainer>
                  <CloseButton onClick={handleConfirmProcessing}>
                    입금 완료
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

const DropdownItem = styled.div`
  width: 5rem;
  padding: 10px;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  color: #242731;
  cursor: pointer;
  &:hover {
    background: #faff00;
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
  width: 24.6875rem;
  display: flex;
  gap: 1rem;
  padding: 0.5rem;
`;

const Popup = styled.div`
  width: 24.6875rem;
  height: 100%;
  border-radius: 0.3125rem;
  background: #fff;
  padding: 0.5rem 0.8rem;
`;

const PopupText = styled.p`
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  width: 21.875rem;
  color: #575f6e;
  font-family: Poppins;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 600;
  line-height: 1.75rem; /* 140% */
  padding-left: 1rem;
  margin: 0.8rem 0;
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
  height: 3rem;
  padding: 0rem 1.5rem 0rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  border-radius: 0.25rem;
  border: 1px solid #bbbfc1;
  background: #fff;
  color: #000;
  text-align: center;
  font-family: Poppins;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 1.5rem; /* 150% */
  text-transform: capitalize;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const BlockChainAddressContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
`;

const BlockChainAddress = styled.p`
  display: flex;
  width: 21.875rem;
  height: 2.44331rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #0038ff;
  font-family: Inter;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  text-align: center;
  margin: 0;
`;

const CopyButton = styled.div`
  display: flex;
  width: 3.6875rem;
  height: 1.75738rem;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
  color: #757575;
  text-align: center;
  font-family: Poppins;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.5rem; /* 150% */
  text-transform: capitalize;
  transition: color 0.3s;

  cursor: pointer;
  &:hover {
    color: #000;
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
