import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CalendarView = ({ tasks = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  /* ---------- HELPERS ---------- */

  const normalizeDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    for (let i = 0; i < firstDay.getDay(); i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++)
      days.push(new Date(year, month, d));

    return days;
  };

  const getWeekDays = (date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(
      (t) => normalizeDate(t.dueDate) === normalizeDate(date),
    );
  };

  const isToday = (date) => date?.toDateString() === new Date().toDateString();

  const navigate = (dir) => {
    const d = new Date(currentDate);
    view === "month"
      ? d.setMonth(d.getMonth() + dir)
      : d.setDate(d.getDate() + dir * 7);
    setCurrentDate(d);
  };

  const formatMonthYear = (date) =>
    date.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const formatWeekRange = (date) => {
    const week = getWeekDays(date);
    return `${week[0].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} - ${week[6].toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}, ${week[0].getFullYear()}`;
  };

  const days =
    view === "month" ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

  const weekLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  /* ---------- UI ---------- */

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-gray-50 border-b border-gray-200">
        {/* Navigation */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
              bg-white border border-gray-300
              hover:bg-indigo-600 hover:text-white hover:border-indigo-600
              transition-all"
          >
            <ChevronLeft size={20} />
          </button>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 min-w-[220px] text-center">
            {view === "month"
              ? formatMonthYear(currentDate)
              : formatWeekRange(currentDate)}
          </h2>

          <button
            onClick={() => navigate(1)}
            className="w-10 h-10 flex items-center justify-center rounded-lg
              bg-white border border-gray-300
              hover:bg-indigo-600 hover:text-white hover:border-indigo-600
              transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Toggle */}
        <div className="flex bg-white rounded-lg p-1 border border-gray-300">
          {["week", "month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-md font-medium transition-all
                ${
                  view === v
                    ? "bg-indigo-600 text-white shadow"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div
        className={`grid grid-cols-7 border border-gray-300 ${
          view === "month" ? "min-h-[600px]" : "min-h-[300px]"
        }`}
      >
        {/* Headers */}
        {weekLabels.map((day) => (
          <div
            key={day}
            className="py-4 text-center font-semibold text-sm
              bg-gray-100 border border-gray-300"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((date, i) => {
          const dayTasks = getTasksForDate(date);

          return (
            <div
              key={date ? date.toISOString() : `empty-${i}`}
              className={`border border-gray-300 p-2 transition-all
                ${
                  !date
                    ? "bg-gray-100 opacity-50"
                    : isToday(date)
                      ? "bg-gradient-to-br from-indigo-100 to-sky-50 border-2 border-indigo-500"
                      : "bg-white hover:bg-gray-50"
                }
                ${view === "week" ? "min-h-[200px]" : "min-h-[120px]"}
              `}
            >
              {date && (
                <>
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      isToday(date) ? "text-indigo-600" : "text-gray-800"
                    }`}
                  >
                    {date.getDate()}
                  </div>

                  <div className="flex flex-col gap-1">
                    {dayTasks
                      .slice(0, view === "month" ? 3 : 10)
                      .map((task) => (
                        <div
                          key={task._id}
                          title={task.title}
                          className={`text-[11px] px-2 py-1 rounded-lg cursor-pointer break-words whitespace-normal leading-tight transition-all ${
                            task.priority === "high"
                              ? "bg-red-100 text-red-700"
                              : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }${
                            task.completed
                              ? "line-through opacity-60"
                              : "hover:scale-[1.03] hover:shadow-sm"
                          }`}
                        >
                          {task.title}
                        </div>
                      ))}

                    {dayTasks.length > (view === "month" ? 3 : 10) && (
                      <div className="text-[10px] text-gray-500 bg-gray-100 border border-gray-300 rounded-full px-2 py-1 text-center mt-1">
                        +{dayTasks.length - (view === "month" ? 3 : 10)} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
