import { GetServerSideProps } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CreateOrderHeader from "@/components/common/CreateOrderHeader";
import { Layout } from "@/components/common/Layout";
import { SellComponent } from "@/components/create-order/sell/SellComponent";

interface SellPageProps {
  switchStatus: boolean;
}

const SellPage: React.FC<SellPageProps> = ({ switchStatus }) => {
  const router = useRouter();

  // useEffect(() => {
  //   if (!switchStatus) {
  //     alert("서비스 준비 중입니다. 잠시 후 다시 시도해주세요.");
  //     router.push("/");
  //   }
  // }, [switchStatus, router]);

  // if (!switchStatus) {
  //   return null;
  // }

  return (
    <Layout>
      <CreateOrderHeader />
      <SellComponent />
    </Layout>
  );
};

export default SellPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const BASE_URL = `https://port-0-choonsim-market-back-lyscrsym8c0a1309.sel4.cloudtype.app/switch`;
  const BASE_URL = `http://localhost:3500/switch`;
  const switchResponse = await axios.get(BASE_URL);
  const switchStatus = switchResponse.data.isActive ?? false;

  return {
    props: {
      switchStatus,
    },
  };
};
