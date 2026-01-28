import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import contentData from "../data/content.json";
import "./Home.css";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Hero = () => {
  const { homepage } = contentData;
  const user = useContext(UserContext);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 py-28 md:grid-cols-2">
          <div className="animate-[slideInLeft_1s_ease]">
            <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
              {homepage.hero.title}
            </h1>
            <p className="mb-8 text-lg opacity-90">{homepage.hero.subtitle}</p>

            <div className="flex flex-wrap gap-4">
              <Link
                to={user ? "/dashboard" : "/signup"} // ✅ dynamic
                className="rounded-2xl bg-indigo-600 text-white px-8 py-4 font-semibold shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                {homepage.hero.cta}
              </Link>
              <Link
                to="/about"
                className="rounded-2xl border-2 text-blue-900 border-blue-900 px-8 py-4 font-semibold transition hover:bg-indigo-600 hover:text-white hover:-translate-y-1 hover:shadow-2xl"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="flex justify-center animate-[slideInRight_1s_ease]">
            <div className="flex h-72 w-90 flex-col items-center justify-center rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg animate-[float_3s_ease-in-out_infinite]">
              <Calendar size={48} />
              <h3 className="mt-6 text-2xl font-semibold">Smart Planning</h3>
              <p className="mt-2 text-md opacity-80">
                Organize your study schedule efficiently
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
