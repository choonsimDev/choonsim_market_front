import { GetServerSideProps } from "next";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CreateOrderHeader from "@/components/common/CreateOrderHeader";
import { Layout } from "@/components/common/Layout";
import { BuyComponent } from "@/components/create-order/buy/BuyComponent";

interface BuyPageProps {
  switchStatus: boolean;
}

const BuyPage: React.FC<BuyPageProps> = ({ switchStatus }) => {
  const router = useRouter();

  return (
    <Layout>
      <CreateOrderHeader />
      <BuyComponent />
    </Layout>
  );
};

export default BuyPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const BASE_URL = `https://port-0-choonsim-market-back-lyscrsym8c0a1309.sel4.cloudtype.app/switch`;
  const switchResponse = await axios.get(BASE_URL);
  const switchStatus = switchResponse.data.isActive ?? false;

  return {
    props: {
      switchStatus,
    },
  };
};
