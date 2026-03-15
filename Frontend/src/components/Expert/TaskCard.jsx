import { useState } from "react";
import { Calendar, Users, Eye, Trash2 } from "lucide-react";

export default function TaskCard({ task, onClick, onView, onDelete }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const priorityColors = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-blue-100 text-blue-700",
  };

  // Safe progress clamp (0–100)
  const completionRate = Math.min(
    100,
    Math.max(0, task.progress?.completionRate || 0),
  );

  return (
    <>
      {/* Card */}
      <div
        onClick={() => onClick?.(task._id)}
        className="group bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex-1 group-hover:text-indigo-600 transition">
            {task.title}
          </h2>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              priorityColors[task.priority] || priorityColors.medium
            }`}
          >
            {task.priority?.toUpperCase() || "MEDIUM"}
          </span>
        </div>

        {/* Due Date */}
        <p className="text-gray-500 text-sm mb-5 flex items-center gap-2">
          <Calendar size={14} />
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No due date"}
        </p>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-600">Progress</span>
            <span className="font-bold text-indigo-600">{completionRate}%</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="h-3 rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${completionRate}%`,
                background: "linear-gradient(90deg,#6366f1,#8b5cf6)",
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <StatBox
            value={task.progress?.completed || 0}
            label="Completed"
            color="text-green-600"
            bg="bg-green-50"
          />
          <StatBox
            value={task.progress?.inProgress || 0}
            label="In Progress"
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatBox
            value={task.progress?.pending || 0}
            label="Pending"
            color="text-gray-600"
            bg="bg-gray-50"
          />
        </div>

        {/* Assigned */}
        <div className="flex items-center gap-2 text-gray-600 text-sm mb-5">
          <Users size={16} />
          {task.assignedTo?.length || 0} Students
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* View */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView?.(task._id);
            }}
            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 font-semibold"
          >
            <Eye size={16} />
            View
          </button>

          {/* Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="flex-1 bg-red-100 text-red-600 px-4 py-2.5 rounded-xl hover:bg-red-200 transition font-semibold flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-3xl shadow-2xl w-[350px] animate-scaleIn">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Delete Task?
            </h3>

            <p className="text-gray-500 text-sm mb-6">
              This action cannot be undone. Are you sure you want to delete this
              task?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl hover:bg-gray-200 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDelete?.(task._id);
                  setShowConfirm(false);
                }}
                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-xl hover:opacity-90 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* Reusable Stat Box */
function StatBox({ value, label, color, bg }) {
  return (
    <div className={`text-center p-3 rounded-xl ${bg}`}>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
