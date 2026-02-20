import { useState, useEffect } from "react";
import {
  PlusCircle,
  Users,
  ClipboardList,
  ChartColumnDecreasing,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  X,
  Calendar,
  Award,
  Target,
} from "lucide-react";
import { Link } from "react-router-dom";
import CreateTaskModal from "./CreateTaskModel";
import {
  fetchExpertTasks,
  getTaskDetails,
  updateAssignmentGrade,
  getTaskAssignments,
} from "../../api/axios";
import { toast } from "react-toastify";

export default function ExpertDashboard() {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, completed, in-progress, pending
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch tasks from backend
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await fetchExpertTasks();
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = async (taskId) => {
    try {
      const res = await getTaskDetails(taskId);
      setTaskDetails(res.data);
      setSelectedTask(taskId);
    } catch (error) {
      console.error("Error fetching task details:", error);
      toast.error("Failed to load task details");
    }
  };

  const handleGradeUpdate = async (assignmentId, score, feedback) => {
    try {
      await updateAssignmentGrade(assignmentId, { score, feedback });
      toast.success("Grade updated successfully");
      if (selectedTask) {
        handleTaskClick(selectedTask);
      }
    } catch (error) {
      console.error("Error updating grade:", error);
      toast.error("Failed to update grade");
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.progress?.completionRate === 100) ||
      (filter === "in-progress" && task.progress?.inProgress > 0) ||
      (filter === "pending" && task.progress?.pending > 0);
    return matchesSearch && matchesFilter;
  });

  // Calculate overall statistics
  const overallStats = {
    totalTasks: tasks.length,
    totalStudents: new Set(tasks.flatMap((t) => t.assignedTo?.map((s) => s._id) || [])).size,
    avgCompletionRate:
      tasks.length > 0
        ? Math.round(
            tasks.reduce((sum, t) => sum + (t.progress?.completionRate || 0), 0) / tasks.length
          )
        : 0,
    totalCompleted: tasks.filter((t) => t.progress?.completionRate === 100).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white/70 backdrop-blur-lg shadow-xl p-6 border-r">
        <h2 className="text-2xl font-bold text-indigo-600 mb-10">Expert Panel</h2>

        <div className="space-y-6 text-gray-700">
          <div className="flex items-center gap-3 cursor-pointer hover:text-indigo-600">
            <ClipboardList size={20} />
            Dashboard
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-3 hover:text-indigo-600 w-full text-left"
          >
            <PlusCircle size={20} />
            Create Task
          </button>

          <Link
            to="/analysis"
            state={{ tasks }}
            className="flex items-center gap-3 hover:text-indigo-600"
          >
            <ChartColumnDecreasing size={20} />
            Analysis Mode
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Task Dashboard</h1>
            <p className="text-gray-600 mt-1">Monitor and manage student progress</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700 shadow-lg"
          >
            <PlusCircle size={18} />
            New Task
          </button>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Tasks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {overallStats.totalTasks}
                </p>
              </div>
              <ClipboardList size={32} className="text-indigo-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Students</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {overallStats.totalStudents}
                </p>
              </div>
              <Users size={32} className="text-indigo-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Avg Completion</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {overallStats.avgCompletionRate}%
                </p>
              </div>
              <Target size={32} className="text-indigo-600 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Completed Tasks</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {overallStats.totalCompleted}
                </p>
              </div>
              <CheckCircle size={32} className="text-green-600 opacity-50" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-4 shadow-lg mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full border rounded-lg p-2 px-4 focus:ring-2 focus:ring-indigo-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["all", "completed", "in-progress", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === f
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleTaskClick(task._id)}
            >
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex-1">{task.title}</h2>
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

              <p className="text-gray-500 text-sm mb-4 flex items-center gap-2">
                <Calendar size={14} />
                {new Date(task.dueDate).toLocaleDateString()}
              </p>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-indigo-600">
                    {task.progress?.completionRate || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full transition-all"
                    style={{ width: `${task.progress?.completionRate || 0}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">
                    {task.progress?.completed || 0}
                  </div>
                  <div className="text-xs text-gray-600">Completed</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">
                    {task.progress?.inProgress || 0}
                  </div>
                  <div className="text-xs text-gray-600">In Progress</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-gray-600">
                    {task.progress?.pending || 0}
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <Users size={16} />
                {task.assignedTo?.length || 0} Students
              </div>

              <button className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <Eye size={16} />
                View Details
              </button>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <ClipboardList size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No tasks found</h3>
            <p className="text-gray-500">
              {searchTerm || filter !== "all"
                ? "Try adjusting your filters"
                : "Create your first task to get started"}
            </p>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && taskDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{taskDetails.task.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>Due: {new Date(taskDetails.task.dueDate).toLocaleString()}</span>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        taskDetails.task.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : taskDetails.task.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {taskDetails.task.priority?.toUpperCase() || "MEDIUM"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTask(null);
                    setTaskDetails(null);
                  }}
                  className="text-gray-500 hover:text-red-500 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Analytics */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {taskDetails.analytics.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {taskDetails.analytics.completed}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {taskDetails.analytics.inProgress}
                  </div>
                  <div className="text-sm text-gray-600">In Progress</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {taskDetails.analytics.pending}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
              </div>

              {/* Description */}
              {taskDetails.task.description && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {taskDetails.task.description}
                  </p>
                </div>
              )}

              {/* Student Progress Table */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">Student Progress</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Submitted
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {taskDetails.assignments.map((assignment) => (
                        <tr key={assignment._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                                {assignment.student?.name?.charAt(0) || "?"}
                              </div>
                              <div>
                                <div className="font-medium text-gray-800">
                                  {assignment.student?.name || "Unknown"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {assignment.student?.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                assignment.status === "Completed"
                                  ? "bg-green-100 text-green-700"
                                  : assignment.status === "In Progress"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {assignment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {assignment.submittedAt
                              ? new Date(assignment.submittedAt).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="px-4 py-3">
                            {assignment.score !== undefined ? (
                              <span className="font-semibold text-indigo-600">
                                {assignment.score}/100
                              </span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {assignment.status === "Completed" && (
                              <GradeInput
                                assignmentId={assignment._id}
                                currentScore={assignment.score}
                                currentFeedback={assignment.feedback}
                                onGradeUpdate={handleGradeUpdate}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedTask(null);
                  setTaskDetails(null);
                }}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showModal && (
        <CreateTaskModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onTaskCreated={() => {
            fetchTasks();
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

// Grade Input Component
function GradeInput({ assignmentId, currentScore, currentFeedback, onGradeUpdate }) {
  const [score, setScore] = useState(currentScore || "");
  const [feedback, setFeedback] = useState(currentFeedback || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {
    if (score !== "" && score >= 0 && score <= 100) {
      onGradeUpdate(assignmentId, parseInt(score), feedback);
      setIsEditing(false);
    }
  };

  if (!isEditing && currentScore !== undefined) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="text-indigo-600 hover:text-indigo-700 text-sm"
      >
        Edit Grade
      </button>
    );
  }

  return (
    <div className="flex gap-2">
      <input
        type="number"
        min="0"
        max="100"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        className="w-16 border rounded px-2 py-1 text-sm"
        placeholder="Score"
      />
      <input
        type="text"
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="flex-1 border rounded px-2 py-1 text-sm"
        placeholder="Feedback"
      />
      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
      >
        Save
      </button>
      {isEditing && (
        <button
          onClick={() => {
            setIsEditing(false);
            setScore(currentScore || "");
            setFeedback(currentFeedback || "");
          }}
          className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
