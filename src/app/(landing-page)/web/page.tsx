

import Section1 from "@/modules/web/Section1";
import Section2 from "@/modules/web/Section2";
import Section3 from "@/modules/web/Section3";
import Section4 from "@/modules/web/Section4";
import Footer from "@/modules/web/footer";
import Header from "@/modules/web/header";
import Hero from "@/modules/web/hero";


const WebPage = () => {
  
  return (
    <div
      className="h-full w-full bg-black overflow-hidden selection:bg-primary/30"
      style={{ colorScheme: "dark" }}
    >
      <Header />
      <Hero />
      <Section1/>
      <Section2/>
      <Section3/>
      <Section4/>
      <Footer/>
    </div>
  );
};

export default WebPage;
