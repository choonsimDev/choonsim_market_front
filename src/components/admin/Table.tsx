import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import OptionButton, { DataItem } from "./Option";
import Modal from "./Modal";

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

// 남은 수량 컬럼 스타일 정의 (기본 데이터 컬럼 스타일을 상속받음)
const RemainingAmountColumn = styled(DataColumn)`
  color: #00c880;
`;

// 테이블 컴포넌트의 속성 타입 정의
interface TableProps {
  title: string;
  data: DataItem[];
}

// 복사 애니메이션 정의
const copyAnimation = keyframes`
  0% {
    background-color: yellow;
  }
  100% {
    background-color: inherit;
  }
`;

// 테이블 컴포넌트 정의
const Table: React.FC<TableProps> = ({ title, data }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [tableData, setTableData] = useState(data);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [processedOrders, setProcessedOrders] = useState<string[]>([]);

  // 데이터가 변경될 때마다 테이블 데이터를 업데이트
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // 주소 클릭 시 모달 열기
  const handleAddressClick = (address: string) => {
    setSelectedAddress(address);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAddress("");
  };

  //데이터 항목 상태 업데이트
  const updateDataItemStatus = (
    id: string,
    status: number,
    processed?: boolean
  ) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id && item.status !== 1 // status가 1번이 아니면 업데이트
          ? { ...item, status, processed: processed ?? item.processed }
          : item
      )
    );
  };

  // 매칭 버튼 클릭 시 처리
  const handleMatchClick = (buyOrder: DataItem, sellOrder: DataItem) => {
    const buyRemaining = buyOrder.remainingAmount;
    const sellRemaining = sellOrder.remainingAmount;

    if (buyRemaining > sellRemaining) {
      updateDataItemStatus(buyOrder.id, buyOrder.status, true);
      buyOrder.remainingAmount -= sellRemaining;
      sellOrder.remainingAmount = 0;
      updateDataItemStatus(sellOrder.id, 2);
    } else if (buyRemaining < sellRemaining) {
      updateDataItemStatus(sellOrder.id, sellOrder.status, true);
      sellOrder.remainingAmount -= buyRemaining;
      buyOrder.remainingAmount = 0;
      updateDataItemStatus(buyOrder.id, 2);
    } else {
      buyOrder.remainingAmount = 0;
      sellOrder.remainingAmount = 0;
      updateDataItemStatus(buyOrder.id, 2);
      updateDataItemStatus(sellOrder.id, 2);
    }
    setProcessedOrders((prev) => [...prev, buyOrder.id, sellOrder.id]);
  };

  // 남은 수량이 포함된 컬럼이 있는지 확인
  const includeRemainingAmount = tableData.some(
    (item) => item.status === 1 || item.status === 2
  );

  const columnWidths = [
    "100px", // Option button
    "100px", // createdAt
    "200px", // ID
    "50px", // type
    "80px", // price
    "50px", // amount
    ...(includeRemainingAmount ? ["3rem"] : []), // remainingAmount
    "100px", // nickname
    "100px", // phoneNumber
    "300px", // blockchainAddress
    "100px", // bankName
    "100px", // username
    "300px", // accountNumber
  ];

  const headers = [
    "",
    "신청 날짜", // Header for createdAt column
    "신청번호",
    "구분",
    "가격",
    "신청수량",
    ...(includeRemainingAmount ? ["남은 수량"] : []),
    "닉네임",
    "연락처",
    "신청 주소",
    "신청 은행",
    "입금자명",
    "입금계좌",
  ];

  const totalWidth = includeRemainingAmount ? "1646px" : "1598px";

  const copyToClipboard = (text: string, index: number, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setCopiedField(field);
      setTimeout(() => {
        setCopiedIndex(null);
        setCopiedField(null);
      }, 1000);
    });
  };

  // 날짜 형식을 변환하는 함수 . T 제거
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split(".")[0].replace("T", " ");
    return formattedDate;
  };

  // 가격을 기준으로 데이터를 그룹화
  const groupedByPrice = tableData.reduce((acc: any, item: DataItem) => {
    if (!acc[item.price]) acc[item.price] = [];
    acc[item.price].push(item);
    return acc;
  }, {});

  // 데이터 행을 렌더링하는 함수
  const renderRows = () => {
    return Object.keys(groupedByPrice).map((price) => {
      const items = groupedByPrice[price];
      const buyOrder = items.find((item: DataItem) => item.type === "BUY");
      const sellOrder = items.find((item: DataItem) => item.type === "SELL");

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
                      ? item.processed
                        ? "매칭 대기중"
                        : "처리 대기"
                      : item.status === 2
                      ? "매칭 완료"
                      : item.status === 3
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
                  highlight={item.status === 1 && !item.processed}
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
              {includeRemainingAmount && (
                <RemainingAmountColumn
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
                </RemainingAmountColumn>
              )}
              <DataColumn
                style={{ width: columnWidths[includeRemainingAmount ? 7 : 6] }}
                onClick={() =>
                  copyToClipboard(item.nickname, index, "nickname")
                }
                isCopied={copiedIndex === index && copiedField === "nickname"}
              >
                {item.nickname}
              </DataColumn>
              <DataColumn
                style={{ width: columnWidths[includeRemainingAmount ? 8 : 7] }}
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
                style={{ width: columnWidths[includeRemainingAmount ? 9 : 8] }}
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
                style={{ width: columnWidths[includeRemainingAmount ? 10 : 9] }}
                onClick={() =>
                  copyToClipboard(item.bankName, index, "bankName")
                }
                isCopied={copiedIndex === index && copiedField === "bankName"}
              >
                {item.bankName}
              </DataColumn>
              <DataColumn
                style={{
                  width: columnWidths[includeRemainingAmount ? 11 : 10],
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
                  width: columnWidths[includeRemainingAmount ? 12 : 11],
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

export default Table;
