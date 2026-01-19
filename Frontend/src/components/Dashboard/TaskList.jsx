import { useState } from "react";
import { Edit2, Trash2, Calendar, Flag } from "lucide-react";

const TaskList = ({ tasks, onToggleComplete, onEditTask, onDeleteTask }) => {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") return new Date(a.dueDate) - new Date(b.dueDate);
    if (sortBy === "priority") {
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.priority] - order[a.priority];
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isOverdue = (task) =>
    new Date(task.dueDate) < new Date() && !task.completed;

  /* ---------------- EMPTY STATE ---------------- */

  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <Calendar size={48} className="mx-auto mb-5 opacity-50" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tasks yet
        </h3>
        <p>Create your first task to get started 🚀</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      {/* ================= FILTERS ================= */}
      <div className="p-5 bg-gray-50 border-b">
        <div className="flex items-center gap-4 flex-nowrap md:flex-row">
          {/* Filter */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <label className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              Filter:
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-500 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                hover:border-indigo-500 transition"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <label className="text-sm font-semibold text-gray-800 whitespace-nowrap">
              Sort:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border border-gray-500 rounded-md text-sm
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                hover:border-indigo-500 transition"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="created">Created</option>
            </select>
          </div>
        </div>
      </div>

      {/* ================= TASK LIST ================= */}
      <div className="max-h-[600px] overflow-y-auto">
        {sortedTasks.map((task) => (
          <div
            key={task._id}
            className={`flex gap-4 p-5 border-b transition
              ${task.completed ? "opacity-70" : ""}
              ${
                isOverdue(task)
                  ? "bg-red-50 border-l-4 border-red-500"
                  : "hover:bg-gray-50"
              }
            `}
          >
            {/* Checkbox (always front) */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleComplete(task)}
              className="mt-1 w-4 h-4 accent-indigo-600 cursor-pointer shrink-0"
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h3
                  className={`text-lg font-semibold text-gray-900
                    ${task.completed ? "line-through" : ""}
                  `}
                >
                  {task.title}
                </h3>

                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full capitalize
                    ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-600"
                        : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }
                  `}
                >
                  <Flag size={12} />
                  {task.priority}
                </span>
              </div>

              {task.description && (
                <p className="text-gray-600 mb-3 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  Due: {formatDate(task.dueDate)}
                </span>

                <span className="px-3 py-1 bg-gray-100 rounded-full text-xs capitalize">
                  {task.category}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 self-start">
              <button
                onClick={() => onEditTask(task)}
                className="w-9 h-9 flex items-center justify-center rounded-md
                  bg-gray-100 text-gray-600
                  hover:bg-indigo-600 hover:text-white transition"
                title="Edit"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => onDeleteTask(task._id)}
                className="w-9 h-9 flex items-center justify-center rounded-md
                  bg-gray-100 text-gray-600
                  hover:bg-red-600 hover:text-white transition"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
