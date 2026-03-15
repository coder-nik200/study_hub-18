export default function SimplePieChart({ data = [], title }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data.length || total === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-gray-100 text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  let currentAngle = 0;

  const calculatePath = (value) => {
    const angle = (value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
    const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
    const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
    const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);

    const largeArc = angle > 180 ? 1 : 0;

    return `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-100 hover:shadow-indigo-100 transition-all duration-300">
      <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h3>

      <div className="flex items-center justify-center">
        <svg
          width="240"
          height="240"
          viewBox="0 0 100 100"
          className="drop-shadow-xl"
        >
          {data.map((item, index) => {
            const path = calculatePath(item.value);
            return (
              <path
                key={index}
                d={path}
                fill={colors[index % colors.length]}
                stroke="white"
                strokeWidth="2"
                className="hover:scale-105 hover:brightness-110 transition-all duration-300 origin-center cursor-pointer"
              />
            );
          })}

          {/* Center Circle for Doughnut Feel */}
          <circle cx="50" cy="50" r="25" fill="white" />

          {/* Center Total */}
          <text
            x="50"
            y="47"
            textAnchor="middle"
            fontSize="8"
            fill="#6b7280"
            fontWeight="500"
          >
            Total
          </text>
          <text
            x="50"
            y="55"
            textAnchor="middle"
            fontSize="10"
            fill="#111827"
            fontWeight="bold"
          >
            {total}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-xl transition"
          >
            <div
              className="w-4 h-4 rounded-full shadow"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-600 font-medium">
              {item.label}
            </span>
            <span className="ml-auto text-sm font-bold text-gray-800">
              {item.value}
            </span>
            <span className="text-xs text-gray-400">
              ({Math.round((item.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
