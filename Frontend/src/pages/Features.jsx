import "./Home.css";
import Features1 from "../components/HomeFeatures";

const Features = () => {
  return (
    <>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-4xl font-bold">
            Why Choose StudyHub?
          </h2>

          <Features1 />
        </div>
      </section>
    </>
  );
};

export default Features;
