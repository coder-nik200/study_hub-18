const Values = () => {
  const values = [
    {
      title: "Accessibility",
      description:
        "We believe quality education tools should be accessible to everyone, regardless of their background or resources.",
    },
    {
      title: "Innovation",
      description:
        "We continuously innovate to provide the most effective and user-friendly study management experience.",
    },
    {
      title: "Community",
      description:
        "We foster a supportive community where students can learn, grow, and succeed together.",
    },
  ];

  return (
    <>
      <div className="px-6 pb-20">
        <h1 className="mb-16 text-center text-5xl font-bold text-slate-800">
          Our Values
        </h1>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {values.map((value, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white p-10 shadow-lg border-l-4 border-indigo-600
                transition-all duration-300 ease-out lg:hover:-translate-y-1 lg:hover:shadow-xl active:-translate-y-1 active:shadow-xl"
            >
              <h3 className="mb-4 text-2xl font-semibold text-indigo-600">
                {value.title}
              </h3>

              <p className="leading-relaxed text-slate-600">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Values;
