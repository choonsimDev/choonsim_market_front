import { DataItem } from "@/components/admin/Option"; // DataItem 타입을 Option 컴포넌트에서 가져옴
import Sidebar from "@/components/admin/Sidebar"; // Sidebar 컴포넌트를 가져옴
import Table from "@/components/admin/Table"; // Table 컴포넌트를 가져옴
import { validateToken } from "@/lib/apis/auth"; // 인증 토큰 검증 함수를 가져옴
import { getAllOrders, updateOrderStatus } from "@/lib/apis/order"; // 모든 주문을 가져오는 함수와 주문 상태를 업데이트하는 함수를 가져옴
import { useEffect, useState, useRef } from "react"; // React 훅을 가져옴
import styled from "styled-components"; // 스타일드 컴포넌트를 가져옴
import { useRouter } from "next/router"; // Next.js 라우터 훅을 가져옴
import Modal from "react-modal"; // React 모달 컴포넌트를 가져옴

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

// 모달의 루트 엘리먼트를 설정합니다.
Modal.setAppElement("#__next");

const AdminData = () => {
  // AdminData 컴포넌트 정의
  const [orderData, setOrderData] = useState<DataItem[]>([]); // 주문 데이터를 저장할 상태 정의
  const [prevOrderData, setPrevOrderData] = useState<DataItem[]>([]); // 이전 주문 데이터를 저장할 상태 정의
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 상태를 저장할 상태 정의
  const router = useRouter(); // 라우터 훅을 사용
  const audioRef = useRef<HTMLAudioElement | null>(null); // 오디오 참조를 저장할 ref 정의

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 효과 훅
    const fetchData = async () => {
      // 비동기 데이터 가져오기 함수 정의
      try {
        await validateToken(); // 토큰을 검증함
        const { data } = await getAllOrders(); // 모든 주문 데이터를 가져옴
        console.log(data); // 가져온 데이터를 콘솔에 출력

        const today = new Date(); // 현재 날짜를 가져옴
        const kstOffset = 9 * 60; // 한국 표준시(KST) 오프셋 정의
        today.setMinutes(
          // 오늘 날짜를 KST로 변환
          today.getMinutes() + today.getTimezoneOffset() + kstOffset
        );

        const todayDateString = today.toISOString().split("T")[0]; // 오늘 날짜를 문자열로 변환

        const filteredData = data.filter((item: DataItem) => {
          // 오늘 날짜와 같은 주문만 필터링
          const itemDate = new Date(item.createdAt); // 주문의 생성 날짜를 가져옴
          itemDate.setMinutes(
            // 주문 날짜를 KST로 변환
            itemDate.getMinutes() + itemDate.getTimezoneOffset() + kstOffset
          );
          const itemDateString = itemDate.toISOString().split("T")[0]; // 주문 날짜를 문자열로 변환
          return itemDateString === todayDateString; // 오늘 날짜와 같은지 비교
        });

        filteredData.sort(
          // 주문 데이터를 생성 날짜 기준으로 내림차순 정렬
          (a: DataItem, b: DataItem) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (prevOrderData.length > 0) {
          // 이전 주문 데이터가 있을 경우
          const newItems = filteredData.filter(
            // 새로운 주문을 필터링
            (item: DataItem) =>
              item.status === 0 && // 상태가 0(입금 확인중)인 주문만
              !prevOrderData.some((prevItem) => prevItem.id === item.id) // 이전 데이터에 없는 항목만
          );

          if (newItems.length > 0) {
            // 새로운 주문이 있을 경우
            if (audioRef.current) {
              // 오디오 ref가 있을 경우
              audioRef.current.play(); // 오디오를 재생
            }
            setIsModalOpen(true); // 모달을 엽니다.
          }
        }

        setPrevOrderData(filteredData); // 이전 주문 데이터를 업데이트
        setOrderData(filteredData); // 현재 주문 데이터를 업데이트
      } catch (error) {
        router.push("/admin"); // 에러가 발생하면 관리자 페이지로 리다이렉트
      }
    };

    fetchData(); // 초기 데이터 로드
  }, [router, prevOrderData]); // 라우터와 이전 주문 데이터가 변경될 때마다 실행

  useEffect(() => {
    // 컴포넌트가 마운트될 때 실행되는 효과 훅
    const fetchPendingOrders = async () => {
      // 비동기 데이터 가져오기 함수 정의
      try {
        await validateToken(); // 토큰을 검증
        const { data } = await getAllOrders(); // 모든 주문 데이터를 가져옴

        const today = new Date(); // 현재 날짜를 가져옴
        const kstOffset = 9 * 60; // 한국 표준시(KST) 오프셋 정의
        today.setMinutes(
          // 오늘 날짜를 KST로 변환
          today.getMinutes() + today.getTimezoneOffset() + kstOffset
        );

        const todayDateString = today.toISOString().split("T")[0]; // 오늘 날짜를 문자열로 변환

        const filteredData = data.filter((item: DataItem) => {
          // 오늘 날짜와 같은 주문만 필터링
          const itemDate = new Date(item.createdAt); // 주문의 생성 날짜를 가져옴
          itemDate.setMinutes(
            // 주문 날짜를 KST로 변환
            itemDate.getMinutes() + itemDate.getTimezoneOffset() + kstOffset
          );
          const itemDateString = itemDate.toISOString().split("T")[0]; // 주문 날짜를 문자열로 변환
          return itemDateString === todayDateString; // 오늘 날짜와 같은지 비교
        });

        const pendingOrders = filteredData.filter(
          // '입금 확인 필요' 상태 필터링
          (item: DataItem) => item.status === 0
        );

        const newData = [...orderData]; // 기존 주문 데이터를 복사
        pendingOrders.forEach((pendingOrder: DataItem) => {
          // '입금 확인 필요' 상태 주문을 업데이트
          const index = newData.findIndex(
            (order) => order.id === pendingOrder.id
          );
          if (index !== -1) {
            // 기존 데이터에 있는 경우
            newData[index] = pendingOrder;
          } else {
            // 기존 데이터에 없는 경우
            newData.push(pendingOrder);
          }
        });
        setOrderData(newData); // 새로운 데이터를 상태에 저장
      } catch (error) {
        router.push("/admin"); // 에러가 발생하면 관리자 페이지로 리다이렉트
      }
    };

    const intervalId = setInterval(fetchPendingOrders, 5000); // 5초마다 fetchPendingOrders 호출

    return () => clearInterval(intervalId); // 인터벌 클리어
  }, [router, orderData]); // 라우터와 주문 데이터가 변경될 때마다 실행

  return (
    // JSX 반환
    <Container>
      <audio ref={audioRef} src="/sound/sound1.mp3" preload="auto" />{" "}
      {/* 오디오 엘리먼트 */}
      <Sidebar /> {/* 사이드바 컴포넌트 */}
      <Content>
        <Table
          title="입금 확인 필요"
          data={orderData.filter((item: DataItem) => item.status === 0)}
        />{" "}
        {/* '입금 확인 필요' 상태의 주문 데이터를 가진 테이블 */}
        <Table
          title="진행중"
          data={orderData.filter((item: DataItem) => item.status === 1)}
        />{" "}
        {/* '진행중' 상태의 주문 데이터를 가진 테이블 */}
        <Table
          title="처리 대기"
          data={orderData.filter((item: DataItem) => item.status === 2)}
        />{" "}
        {/* '처리 대기' 상태의 주문 데이터를 가진 테이블 */}
        <Table
          title="입금 완료"
          data={orderData.filter((item: DataItem) => item.status === 3)}
        />{" "}
        {/* '입금 완료' 상태의 주문 데이터를 가진 테이블 */}
        <Table
          title="반환/취소"
          data={orderData.filter((item: DataItem) => item.status === 4)}
        />{" "}
        {/* '반환/취소' 상태의 주문 데이터를 가진 테이블 */}
      </Content>
      <StyledModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="New Task Alert"
      >
        <ModalTitle>새 심부름이 도착했어요!</ModalTitle> {/* 모달 제목 */}
        <ModalButton onClick={() => setIsModalOpen(false)}>
          닫기
        </ModalButton>{" "}
        {/* 모달 닫기 버튼 */}
      </StyledModal>
    </Container>
  );
};

export default AdminData; // AdminData 컴포넌트를 기본으로 내보냄
