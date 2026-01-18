import { CheckSquare, Clock, AlertTriangle, Target } from "lucide-react";

/* -------------------- Date Helpers -------------------- */
const normalizeDate = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

const toDate = (value) => {
  if (!value) return null;

  // Firebase Timestamp
  if (value?.seconds) return new Date(value.seconds * 1000);

  return new Date(value);
};

/* -------------------- Component -------------------- */
const ProgressStats = ({ tasks = [] }) => {
  /* ---------- Basic Stats ---------- */
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

  /* ---------- Priority Stats ---------- */
  const priorityStats = {
    high: tasks.filter((t) => t.priority === "high").length,
    medium: tasks.filter((t) => t.priority === "medium").length,
    low: tasks.filter((t) => t.priority === "low").length,
  };

  /* ---------- Category Stats ---------- */
  const categoryStats = tasks.reduce((acc, task) => {
    if (!task.category) return acc;
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {});

  /* ---------- Weekly Progress (FIXED) ---------- */
  const weeklyProgress = () => {
    const weekAgo = normalizeDate(new Date());
    weekAgo.setDate(weekAgo.getDate() - 7);

    return tasks.filter((t) => {
      if (!t.completed) return false;

      const completedDate = toDate(t.completedAt || t.updatedAt);
      if (!completedDate) return false;

      return normalizeDate(completedDate) >= weekAgo;
    }).length;
  };

  return (
    <div className="flex flex-col gap-10">
      {/* ---------------- Heading ---------------- */}
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
        Your Progress Overview
      </h2>

      {/* ---------------- Top Stat Cards (SEPARATE) ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Total */}
        <div
          className="bg-white p-8 rounded-3xl shadow-md flex items-center gap-5 min-h-[120px]
    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="p-3.5 rounded-2xl text-white bg-indigo-600">
            <Target size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{totalTasks}</h3>
            <p className="text-gray-500 text-sm">Total Tasks</p>
          </div>
        </div>

        {/* Completed */}
        <div
          className="bg-white p-8 rounded-3xl shadow-md flex items-center gap-5 min-h-[120px]
    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="p-3.5 rounded-2xl text-white bg-emerald-500">
            <CheckSquare size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{completedTasks}</h3>
            <p className="text-gray-500 text-sm">Completed</p>
          </div>
        </div>

        {/* Pending */}
        <div
          className="bg-white p-8 rounded-3xl shadow-md flex items-center gap-5 min-h-[120px]
    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="p-3.5 rounded-2xl text-white bg-yellow-500">
            <Clock size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{pendingTasks}</h3>
            <p className="text-gray-500 text-sm">Pending</p>
          </div>
        </div>

        {/* Overdue */}
        <div
          className="bg-white p-8 rounded-3xl shadow-md flex items-center gap-5 min-h-[120px]
    transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="p-3.5 rounded-2xl text-white bg-red-600">
            <AlertTriangle size={26} />
          </div>
          <div>
            <h3 className="text-2xl font-extrabold">{overdueTasks}</h3>
            <p className="text-gray-500 text-sm">Overdue</p>
          </div>
        </div>
      </div>

      {/* ---------------- Progress Section ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Completion Rate */}
        <div
          className="bg-white p-8 rounded-2xl shadow-md text-center
          transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4">
            Overall Completion Rate
          </h3>

          <div className="relative w-[120px] h-[120px] mx-auto mb-4">
            <div
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(#6366f1 ${completionRate}%, #e5e7eb 0)`,
              }}
            >
              <div className="w-[80px] h-[80px] bg-white rounded-full flex items-center justify-center">
                <span className="text-xl font-bold text-indigo-600">
                  {completionRate}%
                </span>
              </div>
            </div>
          </div>

          <p className="text-gray-800">
            You've completed {completedTasks} out of {totalTasks} tasks
          </p>
        </div>

        {/* Weekly Progress */}
        <div
          className="bg-white p-8 rounded-2xl shadow-md text-center
          transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6">This Week's Activity</h3>
          <div className="text-5xl font-extrabold text-indigo-600">
            {weeklyProgress()}
          </div>
          <p className="text-gray-800 mt-2">Tasks completed</p>
        </div>
      </div>

      {/* ---------------- Charts ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Priority Chart */}
        <div
          className="bg-white p-8 rounded-2xl shadow-md
          transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">
            Tasks by Priority
          </h3>

          {["high", "medium", "low"].map((level) => (
            <div
              key={level}
              className="grid grid-cols-[60px_1fr_40px] gap-3 items-center mb-4"
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

        {/* Category Chart */}
        <div
          className="bg-white p-8 rounded-2xl shadow-md
          transition-all duration-300 hover:-translate-y-[3px] hover:shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-6 text-center">
            Tasks by Category
          </h3>

          <div className="flex flex-col gap-3">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div
                key={category}
                className="flex justify-between items-center px-4 py-2 rounded-lg
                  bg-gray-100 hover:bg-gray-200 transition-colors duration-300"
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
