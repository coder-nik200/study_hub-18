import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Cta = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <section className="bg-gradient-to-br from-slate-800 to-slate-700 py-16 sm:py-20 text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Ready to Transform Your Study Habits?
          </h2>

          <p className="mb-8 sm:mb-10 text-base sm:text-lg opacity-90">
            Join thousands of students who have improved their academic
            performance with StudyHub.
          </p>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            {/* Primary Button */}
            <button
              onClick={handleSubmit}
              className="rounded-2xl bg-blue-600 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white
               transition-all duration-300 ease-out
               hover:-translate-y-1 hover:bg-blue-700 hover:shadow-lg
               active:translate-y-0.5"
            >
              Get Started Free
            </button>

            {/* Secondary Button */}
            <button
              onClick={() => navigate("/about")}
              className="rounded-2xl border-2 border-blue-500 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-blue-500
               transition-all duration-300 ease-out
               hover:-translate-y-1 hover:bg-blue-500 hover:text-white hover:shadow-lg
               active:translate-y-0.5"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cta;
