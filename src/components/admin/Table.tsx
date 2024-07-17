import React, { useEffect, useState } from "react"; // React 훅을 가져옴
import styled, { keyframes, css } from "styled-components"; // 스타일드 컴포넌트를 가져옴
import OptionButton, { DataItem } from "./Option"; // OptionButton 컴포넌트와 DataItem 타입을 가져옴
import Modal from "./Modal"; // Modal 컴포넌트를 가져옴
import { updateOrderStatus } from "@/lib/apis/order"; // 주문 상태 업데이트 함수를 가져옴

const TableContainer = styled.div`
  flex-shrink: 0;
  margin-bottom: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
`;

const TableTitle = styled.div`
  font-family: Raleway;
  font-size: 1.28681rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.44769rem;
  text-align: left;
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
`;

const ColumnContainer = styled.div`
  display: flex;
  width: 100%;
  height: 1.76956rem;
  flex-shrink: 0;
  border: 0.858px solid rgba(0, 0, 0, 0.2);
  background: #fff;
`;

const Column = styled.div`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 0.73025rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DataContainer = styled.div`
  width: 100%;
`;

const DataRow = styled.div<{ type: string }>`
  display: flex;
  width: 100%;
  height: 30px;
  flex-shrink: 0;
  border: 1px solid rgba(0, 0, 0, 0.2);
  background: ${({ type }) =>
    type === "구매" ? "rgba(255, 0, 0, 0.20)" : "rgba(0, 0, 255, 0.20)"};
  &:hover {
    background: ${({ type }) =>
      type === "구매" ? "rgba(255, 0, 0, 0.50)" : "rgba(0, 0, 255, 0.50)"};
  }
`;

const DataColumn = styled.div<{ isCopied?: boolean }>`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  flex-shrink: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.2);
  border-left: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: ${({ isCopied }) => (isCopied ? "yellow" : "inherit")};
  animation: ${({ isCopied }) =>
    isCopied
      ? css`
          ${copyAnimation} 1s
        `
      : "none"};
`;

const RemainingAmountColumn = styled(DataColumn)`
  color: #00c880;
`;

interface TableProps {
  title: string;
  data: DataItem[];
}

// Copy animation
const copyAnimation = keyframes`
  0% {
    background-color: yellow;
  }
  100% {
    background-color: inherit;
  }
