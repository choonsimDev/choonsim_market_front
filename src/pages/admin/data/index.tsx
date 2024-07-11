import { DataItem } from "@/components/admin/Option";
import Sidebar from "@/components/admin/Sidebar";
import Table from "@/components/admin/Table";
import { validateToken } from "@/lib/apis/auth";
import { getAllOrders } from "@/lib/apis/order";
import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import Modal from "react-modal";

// 모달의 루트 엘리먼트를 설정합니다.
Modal.setAppElement("#__next");

const AdminData = () => {
  const [orderData, setOrderData] = useState<DataItem[]>([]);
  const [prevOrderData, setPrevOrderData] = useState<DataItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await validateToken();
        const { data } = await getAllOrders();
        console.log(data);

        // 현재 KST 날짜 구하기
        const today = new Date();
        const kstOffset = 9 * 60; // KST는 UTC+9
        today.setMinutes(
          today.getMinutes() + today.getTimezoneOffset() + kstOffset
        );

        const todayDateString = today.toISOString().split("T")[0];

        // 데이터 필터링: createdAt 날짜가 오늘 날짜(KST)와 동일한 항목만 포함
        const filteredData = data.filter((item: DataItem) => {
          const itemDate = new Date(item.createdAt);
          itemDate.setMinutes(
            itemDate.getMinutes() + itemDate.getTimezoneOffset() + kstOffset
          );
          const itemDateString = itemDate.toISOString().split("T")[0];
          return itemDateString === todayDateString;
        });

        // 데이터를 createdAt 기준으로 내림차순 정렬
        filteredData.sort(
          (a: DataItem, b: DataItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        // 이전 데이터와 현재 데이터를 비교하여 새로운 데이터가 있는지 확인
        if (prevOrderData.length > 0) {
          const newItems = filteredData.filter(
            (item: DataItem) =>
              item.status === 0 &&
              !prevOrderData.some((prevItem) => prevItem.id === item.id)
          );

          if (newItems.length > 0) {
            if (audioRef.current) {
              audioRef.current.play();
            }
            setIsModalOpen(true); // 새 아이템이 있으면 모달을 엽니다.
          }
        }

        setPrevOrderData(filteredData); // Update previous order data
        setOrderData(filteredData); // Update current order data
      } catch (error) {
        router.push("/admin");
      }
    };

    fetchData(); // 초기 데이터 로드

    const intervalId = setInterval(fetchData, 5000); // 5초마다 fetchData 호출

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 클리어
  }, [router, prevOrderData]);

  return (
    <Container>
      <audio ref={audioRef} src="/sound/sound1.mp3" preload="auto" />
      <Sidebar />
      <Content>
        <Table
          title="입금 확인 필요"
          data={orderData.filter((item: DataItem) => item.status === 0)}
        />
        <Table
          title="매칭 대기중"
          data={orderData.filter((item: DataItem) => item.status === 1)}
        />
        <Table
          title="매칭 완료"
          data={orderData.filter((item: DataItem) => item.status === 2)}
        />
        <Table
          title="반환/취소"
          data={orderData.filter((item: DataItem) => item.status === 3)}
        />
      </Content>

      {/* 알림 모달 */}
      <StyledModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="New Task Alert"
      >
        <ModalTitle>새 심부름이 도착했어요!</ModalTitle>
        <ModalButton onClick={() => setIsModalOpen(false)}>닫기</ModalButton>
      </StyledModal>
    </Container>
  );
};

export default AdminData;

const Container = styled.div`
  display: flex;
  height: 100%;
  background: #fff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  align-items: left;
  margin-left: 20px;
`;

const StyledModal = styled(Modal)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin: auto;
  padding: 2rem;
  outline: none;
`;

const ModalTitle = styled.h2`
  margin-bottom: 1rem;
`;

const ModalButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;
