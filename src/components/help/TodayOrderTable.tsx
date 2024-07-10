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
  font-size: 0.75rem;
  color: #333;
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

const TableBody = styled.div``;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 35px;
  border-bottom: 0.0625rem solid #ededed;
  cursor: pointer;
`;

const TableCell = styled.div<StatusProps>`
  flex: 1;
  text-align: center;
  display: flex;
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
      ? "1px solid #14B998"
      : props.status === 3
      ? "1px solid #646464"
      : "none"};
  color: ${(props) =>
    props.status === 0
      ? "#fe4e48"
      : props.status === 1
      ? "#0078ff"
      : props.status === 2
      ? "#14B998"
      : props.status === 3
      ? "#646464"
      : "black"};
  height: ${(props) =>
    props.status === 0 ||
    props.status === 1 ||
    props.status === 2 ||
    props.status === 3
      ? "1.5rem"
      : "auto"};
  padding: ${(props) =>
    props.status === 0 ||
    props.status === 1 ||
    props.status === 2 ||
    props.status === 3
      ? "0.125rem"
      : "auto"};
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
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  outline: none;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
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
  font-size: 0.875rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
`;

const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  background-color: #fff;
  justify-content: space-between;
  font-weight: bold;
  font-size: 14px;
  padding-bottom: 27px;
`;

const ModalStatusHeader = styled.div`
  font-size: 25px;
  color: #242731;
  font-weight: bold;
  text-align: center;
  padding-bottom: 17px;
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
      return "신청 완료";
    case 2:
      return "심부름 완료";
    case 3:
      return "반환";
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

const TodayOrderTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await getTodayOrders();
      setOrders(data);
      setFilteredOrders(data);
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, []);

  const handleRowClick = (order: Order) => {
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
      alert("Details do not match.");
    }
  };

  const handleFilterClick = (status: number | null) => {
    setActiveFilter(status);
    if (status === null) {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === status));
    }
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
          신청 완료
        </FilterButton>
        <FilterButton
          active={activeFilter === 2}
          onClick={() => handleFilterClick(2)}
        >
          심부름 완료
        </FilterButton>
        <FilterButton
          active={activeFilter === 3}
          onClick={() => handleFilterClick(3)}
        >
          반환
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
              <TableCell style={{ fontSize: "8px" }}>{order.id}</TableCell>
              <TableCell>{maskNickname(order.nickname)}</TableCell>
              <TableCell status={order.status}>
                {formatStatus(order.status)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableBlock>
      <CustomModal
        isOpen={showVerificationModal}
        onRequestClose={() => setShowVerificationModal(false)}
      >
        <ModalHeader>
          <div>접수번호: {selectedOrder?.id}</div>
          <div>
            <CloseButton
              onClick={() => {
                setShowVerificationModal(false);
                setNicknameInput("");
                setPhoneNumberInput("");
              }}
            >
              <img src="/svg/back.svg" alt="back" />
            </CloseButton>
          </div>
        </ModalHeader>
        <InputContainer>
          <Label>신청 닉네임</Label>
          <CustomInput
            value={nicknameInput}
            onChange={(e) => setNicknameInput(e.target.value)}
            placeholder="신청 닉네임을 작성하세요"
          />
        </InputContainer>
        <InputContainer>
          <Label>신청 전화번호</Label>
          <CustomInput
            value={phoneNumberInput}
            onChange={(e) => setPhoneNumberInput(e.target.value)}
            placeholder="010-0000-0000"
          />
        </InputContainer>
        <SecondaryButton text="확인하기" onClick={verifyDetails} />
      </CustomModal>
      <CustomModal
        isOpen={showDetailsModal}
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <ModalHeader>
          <div>접수번호: {selectedOrder?.id}</div>
          <div>
            <CloseButton
              onClick={() => {
                setShowDetailsModal(false);
                setNicknameInput("");
                setPhoneNumberInput("");
              }}
            >
              <img src="/svg/back.svg" alt="back" />
            </CloseButton>
          </div>
        </ModalHeader>
        <ModalStatusHeader>
          현재 상태: {formatStatus(selectedOrder?.status!)}
        </ModalStatusHeader>
        {selectedOrder?.status === 3 && (
          <InputContainer>
            <Label>사유</Label>
            <CustomInput
              value={selectedOrder?.cancellationReason || ""}
              readOnly
            />
          </InputContainer>
        )}
        <InputContainer>
          <Label>신청 닉네임</Label>
          <CustomInput value={selectedOrder?.nickname} readOnly />
        </InputContainer>
        <InputContainer>
          <Label>구분</Label>
          <CustomInput
            value={selectedOrder?.type === "BUY" ? "구매" : "판매"}
            readOnly
          />
        </InputContainer>
        <InputContainer>
          <Label>신청 내용</Label>
          <CustomInput
            value={`${selectedOrder?.price}원 / ${selectedOrder?.amount}개`}
            readOnly
          />
        </InputContainer>
        <InputContainer>
          <Label>신청 계좌번호</Label>
          <CustomInput value={selectedOrder?.accountNumber} readOnly />
        </InputContainer>
        <SecondaryButton
          text="돌아가기"
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
