import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getTodayOrders } from "@/lib/apis/order";
import { Order } from "@/lib/types/order";
import Modal from "react-modal";
import { SecondaryButton } from "../common/SecondaryButton";

Modal.setAppElement("#__next");

const TableContainer = styled.div`
  width: 100%;
  max-height: 600px;
  overflow-y: auto;
  margin: 24px 0;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 4px;
  height: 33px;
  margin-bottom: 8px;
`;

const FilterButton = styled.button<{ active: boolean }>`
  font-size: 0.7rem;
  font-weight: bold;
  color: #646464;
  padding: 8px 8px;
  border-radius: 8px;
  border: #ededed 1px solid;
  background-color: ${(props) => (props.active ? "#0078ff" : "#efefef")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.active ? "#0078ff" : "#efefef")};
  }
`;

const TableBlock = styled.div`
  background-color: #f8f8f8;
  border: 1px solid #ededed;
  border-radius: 8px;
  padding: 16px 8px 10px 8px;
  font-size: 1rem;
`;

const DateHeaderBlock = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const DateHeader = styled.div`
  padding: 10px 10px;
  color: #c4c4c4;
`;

const TableHead = styled.div`
  display: flex;
  justify-content: space-around;
  color: #333;
  font-weight: bold;
`;

const TableHeader = styled.div`
  flex: 1;
  text-align: center;
  padding: 0.625rem 0px 0.625rem 0px;
  border-bottom: 0.125rem solid #ededed;
`;

const TableBody = styled.div`
  :hover {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.div<StatusProps>`
  text-align: center;
  display: inline-block;
  justify-content: center;
  align-items: center;
  font-size: 0.875rem;
  border-radius: 8px;

  border: ${(props) =>
    props.status === 0
      ? "1px solid #fe4e48"
      : props.status === 1
      ? "1px solid #0078ff"
      : props.status === 2
      ? "1px solid #ffcc00"
      : props.status === 3
      ? "1px solid #14B998"
      : props.status === 4
      ? "1px solid #646464"
      : "none"};

  color: ${(props) =>
    props.status === 0
      ? "#fe4e48"
      : props.status === 1
      ? "#0078ff"
      : props.status === 2
      ? "#ffcc00"
      : props.status === 3
      ? "#14B998"
      : props.status === 4
      ? "#646464"
      : "black"};

  background-color: ${(props) =>
    props.status === 0
      ? "rgba(254, 78, 72, 0.1)"
      : props.status === 1
      ? "rgba(0, 120, 255, 0.1)"
      : props.status === 2
      ? "rgba(255, 204, 0, 0.1)"
      : props.status === 3
      ? "rgba(20, 185, 152, 0.1)"
      : props.status === 4
      ? "rgba(100, 100, 100, 0.1)"
      : "transparent"};

  padding: ${(props) =>
    props.status === 0 ||
    props.status === 1 ||
    props.status === 2 ||
    props.status === 3 ||
    props.status === 4
      ? "0.125rem 0.5rem"
      : "auto"};
`;

const TableCellContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33%;
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 35px;
  border-bottom: 0.0625rem solid #ededed;
  cursor: pointer;
`;

const CustomModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
  height: 80%;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);

  outline: none;
`;

const InputContainer = styled.div`
  margin-bottom: 16px;
`;

const InputContainerBox = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  max-height: 80%;
  overflow-y: auto; /* 높이가 80%를 초과할 경우 스크롤 활성화 */
  justify-content: space-between;
`;

const CustomInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #ccc;
  margin: 10px 0;
  padding: 8px 0;
  font-size: 16px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  color: #000;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const ModalHeader = styled.header`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 32px;
  gap: 5px;
`;

const ModalStatusHeader = styled.div`
  font-size: 25px;
  color: #242731;
  font-weight: bold;
  text-align: center;
  padding-bottom: 17px;
`;

const ModalTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ModalContent = styled.div`
  margin-bottom: 32px;
`;

const ContentsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  background-color: #f8f8f8;
  border-radius: 8px;
`;

interface StatusProps {
  status?: number;
}

