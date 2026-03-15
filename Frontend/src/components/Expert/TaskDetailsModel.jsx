import { Calendar, X } from "lucide-react";
import GradeInput from "./GradeInput";

export default function TaskDetailsModal({
  isOpen,
  taskDetails,
  onClose,
  onGradeUpdate,
}) {
  if (!isOpen || !taskDetails) return null;

  const { task, analytics, assignments } = taskDetails;

  const priorityStyles = {
    high: "bg-red-100 text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-blue-100 text-blue-700",
  };

  const statusStyles = {
    Completed: "bg-green-100 text-green-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Pending: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full sm:max-w-4xl md:max-w-6xl max-h-[95vh] overflow-y-auto no-scrollbar transition-all duration-300">
        {/* Gradient Top Accent */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-3xl" />

        <div className="p-4 sm:p-6 md:p-8">
          {/* HEADER */}
          <div className="relative mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {task.title}
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1 sm:gap-2">
                    <Calendar size={16} />
                    <span>Due: {new Date(task.dueDate).toLocaleString()}</span>
                  </div>

                  <span
                    className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                      priorityStyles[task.priority] || priorityStyles.medium
                    }`}
                  >
                    {task.priority?.toUpperCase() || "MEDIUM"}
                  </span>
                </div>
              </div>
            </div>

            {/* Close button always top-right */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-red-100 transition"
            >
              <X size={22} className="text-gray-500 hover:text-red-500" />
            </button>
          </div>

          {/* ANALYTICS CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 sm:mb-8">
            {[
              {
                label: "Total Students",
                value: analytics.total,
                color: "indigo",
              },
              {
                label: "Completed",
                value: analytics.completed,
                color: "green",
              },
              {
                label: "In Progress",
                value: analytics.inProgress,
                color: "blue",
              },
              { label: "Pending", value: analytics.pending, color: "gray" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-${stat.color}-50 p-4 sm:p-6 rounded-2xl text-center shadow-sm hover:shadow-md transition`}
              >
                <div
                  className={`text-2xl sm:text-3xl font-bold text-${stat.color}-600`}
                >
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          {task.description && (
            <div className="mb-6 sm:mb-8">
              <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
                Description
              </h3>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-xl text-gray-600 whitespace-pre-wrap text-sm sm:text-base">
                {task.description}
              </div>
            </div>
          )}

          {/* STUDENT TABLE */}
          <div className="mb-6 sm:mb-8">
            <h3 className="font-semibold text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
              Student Progress
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-gray-100">
              <table className="w-full text-xs sm:text-sm min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-left">
                      Student
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-left">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-left">
                      Submitted
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-left">
                      Score
                    </th>
                    <th className="px-3 sm:px-6 py-2 sm:py-4 text-left">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {assignments.map((assignment) => (
                    <tr
                      key={assignment._id}
                      className="hover:bg-indigo-50/40 transition"
                    >
                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-indigo-100 rounded-full flex items-center justify-center font-semibold text-indigo-600">
                            {assignment.student?.name?.charAt(0) || "?"}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-xs sm:text-sm">
                              {assignment.student?.name || "Unknown"}
                            </div>
                            <div className="text-gray-500 text-[10px] sm:text-xs">
                              {assignment.student?.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 sm:px-6 py-2 sm:py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                            statusStyles[assignment.status] ||
                            statusStyles.Pending
                          }`}
                        >
                          {assignment.status}
                        </span>
                      </td>

                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-gray-600 text-[10px] sm:text-sm">
                        {assignment.submittedAt
                          ? new Date(
                              assignment.submittedAt,
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="px-3 sm:px-6 py-2 sm:py-4 font-semibold text-indigo-600 text-[10px] sm:text-sm">
                        {assignment.score !== undefined
                          ? `${assignment.score}/100`
                          : "-"}
                      </td>

                      <td className="px-3 sm:px-6 py-2 sm:py-4 text-[10px] sm:text-sm">
                        {assignment.status === "Completed" && (
                          <GradeInput
                            assignmentId={assignment._id}
                            currentScore={assignment.score}
                            currentFeedback={assignment.feedback}
                            onGradeUpdate={onGradeUpdate}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FOOTER */}
          <button
            onClick={onClose}
            className="mt-4 sm:mt-6 w-full bg-indigo-600 text-white py-2.5 sm:py-3 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