`;

const Table: React.FC<TableProps> = ({ title, data }) => {
  // Table 컴포넌트 정의
  const [isModalOpen, setModalOpen] = useState(false); // 모달의 상태를 저장할 상태 정의
  const [selectedAddress, setSelectedAddress] = useState(""); // 선택된 주소를 저장할 상태 정의
  const [tableData, setTableData] = useState(data); // 테이블 데이터를 저장할 상태 정의
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // 복사된 인덱스를 저장할 상태 정의
  const [copiedField, setCopiedField] = useState<string | null>(null); // 복사된 필드를 저장할 상태 정의
  const [processedOrders, setProcessedOrders] = useState<string[]>([]); // 처리된 주문을 저장할 상태 정의

  useEffect(() => {
    setTableData(data); // 테이블 데이터를 업데이트
  }, [data]); // 데이터가 변경될 때마다 실행

  const closeModal = () => {
    // 모달 닫기 핸들러
    setModalOpen(false); // 모달을 닫음
    setSelectedAddress(""); // 선택된 주소를 초기화
  };

  const updateDataItemStatus = (
    // 데이터 항목의 상태를 업데이트하는 함수 정의
    id: string,
    status: number,
    processed?: boolean
  ) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, status, processed: processed ?? item.processed }
          : item
      )
    );
  };

  const handleMatchClick = async (buyOrder: DataItem, sellOrder: DataItem) => {
    // 매칭 클릭 핸들러
    await updateOrderStatus(buyOrder.id, { status: 2 }); // 구매 건 상태를 '처리 대기'로 변경
    await updateOrderStatus(sellOrder.id, { status: 2 }); // 판매 건 상태를 '처리 대기'로 변경

    updateDataItemStatus(buyOrder.id, 2); // 데이터 항목 상태를 '처리 대기'로 업데이트
    updateDataItemStatus(sellOrder.id, 2); // 데이터 항목 상태를 '처리 대기'로 업데이트

    setProcessedOrders((prev) => [...prev, buyOrder.id, sellOrder.id]); // 처리된 주문을 기록
  };

  const columnWidths = [
    // 각 열의 너비 설정
    "100px", // Option button
    "100px", // createdAt
    "200px", // ID
    "50px", // type
    "80px", // price
    "50px", // amount
    "3rem", // remainingAmount
    "100px", // nickname
    "100px", // phoneNumber
    "300px", // blockchainAddress
    "100px", // bankName
    "100px", // username
    "300px", // accountNumber
  ];

  const headers = [
    // 각 열의 헤더 설정
    "",
    "신청 날짜",
    "신청번호",
    "구분",
    "가격",
    "신청수량",
    "남은 수량",
    "닉네임",
    "연락처",
    "신청 주소",
    "신청 은행",
    "입금자명",
    "입금계좌",
  ];

  const totalWidth = "1646px"; // 테이블 전체 너비 설정

  const copyToClipboard = (text: string, index: number, field: string) => {
    // 클립보드 복사 함수 정의
    navigator.clipboard.writeText(text).then(() => {
      // 텍스트를 클립보드에 복사
      setCopiedIndex(index); // 복사된 인덱스를 상태에 저장
      setCopiedField(field); // 복사된 필드를 상태에 저장
      setTimeout(() => {
        // 1초 후에 상태 초기화
        setCopiedIndex(null);
        setCopiedField(null);
      }, 1000);
    });
  };

  const formatDate = (dateString: string) => {
    // 날짜 포맷 함수 정의
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split(".")[0].replace("T", " ");
    return formattedDate;
  };

  const groupedByPrice = tableData.reduce((acc: any, item: DataItem) => {
    // 가격별로 그룹화
    if (!acc[item.price]) acc[item.price] = [];
    acc[item.price].push(item);
    return acc;
  }, {});

  const renderRows = () => {
    // 행 렌더링 함수 정의
    return Object.keys(groupedByPrice).map((price) => {
      // 각 가격대별로 반복
      const items = groupedByPrice[price];
      const buyOrder = items.find(
        (item: DataItem) => item.type === "BUY" && item.status === 2
      );
      const sellOrder = items.find(
        (item: DataItem) => item.type === "SELL" && item.status === 2
      );

      return (
        <React.Fragment key={price}>
          {items.map((item: DataItem, index: number) => (
            <DataRow key={item.id} type={item.type === "BUY" ? "구매" : "판매"}>
              <DataColumn style={{ width: columnWidths[0] }}>
                <OptionButton
                  value={
                    item.status === 0
                      ? "입금 확인중"
                      : item.status === 1
                      ? "매칭 대기중"
                      : item.status === 2
                      ? "처리 대기"
                      : item.status === 3
                      ? "입금 완료"
                      : item.status === 4
                      ? "반환/취소"
                      : ""
                  }
                  onChange={(newValue, status) => {
                    updateDataItemStatus(
                      item.id,
                      status,
                      status === 1 ? true : undefined
                    );
                  }}
                  item={item}
                />
              </DataColumn>

              <DataColumn
                style={{ width: columnWidths[1] }}
                onClick={() =>
                  copyToClipboard(
                    formatDate(item.createdAt),
                    index,
                    "createdAt"
                  )
                }
                isCopied={copiedIndex === index && copiedField === "createdAt"}
              >
                {formatDate(item.createdAt)}
              </DataColumn>

              <DataColumn
                style={{ width: columnWidths[2] }}
                onClick={() => copyToClipboard(item.id, index, "id")}
                isCopied={copiedIndex === index && copiedField === "id"}
              >
                {item.id}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[3] }}
                onClick={() =>
                  copyToClipboard(
                    item.type === "BUY" ? "구매" : "판매",
                    index,
                    "type"
                  )
                }
                isCopied={copiedIndex === index && copiedField === "type"}
              >
                {item.type === "BUY" ? "구매" : "판매"}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[4] }}
                onClick={() =>
                  copyToClipboard(item.price.toString(), index, "price")
                }
                isCopied={copiedIndex === index && copiedField === "price"}
              >
                {item.price}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[5] }}
                onClick={() =>
                  copyToClipboard(item.amount.toString(), index, "amount")
                }
                isCopied={copiedIndex === index && copiedField === "amount"}
              >
                {item.amount}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[6] }}
                onClick={() =>
                  copyToClipboard(
                    item.remainingAmount.toString(),
                    index,
                    "remainingAmount"
                  )
                }
                isCopied={
                  copiedIndex === index && copiedField === "remainingAmount"
                }
              >
                {item.remainingAmount}
              </DataColumn>

              <DataColumn
                style={{ width: columnWidths[7] }}
                onClick={() =>
                  copyToClipboard(item.nickname, index, "nickname")
                }
                isCopied={copiedIndex === index && copiedField === "nickname"}
              >
                {item.nickname}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[8] }}
                onClick={() =>
                  copyToClipboard(item.phoneNumber, index, "phoneNumber")
                }
                isCopied={
                  copiedIndex === index && copiedField === "phoneNumber"
                }
              >
                {item.phoneNumber}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[9] }}
                title={
                  item.blockchainAddress.length > 34
                    ? item.blockchainAddress
                    : undefined
                }
                onClick={() =>
                  copyToClipboard(
                    item.blockchainAddress,
                    index,
                    "blockchainAddress"
                  )
                }
                isCopied={
                  copiedIndex === index && copiedField === "blockchainAddress"
                }
              >
                {item.blockchainAddress.length > 34
                  ? `${item.blockchainAddress.slice(0, 34)}...`
                  : item.blockchainAddress}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[10] }}
                onClick={() =>
                  copyToClipboard(item.bankName, index, "bankName")
                }
                isCopied={copiedIndex === index && copiedField === "bankName"}
              >
                {item.bankName}
              </DataColumn>
              <DataColumn
                style={{
                  width: columnWidths[11],
                }}
                onClick={() =>
                  copyToClipboard(item.username, index, "username")
                }
                isCopied={copiedIndex === index && copiedField === "username"}
              >
                {item.username}
              </DataColumn>
              <DataColumn
                style={{
                  width: columnWidths[12],
                }}
                onClick={() =>
                  copyToClipboard(item.accountNumber, index, "accountNumber")
                }
                isCopied={
                  copiedIndex === index && copiedField === "accountNumber"
                }
              >
                {item.accountNumber}
              </DataColumn>
              {buyOrder &&
                sellOrder &&
                !processedOrders.includes(buyOrder.id) &&
                !processedOrders.includes(sellOrder.id) && (
                  <DataColumn>
                    {item.type === "BUY" && (
                      <button
                        onClick={() => handleMatchClick(buyOrder, sellOrder)}
                      >
                        {buyOrder.processed ? "확인 완료" : "처리 대기"}
                      </button>
                    )}
                  </DataColumn>
                )}
            </DataRow>
          ))}
        </React.Fragment>
      );
    });
  };

  return (
    <TableContainer style={{ width: totalWidth }}>
      <TableTitle>{title}</TableTitle>
      <ColumnContainer>
        {headers.map((header, index) => (
          <Column key={index} style={{ width: columnWidths[index] }}>
            {header}
          </Column>
        ))}
      </ColumnContainer>
      <DataContainer>{renderRows()}</DataContainer>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        address={selectedAddress}
      />
    </TableContainer>
  );
};

export default Table; // Table 컴포넌트를 기본으로 내보냄
