import { useEffect, useState } from "react";

export default function SimpleBarChart({ data = [], title }) {
  const [animatedData, setAnimatedData] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedData(data);
    }, 200);
    return () => clearTimeout(timeout);
  }, [data]);

  if (!data.length) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-xl border border-gray-100 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  const gradients = [
    "linear-gradient(90deg,#6366f1,#8b5cf6)",
    "linear-gradient(90deg,#10b981,#06b6d4)",
    "linear-gradient(90deg,#f59e0b,#ef4444)",
    "linear-gradient(90deg,#ec4899,#8b5cf6)",
    "linear-gradient(90deg,#3b82f6,#06b6d4)",
  ];

  return (
    <div className="bg-white/70 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-gray-100 hover:shadow-indigo-100 transition-all duration-500">
      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-800 mb-8 tracking-wide">
        {title}
      </h3>

      <div className="space-y-6">
        {data.map((item, index) => {
          const percentage =
            ((animatedData[index]?.value || 0) / maxValue) * 100;

          return (
            <div key={index} className="group">
              {/* Label Row */}
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-800 transition">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {item.value}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="relative w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner">
                <div
                  className="h-8 rounded-full flex items-center justify-end pr-4 text-xs font-bold text-white transition-all duration-1000 ease-out transform group-hover:scale-[1.02]"
                  style={{
                    width: `${percentage}%`,
                    background: gradients[index % gradients.length],
                  }}
                >
                  {item.value > 0 && `${Math.round(percentage)}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
