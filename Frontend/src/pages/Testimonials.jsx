import { Star } from "lucide-react";
import "./Home.css";

const Testimonials = () => {
  return (
    <>
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-14 text-center text-4xl font-bold">
            What Students Say
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: "Nitin Kumar",
                role: "Computer Science Student",
                text: "StudyHub completely transformed how I organize my studies. My grades improved significantly!",
              },
              {
                name:"Anjali Singhania",
                role: "Business Major",
                text: "The calendar view and priority system help me stay on top of all assignments.",
              },
              {
                name: "Vansh Rai",
                role: "Pre-Med Student",
                text: "Simple, intuitive, and effective. Exactly what every student needs.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="relative rounded-2xl bg-white p-8 shadow transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mb-4 flex gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="mb-6 italic text-slate-600">“{t.text}”</p>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white font-semibold">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-sm text-slate-500">{t.role}</div>
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
