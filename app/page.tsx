import ContactUs2 from "@/components/mvpblocks/contact-us-2";
import Faq1 from "@/components/mvpblocks/faq-1";
import Feature1 from "@/components/mvpblocks/feature-1";
import Footer4Col from "@/components/mvpblocks/footer-4col";
import GradientHero from "@/components/mvpblocks/gradient-hero";
import Header2 from "@/components/mvpblocks/header-2";
import SimplePricing from "@/components/mvpblocks/simple-pricing";

export default function Home() {
  return (
    <>
      <Header2 />
      <GradientHero />
      <Feature1 />
      <SimplePricing />
      <Faq1 />
      <ContactUs2 />
      <Footer4Col />
    </>
  );
}
