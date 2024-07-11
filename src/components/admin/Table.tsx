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
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [tableData, setTableData] = useState(data);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleAddressClick = (address: string) => {
    setSelectedAddress(address);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedAddress("");
  };

  const updateDataItemStatus = (
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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
      <DataContainer>
        {tableData.map((item, index) => (
          <DataRow key={index} type={item.type === "BUY" ? "구매" : "판매"}>
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
                copyToClipboard(formatDate(item.createdAt), index, "createdAt")
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
              onClick={() => copyToClipboard(item.nickname, index, "nickname")}
              isCopied={copiedIndex === index && copiedField === "nickname"}
            >
              {item.nickname}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 8 : 7] }}
              onClick={() =>
                copyToClipboard(item.phoneNumber, index, "phoneNumber")
              }
              isCopied={copiedIndex === index && copiedField === "phoneNumber"}
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
              onClick={() => copyToClipboard(item.bankName, index, "bankName")}
              isCopied={copiedIndex === index && copiedField === "bankName"}
            >
              {item.bankName}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 11 : 10] }}
              onClick={() => copyToClipboard(item.username, index, "username")}
              isCopied={copiedIndex === index && copiedField === "username"}
            >
              {item.username}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 12 : 11] }}
              onClick={() =>
                copyToClipboard(item.accountNumber, index, "accountNumber")
              }
              isCopied={
                copiedIndex === index && copiedField === "accountNumber"
              }
            >
              {item.accountNumber}
            </DataColumn>
          </DataRow>
        ))}
      </DataContainer>
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        address={selectedAddress}
      />
    </TableContainer>
  );
};

export default Table;
