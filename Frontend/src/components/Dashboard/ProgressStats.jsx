import { CheckSquare, Clock, AlertTriangle, Target } from "lucide-react";

/* -------------------- Date Helpers -------------------- */
const normalizeDate = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const toDate = (value) => {
  if (!value) return null;
  if (value?.seconds) return new Date(value.seconds * 1000);
  return new Date(value);
};

/* -------------------- Component -------------------- */
const ProgressStats = ({ tasks = [] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const today = normalizeDate(new Date());

  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    return normalizeDate(toDate(t.dueDate)) < today;
  }).length;

  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const priorityStats = {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };

  const categoryStats = tasks.reduce((acc, task) => {
    if (!task.category) return acc;
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  const weeklyProgress = () => {
    const weekAgo = normalizeDate(new Date());
    weekAgo.setDate(weekAgo.getDate() - 7);

    return tasks.filter((t) => {
      if (!t.completed) return false;
      const completedDate = toDate(t.completedAt || t.updatedAt);
      return completedDate && normalizeDate(completedDate) >= weekAgo;
    }).length;
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Heading */}
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800">
        Your Progress Overview
      </h2>

      {/* ---------------- Top Cards (FIXED GRID) ---------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {[
          {
            label: "Total Tasks",
            value: totalTasks,
            icon: <Target className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: "bg-indigo-600",
          },
          {
            label: "Completed",
            value: completedTasks,
            icon: <CheckSquare className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: "bg-emerald-500",
          },
          {
            label: "Pending",
            value: pendingTasks,
            icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: "bg-yellow-500",
          },
          {
            label: "Overdue",
            value: overdueTasks,
            icon: <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />,
            color: "bg-red-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-md
              flex flex-col sm:flex-row items-center gap-3 sm:gap-5
              text-center sm:text-left min-h-[120px]
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl
              active:-translate-y-1 active:shadow-xl"
          >
            <div className={`p-3.5 rounded-2xl text-white ${item.color}`}>
              {item.icon}
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold">
                {item.value}
              </h3>
              <p className="text-gray-500 text-sm">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- Progress Section ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Completion Rate */}
        <div
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md text-center
          transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          active:-translate-y-1 active:shadow-xl"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-4">
            Overall Completion Rate
          </h3>

          <div className="relative w-[96px] h-[96px] sm:w-[120px] sm:h-[120px] mx-auto mb-4">
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#6366f1 ${completionRate}%, #e5e7eb 0)`,
              }}
            >
              <div className="w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] bg-white rounded-full flex items-center justify-center">
                <span className="text-lg sm:text-xl font-bold text-indigo-600">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-800 text-sm sm:text-base">
            You've completed {completedTasks} out of {totalTasks} tasks
          </p>
        </div>

        {/* Weekly Progress */}
        <div
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md text-center
          transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
          active:-translate-y-1 active:shadow-xl"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-6">
            This Week's Activity
          </h3>
          <div className="text-4xl sm:text-5xl font-extrabold text-indigo-600">
            {weeklyProgress()}
          </div>
          <p className="text-gray-800 mt-2">Tasks completed</p>
        </div>
      </div>

      {/* ---------------- Charts ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {/* Priority */}
        <div
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md
          transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl
          active:-translate-y-[3px] active:shadow-xl"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center">
            Tasks by Priority
          </h3>

          {["high", "medium", "low"].map((level) => (
            <div
              key={level}
              className="grid grid-cols-[50px_1fr_36px] sm:grid-cols-[60px_1fr_40px]
                gap-3 items-center mb-4"
            >
              <span className="capitalize text-sm font-medium">{level}</span>
              <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width] duration-500 ease-in-out ${
                    level === "high"
                      ? "bg-red-500"
                      : level === "medium"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                  }`}
                  style={{
                    width: totalTasks
                      ? `${(priorityStats[level] / totalTasks) * 100}%`
                      : "0%",
                  }}
                />
              </div>
              <span className="text-sm font-semibold text-center">
                {priorityStats[level]}
              </span>
            </div>
          ))}
        </div>

        {/* Category */}
        <div
          className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-md
          transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl
          active:-translate-y-[3px] active:shadow-xl"
        >
          <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center">
            Tasks by Category
          </h3>

          <div className="flex flex-col gap-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div
                key={category}
                className="flex justify-between items-center
                  px-3 py-3 sm:px-4 sm:py-2 rounded-lg
                  bg-gray-100 hover:bg-gray-200 active:bg-gray-200
                  transition-colors duration-300"
              >
                <span className="capitalize font-medium">{category}</span>
                <span
                  className="bg-white px-3 py-1 rounded-full
                  text-indigo-600 font-semibold text-sm"
                >
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;
