import "./Home.css";

const Stats = () => {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 text-white">
        <div className="mx-auto max-w-7xl grid grid-cols-2 gap-10 px-6 md:grid-cols-4 text-center">
          {[
            ["10,000+", "Active Students"],
            ["500,000+", "Tasks Completed"],
            ["95%", "Success Rate"],
            ["24/7", "Available"],
          ].map(([num, label], i) => (
            <div key={i}>
              <div className="text-4xl font-extrabold bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                {num}
              </div>
              <div className="mt-2 opacity-90">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Stats;
