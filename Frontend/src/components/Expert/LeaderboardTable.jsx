import { Award } from "lucide-react";

export default function LeaderboardTable({
  data = [],
  title = "Leaderboard",
  showMedals = true,
  nameKey = "name",
  completedKey = "completed",
  totalKey = "total",
  rateKey = "completionRate",
}) {
  if (!data.length) return null;

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-100 mb-10">
      {/* Header */}
      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <Award size={26} className="text-indigo-600" />
        {title}
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-4">Rank</th>
              <th className="px-4">Name</th>
              <th className="px-4">Completed</th>
              <th className="px-4">Total</th>
              <th className="px-4">Progress</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => {
              const medal =
                showMedals && index === 0
                  ? "🥇"
                  : showMedals && index === 1
                    ? "🥈"
                    : showMedals && index === 2
                      ? "🥉"
                      : null;

              const gradients = [
                "linear-gradient(90deg,#6366f1,#8b5cf6)",
                "linear-gradient(90deg,#10b981,#06b6d4)",
                "linear-gradient(90deg,#f59e0b,#ef4444)",
              ];

              return (
                <tr
                  key={index}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 ${
                    index === 0 ? "ring-2 ring-yellow-300" : ""
                  }`}
                >
                  {/* Rank */}
                  <td className="px-4 py-4 font-bold text-gray-700 flex items-center gap-2">
                    {medal ? (
                      <span className="text-xl">{medal}</span>
                    ) : (
                      <span className="text-gray-400">#{index + 1}</span>
                    )}
                  </td>

                  {/* Name */}
                  <td className="px-4 py-4 font-semibold text-gray-800">
                    {item[nameKey]}
                  </td>

                  {/* Completed */}
                  <td className="px-4 py-4 text-green-600 font-bold">
                    {item[completedKey]}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-4 text-gray-600 font-medium">
                    {item[totalKey]}
                  </td>

                  {/* Progress */}
                  <td className="px-4 py-4 w-64">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                        <div
                          className="h-3 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${item[rateKey]}%`,
                            background: gradients[index % gradients.length],
                          }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-800 w-12 text-right">
                        {item[rateKey]}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
