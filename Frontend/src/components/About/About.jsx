import AboutFeatures from "./AboutFeatures";
import Values from "./Values";

const About = () => {
  return (
    <>
      <section className="min-h-screen bg-white py-16">
        {/* HERO SECTION */}
        <div className="mx-auto mb-20 max-w-4xl px-6 text-center">
          <h1
            className="mb-9 bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text
               text-4xl sm:text-5xl font-extrabold text-transparent
               leading-tight md:leading-[1.3]"
          >
            About StudyHub
          </h1>

          <p className="mx-auto max-w-3xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-600">
            StudyHub is designed to empower students with the tools they need to
            succeed academically. Our platform combines modern technology with
            proven study methodologies to create an environment where learning
            thrives.
          </p>
        </div>

        {/* MISSION SECTION */}
        <div className="mb-20 flex justify-center px-6">
          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-3/4 max-w-3xl rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 px-6 sm:px-10 py-10 sm:py-16 text-center text-white shadow-2xl">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold">
              Our Mission
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed opacity-95">
              To make quality education accessible and organized for every
              student, regardless of their background or learning style.
            </p>
          </div>
        </div>

        {/* FEATURES SECTION */}
        <div className="px-4 sm:px-6 md:px-16 pb-12 sm:pb-16 lg:pb-24">
          <h1 className="text-center pb-6 sm:pb-12 text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800">
            Why Choose StudyHub?
          </h1>
          <AboutFeatures />
        </div>

        {/* VALUES SECTION */}
        <div className="px-4 sm:px-6 md:px-16">
          <Values />
        </div>
      </section>
    </>
  );
};

export default About;
