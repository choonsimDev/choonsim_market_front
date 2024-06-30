import React, { useEffect, useState } from "react";
import styled from "styled-components";
import OptionButton, { DataItem } from "./Option";
import Modal from "./Modal";

interface TableProps {
  title: string;
  data: DataItem[];
}

const Table: React.FC<TableProps> = ({ title, data }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [tableData, setTableData] = useState(data);

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

  const updateDataItemStatus = (id: string, status: number, processed?: boolean) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status, processed: processed ?? item.processed } : item
      )
    );
  };

  const includeRemainingAmount = tableData.some(
    (item) => item.status === 1 || item.status === 2
  );

  const columnWidths = [
    "4.75rem",
    "10.75rem",
    "1.375rem",
    "3.1875rem",
    "2.6875rem",
    ...(includeRemainingAmount ? ["3rem"] : []),
    "3.625rem",
    "6.125rem",
    "15.625rem",
    "2.875rem",
    "2.6875rem",
    "6.625rem",
  ];

  const headers = [
    "",
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

  const totalWidth = includeRemainingAmount ? "74.75rem" : "70.75rem";

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
                updateDataItemStatus(item.id, status, status === 1 ? true : undefined);
              }}
              item={item}
              highlight={item.status === 1 && !item.processed}
            />
            <DataColumn style={{ width: columnWidths[1] }}>
              {item.id}
            </DataColumn>
            <DataColumn style={{ width: columnWidths[2] }}>
              {item.type === "BUY" ? "구매" : "판매"}
            </DataColumn>
            <DataColumn style={{ width: columnWidths[3] }}>
              {item.price}
            </DataColumn>
            <DataColumn style={{ width: columnWidths[4] }}>
              {item.amount}
            </DataColumn>
            {includeRemainingAmount && (
              <RemainingAmountColumn style={{ width: columnWidths[5] }}>
                {item.remainingAmount}
              </RemainingAmountColumn>
            )}
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 6 : 5] }}
            >
              {item.nickname}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 7 : 6] }}
            >
              {item.phoneNumber}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 8 : 7] }}
              onClick={() => handleAddressClick(item.blockchainAddress)}
              title={
                item.blockchainAddress.length > 34
                  ? item.blockchainAddress
                  : undefined
              }
            >
              {item.blockchainAddress.length > 34
                ? `${item.blockchainAddress.slice(0, 34)}...`
                : item.blockchainAddress}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 9 : 8] }}
            >
              {item.bankName}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 10 : 9] }}
            >
              {item.username}
            </DataColumn>
            <DataColumn
              style={{ width: columnWidths[includeRemainingAmount ? 11 : 10] }}
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
  padding: 0.5rem;
`;

const DataContainer = styled.div`
  width: 100%;
`;

const DataRow = styled.div<{ type: string }>`
  display: flex;
  width: 100%;
  height: 1.76956rem;
  flex-shrink: 0;
  border: 0.858px solid rgba(0, 0, 0, 0.2);
  background: ${({ type }) =>
    type === "구매" ? "rgba(255, 0, 0, 0.20)" : "rgba(0, 0, 255, 0.20)"};
`;

const DataColumn = styled.div`
  color: #000;
  text-align: center;
  font-family: Inter;
  font-size: 0.73025rem;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  flex-shrink: 0;
  padding: 0.5rem;
`;

const RemainingAmountColumn = styled(DataColumn)`
  color: #00c880;
`;
