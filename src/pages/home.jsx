import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Features } from "../components/feature";
import { Industries } from "../components/industries";
import { Platform } from "../components/platform";
import { SocialProof } from "../components/socialProof";
import { CTA } from "../components/CTA";
import { Footer } from "../components/footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <Industries />
        <Platform />
        <SocialProof />
        <CTA />
      </main>
    </div>
  );
};

export default Home;
