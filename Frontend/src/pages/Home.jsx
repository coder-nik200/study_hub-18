import Hero from "./Hero";
import Preview from "./Preview";
import Features from "./Features";
import Testimonials from "./Testimonials";
import Stats from "./Stats";
import Contact from "../components/Contact";
import Cta from "./Cta";
import AiChatBot from "../components/ChatBot/AiChatBot";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= CHATBOT ================= */}
      <AiChatBot />

      {/* ================= PREVIEW ================= */}
      <Preview />

      {/* ================= FEATURES ================= */}
      <Features />

      {/* ================= TESTIMONIALS ================= */}
      <Testimonials />

      {/* ================= STATS ================= */}
      <Stats />

      {/* ================= CONTACT ================= */}
      <Contact />

      {/* ================= CTA ================= */}
      <Cta />
    </div>
  );
};

export default Home;
