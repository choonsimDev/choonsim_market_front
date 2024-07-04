import { GetServerSideProps } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styled from "styled-components";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Layout } from "@/components/common/Layout";
import { CreateOrderComponent } from "@/components/create-order/CreateOrderComponent";

interface CreateOrderPageProps {
  switchStatus: boolean;
}

const CreateOrderPage: React.FC<CreateOrderPageProps> = ({ switchStatus }) => {
  const router = useRouter();

  // useEffect(() => {
  //   if (!switchStatus) {
  //     // If switch is off, redirect to home page or display a message
  //     alert("서비스 준비 중입니다. 잠시 후 다시 시도해주세요.");
  //     router.push("/");
  //   }
  // }, [switchStatus, router]);

  // if (!switchStatus) {
  //   return null;
  // }

  return (
    <Layout>
      <Header />
      <CreateOrderComponent />
      <Footer />
    </Layout>
  );
};

export default CreateOrderPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const BASE_URL = `http://localhost:8080/switch`;
    const switchResponse = await axios.get(BASE_URL);
    const switchStatus = switchResponse.data.isActive ?? false; // switchStatus가 undefined인 경우 false로 설정

    return {
      props: {
        switchStatus,
      },
    };
  } catch (error) {
    console.error("Failed to fetch switch status:", error);
    return {
      props: {
        switchStatus: false, // 에러 발생 시 false로 설정
      },
    };
  }
};
