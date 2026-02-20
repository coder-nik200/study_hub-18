import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Send,
  Download,
  Eye,
  X,
} from "lucide-react";
import {
  getStudentTaskAssignments,
  updateTaskStatus,
} from "../../api/axios";
import { toast } from "react-toastify";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getStudentTaskAssignments();
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      fetchTasks();
      if (selectedTask?._id === taskId) {
        setSelectedTask(null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleSubmitTask = async (taskId) => {
    if (!submissionText.trim()) {
      toast.error("Please provide a submission");
      return;
    }

    try {
      setSubmitting(true);
      await updateTaskStatus(taskId, {
        status: "Completed",
        submissionData: {
          answer: submissionText,
        },
      });
      toast.success("Task submitted successfully!");
      setSubmissionText("");
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error submitting task:", error);
      toast.error("Failed to submit task");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="text-green-600" size={20} />;
      case "In Progress":
        return <Clock className="text-blue-600" size={20} />;
      default:
        return <AlertCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-600">
            View and manage tasks assigned by your teachers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter((t) => t.status === "Completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter((t) => t.status === "In Progress").length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-2xl font-bold text-gray-600">
              {tasks.filter((t) => t.status === "Pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((assignment) => {
            const task = assignment.task;
            const daysUntilDue = getDaysUntilDue(task.dueDate);
            const overdue = isOverdue(task.dueDate);

            return (
              <div
                key={assignment._id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-1">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <User size={14} />
                        <span>{task.createdBy?.name || "Expert"}</span>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </div>
                  </div>

                  {/* Description Preview */}
                  {task.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Due Date */}
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Calendar size={16} className="text-gray-400" />
                    <span className={overdue ? "text-red-600 font-medium" : "text-gray-600"}>
                      {overdue
                        ? `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? "s" : ""}`
                        : daysUntilDue === 0
                        ? "Due today"
                        : daysUntilDue === 1
                        ? "Due tomorrow"
                        : `Due in ${daysUntilDue} days`}
                    </span>
                  </div>

                  {/* Priority Badge */}
                  <div className="mb-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {task.priority?.toUpperCase() || "MEDIUM"}
                    </span>
                  </div>

                  {/* Attachments */}
                  {task.attachments && task.attachments.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FileText size={14} />
                        <span>{task.attachments.length} attachment(s)</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedTask(assignment)}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2 text-sm"
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                    {assignment.status !== "Completed" && (
                      <button
                        onClick={() =>
                          handleStatusChange(
                            task._id,
                            assignment.status === "Pending" ? "In Progress" : "Completed"
                          )
                        }
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm"
                      >
                        {assignment.status === "Pending" ? "Start" : "Complete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FileText size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks assigned</h3>
            <p className="text-gray-500">You don't have any tasks assigned yet.</p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedTask.task.title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>Assigned by: {selectedTask.task.createdBy?.name || "Expert"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>
                        Due: {new Date(selectedTask.task.dueDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setSubmissionText("");
                  }}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(selectedTask.status)}`}>
                  {getStatusIcon(selectedTask.status)}
                  <span className="font-medium">{selectedTask.status}</span>
                </div>
              </div>

              {/* Description */}
              {selectedTask.task.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedTask.task.description}
                  </p>
                </div>
              )}

              {/* Attachments */}
              {selectedTask.task.attachments && selectedTask.task.attachments.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Attachments</h3>
                  <div className="space-y-2">
                    {selectedTask.task.attachments.map((attachment, index) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <FileText size={18} className="text-indigo-600" />
                        <span className="text-sm text-gray-700">{attachment.filename}</span>
                        <Download size={16} className="text-gray-400 ml-auto" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Submission */}
              {selectedTask.status !== "Completed" && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Submit Your Work</h3>
                  <textarea
                    rows="6"
                    className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400 mb-3"
                    placeholder="Enter your submission here..."
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                  />
                  <button
                    onClick={() => handleSubmitTask(selectedTask.task._id)}
                    disabled={submitting || !submissionText.trim()}
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Submit Task
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Submission Info */}
              {selectedTask.status === "Completed" && selectedTask.submission && (
                <div className="mb-6 p-4 bg-green-50 rounded-xl">
                  <h3 className="font-semibold text-green-800 mb-2">Submission</h3>
                  <p className="text-green-700 text-sm mb-2">
                    Submitted on:{" "}
                    {new Date(selectedTask.submittedAt).toLocaleString()}
                  </p>
                  {selectedTask.submission.answer && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-800 mb-1">Your Answer:</p>
                      <p className="text-green-700 whitespace-pre-wrap">
                        {selectedTask.submission.answer}
                      </p>
                    </div>
                  )}
                  {selectedTask.score !== undefined && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-800">Score: {selectedTask.score}/100</p>
                    </div>
                  )}
                  {selectedTask.feedback && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-green-800 mb-1">Feedback:</p>
                      <p className="text-green-700">{selectedTask.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3">
                {selectedTask.status === "Pending" && (
                  <button
                    onClick={() => handleStatusChange(selectedTask.task._id, "In Progress")}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Mark as In Progress
                  </button>
                )}
                {selectedTask.status === "In Progress" && (
                  <button
                    onClick={() => handleStatusChange(selectedTask.task._id, "Pending")}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Mark as Pending
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setSubmissionText("");
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
