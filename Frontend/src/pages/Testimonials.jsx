import { Star } from "lucide-react";
import "./Home.css";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Nitin Kumar",
      role: "Computer Science Student",
      text: "StudyHub completely transformed how I organize my studies. My grades improved significantly!",
    },
    {
      name: "Anjali Singhania",
      role: "Business Major",
      text: "The calendar view and priority system help me stay on top of all assignments.",
    },
    {
      name: "Vansh Rai",
      role: "Pre-Med Student",
      text: "Simple, intuitive, and effective. Exactly what every student needs.",
    },
  ];

  return (
    <>
      <section className="bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="mb-12 text-center text-3xl sm:text-4xl font-bold">
            What Students Say
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="relative rounded-2xl bg-white p-6 sm:p-8 shadow
                  transition-all duration-300 ease-out
                  hover:-translate-y-2 hover:shadow-xl
                  active:-translate-y-2 active:shadow-xl"
              >
                {/* Stars */}
                <div className="mb-3 flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="mb-4 sm:mb-6 text-sm sm:text-base italic text-slate-600">
                  “{t.text}”
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-indigo-500 text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      {t.name}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-500">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Testimonials;
