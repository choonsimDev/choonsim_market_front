import { DataItem } from "@/components/admin/Option";
import Sidebar from "@/components/admin/Sidebar";
import Table from "@/components/admin/Table";
import { validateToken } from "@/lib/apis/auth";
import { getAllOrders } from "@/lib/apis/order";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";

const AdminData = () => {
  const [orderData, setOrderData] = useState<DataItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await validateToken();
        const { data } = await getAllOrders();
        console.log(data);
        setOrderData(data);
      } catch (error) {
        router.push("/admin");
      }
    };
    fetchData();
  }, []);

  return (
    <Container>
      <Sidebar />
      <Content>
        <Table
          title="입금 확인 필요"
          data={orderData.filter((item) => item.status === 0)}
        />
        <Table
          title="매칭 대기중"
          data={orderData.filter((item) => item.status === 1)}
        />
        <Table
          title="매칭 완료"
          data={orderData.filter((item) => item.status === 2)}
        />
        <Table
          title="반환/취소"
          data={orderData.filter((item) => item.status === 3)}
        />
      </Content>
    </Container>
  );
};

export default AdminData;

const Container = styled.div`
  display: flex;
  width: 75rem;
  height: 100%;
  background: #fff;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 1rem;
  align-items: left;
  margin-left: 2rem;
`;
