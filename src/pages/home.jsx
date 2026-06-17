import { Header } from "../components/homePage/header";
import { Hero } from "../components/homePage/hero";
import { Features } from "../components/homePage/feature";
import { Industries } from "../components/homePage/industries";
import { Platform } from "../components/homePage/platform";
import { SocialProof } from "../components/homePage/socialProof";
import { CTA } from "../components/homePage/CTA";
import { Footer } from "../components/homePage/footer";

const Home = () => {
  return (
    <div className="min-h-screen">
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
