import "./Home.css";
import HomeFeatures from "../components/HomeFeatures";

const Features = () => {
  return (
    <>
      <section className="py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 sm:mb-14 text-center text-3xl sm:text-4xl font-bold">
            Why Choose StudyHub?
          </h2>

          <HomeFeatures />
        </div>
      </section>
    </>
  );
};

export default Features;
