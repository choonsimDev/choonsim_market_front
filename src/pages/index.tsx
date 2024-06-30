import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Layout } from "@/components/common/Layout";
import { MainComponent } from "@/components/main/MainComponent";

export default function Home() {
  return (
    <Layout>
      <Header />
      <MainComponent />
      <Footer />
    </Layout>
  );
}