function maskNickname(nickname: string) {
  if (nickname.length === 0) {
    return "";
  }
  return `${nickname[0]}**`;
}

function formatStatus(status: number) {
  switch (status) {
    case 0:
      return "입금 확인 중";
    case 1:
      return "신청완료";
    case 2:
      return "진행중";
    case 3:
      return "심부름 완료";
    case 4:
      return "반환/취소";
    default:
      return "";
  }
}

function getTodayDate() {
  const today = new Date();
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");
  const day = dayNames[today.getDay()];
  return `${year}-${month}-${date}(${day})`;
}

interface TodayOrder {
  id: number;
  orderNumber: number;
  nickname: string;
  status: number;
  phoneNumber: string;
  cancellationReason?: string;
  type: string;
  price: number;
  amount: number;
  accountNumber: string;
  blockchainAddress: string;
  bankName: string;
  username: string;
}

const TodayOrderTable: React.FC = () => {
  const [orders, setOrders] = useState<TodayOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TodayOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<TodayOrder | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await getTodayOrders();
      const sortedData = data.sort(
        (a: TodayOrder, b: TodayOrder) => b.orderNumber - a.orderNumber
      );
      setOrders(sortedData);
      setFilteredOrders(
        activeFilter !== null
          ? sortedData.filter(
              (order: TodayOrder) => order.status === activeFilter
            )
          : sortedData
      );
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [activeFilter]);

  const handleRowClick = (order: TodayOrder) => {
    setSelectedOrder(order);
    setShowVerificationModal(true);
  };

  const verifyDetails = () => {
    if (
      selectedOrder &&
      nicknameInput === selectedOrder.nickname &&
      phoneNumberInput === selectedOrder.phoneNumber
    ) {
      setShowVerificationModal(false);
      setShowDetailsModal(true);
    } else {
      alert("입력 정보가 일치하지 않습니다.");
    }
  };

  const handleFilterClick = (status: number | null) => {
    setActiveFilter(status);
    if (status === null) {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(
        (order: TodayOrder) => order.status === status
      );
      setFilteredOrders(filtered);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    switch (name) {
      case "nicknameInput":
        setNicknameInput(value);
        break;
      case "phoneNumberInput":
        const formattedPhone = formatPhoneNumber(value);
        setPhoneNumberInput(formattedPhone);
        break;
    }
  };

  const formatPhoneNumber = (value: string) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) return digits;
    if (digits.length <= 7)
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
  };

  return (
    <TableContainer>
      <FilterContainer>
        <FilterButton
          active={activeFilter === null}
          onClick={() => handleFilterClick(null)}
        >
          전체
        </FilterButton>
        <FilterButton
          active={activeFilter === 0}
          onClick={() => handleFilterClick(0)}
        >
          입금 확인중
        </FilterButton>
        <FilterButton
          active={activeFilter === 1}
          onClick={() => handleFilterClick(1)}
        >
          신청완료
        </FilterButton>
        <FilterButton
          active={activeFilter === 3}
          onClick={() => handleFilterClick(3)}
        >
          심부름완료
        </FilterButton>
        <FilterButton
          active={activeFilter === 4}
          onClick={() => handleFilterClick(4)}
        >
          반환/취소
        </FilterButton>
      </FilterContainer>
      <TableBlock>
        <DateHeaderBlock>
          <DateHeader>접수기준 {getTodayDate()}</DateHeader>
        </DateHeaderBlock>
        <TableHead>
          <TableHeader>접수 번호</TableHeader>
          <TableHeader>신청 닉네임</TableHeader>
          <TableHeader>현재 상태</TableHeader>
        </TableHead>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id} onClick={() => handleRowClick(order)}>
              <TableCellContainer>
                <TableCell style={{ fontSize: "11px" }}>
                  {order.orderNumber}
                </TableCell>
              </TableCellContainer>
              <TableCellContainer>
                <TableCell>{maskNickname(order.nickname)}</TableCell>
              </TableCellContainer>
              <TableCellContainer>
                <TableCell status={order.status}>
                  {formatStatus(order.status)}
                </TableCell>
              </TableCellContainer>
            </TableRow>
          ))}
        </TableBody>
      </TableBlock>
      <CustomModal
        isOpen={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <ModalTitleContainer>
          <ModalTitle>접수 현황 체크</ModalTitle>
          <div>
            <CloseButton
              onClick={() => {
                setShowVerificationModal(false);
                setNicknameInput("");
                setPhoneNumberInput("");
              }}
            >
              <img src="/svg/icon/button_close.png" alt="back" />
            </CloseButton>
          </div>
        </ModalTitleContainer>
        <ModalHeader>
          <Label>접수번호</Label>
          <div>|</div>
          <Label style={{ color: "#0078FF" }}>
            {selectedOrder?.orderNumber}
          </Label>
        </ModalHeader>
        <ModalContent>
          <InputContainer>
            <Label>신청 닉네임</Label>
            <CustomInput
              name="nicknameInput"
              value={nicknameInput}
              onChange={handleChange}
              placeholder="신청 닉네임을 작성하세요"
            />
          </InputContainer>
          <InputContainer>
            <Label>신청 전화번호</Label>
            <CustomInput
              name="phoneNumberInput"
              value={phoneNumberInput}
              onChange={handleChange}
              placeholder="010-0000-0000"
            />
          </InputContainer>
        </ModalContent>

        <SecondaryButton text="다음" onClick={verifyDetails} />
      </CustomModal>
      <CustomModal
        isOpen={showDetailsModal}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <ModalTitleContainer>
          <ModalTitle>접수 현황 체크</ModalTitle>
          <div>
            <CloseButton
              onClick={() => {
                setShowDetailsModal(false);
                setNicknameInput("");
                setPhoneNumberInput("");
              }}
            >
              <img src="/svg/icon/button_close.png" alt="back" />
            </CloseButton>
          </div>
        </ModalTitleContainer>
        <InputContainerBox>
          <ModalHeader>
            <Label>현재 상태</Label>
            <div>|</div>
            {selectedOrder && (
              <TableCell status={selectedOrder.status}>
                {formatStatus(selectedOrder.status)}
              </TableCell>
            )}
          </ModalHeader>

          {selectedOrder?.status === 4 && (
            <InputContainer>
              <Label>반환/취소 사유</Label>
              <CustomInput
                value={selectedOrder?.cancellationReason || ""}
                readOnly
                style={{ color: "#666" }}
              />
            </InputContainer>
          )}

          <InputContainer>
            <Label>신청 닉네임</Label>
            <CustomInput
              value={selectedOrder?.nickname}
              readOnly
              style={{ color: "#666" }}
            />
          </InputContainer>
          <InputContainer>
            <Label>구분</Label>
            <CustomInput
              value={selectedOrder?.type === "BUY" ? "구매" : "판매"}
              readOnly
              style={{ color: "#666" }}
            />
          </InputContainer>
          <InputContainer>
            <Label>신청 내용</Label>
            <CustomInput
              value={`${selectedOrder?.price}원 | ${selectedOrder?.amount}개`}
              readOnly
              style={{ color: "#666" }}
            />
          </InputContainer>
          <InputContainer>
            <Label>신청 은행정보</Label>
            <CustomInput
              value={`${selectedOrder?.bankName} | ${selectedOrder?.username}`}
              readOnly
              style={{ color: "#666" }}
            />
            <CustomInput
              value={selectedOrder?.accountNumber}
              readOnly
              style={{ color: "#666" }}
            />
          </InputContainer>
          <InputContainer>
            <Label>신청 모빅주소</Label>
            <CustomInput
              value={selectedOrder?.blockchainAddress}
              readOnly
              style={{ color: "#666" }}
            />
          </InputContainer>
        </InputContainerBox>
        <SecondaryButton
          text="확인완료"
          onClick={() => {
            setShowDetailsModal(false);
            setNicknameInput("");
            setPhoneNumberInput("");
          }}
        />
      </CustomModal>
    </TableContainer>
  );
};

export default TodayOrderTable;
