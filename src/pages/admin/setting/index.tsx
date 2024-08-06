import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Sidebar from "@/components/admin/Sidebar";
import { getSwitches, updateSwitch } from "@/lib/apis/switch"; // Import switch API functions
import {
  getAllTrades,
  getDailyTradeStats,
  getPaginatedDailyTradeStats,
  getTodayMatch,
  saveTodayStats,
} from "@/lib/apis/trade";
import { validateToken } from "@/lib/apis/auth";
import { useRouter } from "next/router";

const AdminSetting = () => {
  const router = useRouter();
  const [switchStatus, setSwitchStatus] = useState(false); // Add state for switch status
  const [todayStats, setTodayStats] = useState({
    todayAvgPrice: null,
    highestPrice: null,
    lowestPrice: null,
    totalMatchAmount: null,
  });
  const [trades, setTrades] = useState([
    {
      createdAt: "",
      price: 0,
      amount: 0,
      buyNickname: "",
      buyAmount: 0,
      buyRemainingAmount: 0,
      sellNickname: "",
      sellAmount: 0,
      sellRemainingAmount: 0,
    },
  ]);
  const [dailyTradeStats, setDailyTradeStats] = useState([
    {
      date: "",
      averagePrice: 0,
      lowPrice: 0,
      highPrice: 0,
      closePrice: 0,
      totalAmount: 0,
      totalPrice: 0,
      closePriceBTC: null,
      highPriceBTC: null,
      lowPriceBTC: null,
      openPriceBTC: null,
    },
  ]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // await validateToken();
        const todayStatsData = await getTodayMatch();
        setTodayStats(todayStatsData.data);
        const tradesData = await getAllTrades();
        const sortedTrades = tradesData.data.sort(
          (a: { createdAt: string }, b: { createdAt: string }) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setTrades(sortedTrades);
        const dailyStatsData = await getPaginatedDailyTradeStats(page, limit);
        setDailyTradeStats(dailyStatsData.data);

        const switchData = await getSwitches(); // Fetch switch status
        setSwitchStatus(switchData.data.isActive);
      } catch (error) {
        router.push("/admin");
      }
    };

    fetchData();
  }, [page, limit]);

  const handleSaveTodayStats = async () => {
    await saveTodayStats();
    alert("오늘의 거래 통계를 저장했습니다.");
  };

  const handleNextPage = () => setPage(page + 1);
  const handlePrevPage = () => setPage(Math.max(1, page - 1));

  const handleToggleSwitch = async () => {
    const newStatus = !switchStatus;
    await updateSwitch(newStatus); // Update switch status
    setSwitchStatus(newStatus);
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header>
          <Title>
            신청 폼
            <Switch isActive={switchStatus} onClick={handleToggleSwitch}>
              <SwitchCircle isActive={switchStatus}>
                {switchStatus ? "✓" : "✕"}
              </SwitchCircle>
            </Switch>
          </Title>
          <InfoBox>
            <InfoColumn>
              <InfoTitle>오늘 평균가 :</InfoTitle>
              <InfoValue>
                {todayStats.todayAvgPrice !== null
                  ? `${Math.round(todayStats.todayAvgPrice)}원`
                  : "N/A"}
              </InfoValue>
            </InfoColumn>
            <InfoColumn>
              <InfoTitle>오늘 최고가 :</InfoTitle>
              <InfoValue>{todayStats.highestPrice}원</InfoValue>
            </InfoColumn>
            <InfoColumn>
              <InfoTitle>오늘 최저가 :</InfoTitle>
              <InfoValue>{todayStats.lowestPrice}원</InfoValue>
            </InfoColumn>
            <InfoColumn>
              <InfoTitle>총 매칭 모빅 수 :</InfoTitle>
              <InfoValue>{todayStats.totalMatchAmount}개</InfoValue>
            </InfoColumn>
            <InfoColumn>
              <InfoTitle>총 매칭 금액 :</InfoTitle>
              <InfoValue>
                {todayStats.totalMatchAmount !== null &&
                todayStats.todayAvgPrice !== null
                  ? `${
                      todayStats.totalMatchAmount * todayStats.todayAvgPrice
                    }원`
                  : "N/A"}
              </InfoValue>
            </InfoColumn>
            <SaveButton onClick={handleSaveTodayStats}>저장하기</SaveButton>
          </InfoBox>
        </Header>
        <TablesContainer>
          <ScrollableTableContainer>
            <ScrollableTable>
              <thead>
                <tr>
                  <th>거래일</th>
                  <th>가격</th>
                  <th>수량</th>
                  <th>구매자 닉네임</th>
                  <th>구매자 신청 수량</th>
                  <th>구매자 남은 수량</th>
                  <th>판매자 닉네임</th>
                  <th>판매자 신청 수량</th>
                  <th>판매자 남은 수량</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((item, index) => (
                  <tr key={index}>
                    <td>{item.createdAt}</td>
                    <td>{item.price.toLocaleString()}원</td>
                    <td>{item.amount}</td>
                    <td>{item.buyNickname}</td>
                    <td>{item.buyAmount}</td>
                    <td>{item.buyRemainingAmount}</td>
                    <td>{item.sellNickname}</td>
                    <td>{item.sellAmount}</td>
                    <td>{item.sellRemainingAmount}</td>
                  </tr>
                ))}
              </tbody>
            </ScrollableTable>
          </ScrollableTableContainer>
        </TablesContainer>
        <DataTable>
          <thead>
            <tr>
              <th>날짜</th>
              <th>평균가</th>
              <th>저가</th>
              <th>고가</th>
              <th>종가</th>
              <th>총 금액</th>
              <th>모빅 수량</th>
              <th>거래량</th>
            </tr>
          </thead>
          <tbody>
            {dailyTradeStats.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item.averagePrice.toLocaleString()}</td>
                <td>{item.lowPrice.toLocaleString()}</td>
                <td>{item.highPrice.toLocaleString()}</td>
                <td>{item.closePrice.toLocaleString()}</td>
                <td>{item.totalPrice.toLocaleString()}원</td>
                <td>{item.totalAmount}</td>
                <td>{(item.totalPrice * 2).toLocaleString()}원</td>
              </tr>
            ))}
          </tbody>
        </DataTable>
        <PaginationControls>
          <PaginationButton onClick={handlePrevPage}>이전</PaginationButton>
          <PaginationButton onClick={handleNextPage}>다음</PaginationButton>
        </PaginationControls>
      </Content>
    </Container>
  );
};

export default AdminSetting;

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  background: #fff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  margin-left: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  gap: 3rem;
`;

const Switch = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ isActive }) => (isActive ? "flex-end" : "flex-start")};
  width: 40px;
  height: 20px;
  background-color: ${({ isActive }) => (isActive ? "#28a745" : "#dc3545")};
  border-radius: 15px;
  padding: 5px;
  cursor: pointer;
  transition: all 0.3s;
`;

const SwitchCircle = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  font-weight: bold;
  color: ${({ isActive }) => (isActive ? "#28a745" : "#dc3545")};
`;

const InfoBox = styled.div`
  display: flex;
  align-items: center;
`;

const InfoColumn = styled.div`
  margin-right: 2rem;
`;

const InfoTitle = styled.div`
  font-size: 1rem;
  font-weight: bold;
`;

const InfoValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #007bff;
`;

const SaveButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const TablesContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
`;

const ScrollableTableContainer = styled.div`
  max-height: 250px; /* Adjust the height as needed */
  overflow-y: auto;
  border: 1px solid #ddd;
`;

const ScrollableTable = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px;
    text-align: center;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    position: sticky;
    top: 0;
    z-index: 1;
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const PaginationButton = styled.button`
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  font-size: 1rem;
  font-weight: bold;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
