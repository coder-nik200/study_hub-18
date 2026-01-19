import Strategies from "./Strategies";
import TipsFeatures from "./TipsFeatures";

const Tips = () => {
  return (
    <>
      <section className="min-h-screen bg-slate-50 py-16">
        {/* HEADER */}
        <div className="mb-16 px-4 sm:px-6 md:px-6 text-center">
          <h1 className="mb-4 text-4xl sm:text-5xl bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text font-extrabold text-transparent">
            Study Tips & Best Practices
          </h1>
          <p className="mx-auto max-w-xl text-base sm:text-lg text-slate-600">
            Proven strategies to enhance your learning and boost your academic
            performance
          </p>
        </div>

        {/* FEATURES */}
        <TipsFeatures />

        {/* STRATEGIES SECTION */}
        <div className="mb-20 px-4 sm:px-6 md:px-6 text-center">
          <h1 className="mb-12 text-3xl sm:text-4xl font-bold text-slate-800">
            More Study Strategies
          </h1>

          <Strategies />
        </div>

        {/* REMEMBER SECTION */}
        <div className="mb-20 px-4 sm:px-6 flex justify-center">
          <div className="w-full sm:w-[90%] md:w-[80%] lg:w-3/4 max-w-3xl rounded-2xl bg-gradient-to-br from-slate-800 to-slate-700 px-6 sm:px-10 py-10 sm:py-16 text-center text-white shadow-2xl">
            <h2 className="mb-4 sm:mb-6 text-2xl sm:text-4xl font-bold">
              Remember
            </h2>

            <p className="mb-6 text-base sm:text-xl leading-relaxed opacity-95">
              Success in studying isn't about perfection—it's about consistency,
              persistence, and finding what works best for you. Every small step
              forward is progress worth celebrating.
            </p>

            <p className="text-sm sm:text-lg font-semibold italic opacity-90">
              “The expert in anything was once a beginner.”
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tips;
