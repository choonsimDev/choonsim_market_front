import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import { Layout } from "@/components/common/Layout";
import { HelpComponent } from "@/components/help/HelpComponent";

export default function HelpPage() {
  return (
    <Layout>
      <Header />
      <HelpComponent />
      <Footer />
    </Layout>
  );
}
