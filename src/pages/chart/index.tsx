import { ChartComponent } from "@/components/chart/ChartComponent";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Layout } from "@/components/common/Layout";

export default function ChartPage() {
  return (
    <Layout>
      <Header />
      <ChartComponent />
      <Footer />
    </Layout>
  );
}
