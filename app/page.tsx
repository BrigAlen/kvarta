import { About } from "./components/About";
import { Delivery } from "./components/Delivery";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { LeadForm } from "./components/LeadForm";
import { HeaderTone } from "./components/HeaderTone";
import { Menu } from "./components/Menu";
import { StickyCta } from "./components/StickyCta";
import { Subscription } from "./components/Subscription";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Menu />
        <Subscription />
        <Delivery />
        <LeadForm />
      </main>
      <Footer />
      <HeaderTone />
      <StickyCta />
    </>
  );
}
