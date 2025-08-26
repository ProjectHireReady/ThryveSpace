// import Fade from "../components/Fade";
import Hero from "../components/Hero";
import FeaturesPreview from "../components/FeaturesPreview";
import DailyUplifts from "../components/DailyUplifts";
import BenefitsSection from "../components/BenefitsSection";
import FaqSection from "../components/FaqSection";
import CTA from "../components/CTA";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
function HomePage() {
  return (
    <>
      {/* <Fade> */}
        <Hero />
        <FeaturesPreview />
        <DailyUplifts />
        <BenefitsSection />
        <FaqSection />
        <CTA />
        <ContactSection />
        <Footer />
      {/* </Fade> */}
    </>
  );
}

export default HomePage;
