const Strategies = () => {
  const strategies = [
    {
      title: "Time Management",
      points: [
        "Use time-blocking to allocate specific hours for different subjects",
        "Take regular breaks to maintain focus and prevent burnout",
        "Prioritize tasks based on deadlines and importance",
        "Avoid multitasking - focus on one task at a time",
      ],
    },
    {
      title: "Study Environment",
      points: [
        "Find a quiet, well-lit space dedicated to studying",
        "Keep your study area organized and clutter-free",
        "Minimize distractions by turning off notifications",
        "Use background music or white noise if it helps you focus",
      ],
    },
    {
      title: "Learning Techniques",
      points: [
        "Use active recall instead of passive reading",
        "Create mind maps to visualize connections between concepts",
        "Teach concepts to others to reinforce your understanding",
        "Practice spaced repetition for long-term retention",
      ],
    },
    {
      title: "Health & Wellness",
      points: [
        "Get 7-9 hours of quality sleep each night",
        "Exercise regularly to improve cognitive function",
        "Eat nutritious meals to fuel your brain",
        "Stay hydrated throughout your study sessions",
      ],
    },
  ];

  return (
    <section className="mx-auto mb-24 grid gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 items-start">
      {strategies.map((strategie, index) => (
        <div
          key={index}
          className="h-full rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg
                     transition-all duration-300 ease-out
                     lg:hover:-translate-y-1 lg:hover:shadow-2xl
                     active:-translate-y-1 active:shadow-2xl"
        >
          {/* TITLE */}
          <h3 className="mb-4 sm:mb-6 border-b-2 border-slate-200 pb-2 sm:pb-3 text-lg sm:text-xl font-semibold text-indigo-600">
            {strategie.title}
          </h3>

          {/* LIST */}
          <ul className="space-y-2 sm:space-y-3">
            {strategie.points.map((point, i) => (
              <li
                key={i}
                className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-slate-600 leading-relaxed"
              >
                <span className="mt-1 shrink-0 font-bold text-green-500">
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
};

export default Strategies;
