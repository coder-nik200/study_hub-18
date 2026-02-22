import { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  User,
  Eye,
} from "lucide-react";
import { getStudentTaskAssignments, updateTaskStatus } from "../../api/axios";
import { toast } from "react-toastify";
import Spinner from "../Spinner";
import TaskDetail from "./TaskDeatil";
import StatsCard from "./StatsCard";

export default function StudentTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <div className="text-center">
          <Spinner size="lg" color="indigo" />
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Tasks</h1>
          <p className="text-gray-600">
            View and manage tasks assigned by your expert
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard
            title="Total Tasks"
            value={tasks.length}
            icon={FileText}
            gradient="from-indigo-500 to-purple-600"
          />

          <StatsCard
            title="Completed"
            value={tasks.filter((t) => t.status === "Completed").length}
            icon={CheckCircle}
            gradient="from-green-400 to-emerald-600"
          />

          <StatsCard
            title="In Progress"
            value={tasks.filter((t) => t.status === "In Progress").length}
            icon={Clock}
            gradient="from-blue-400 to-cyan-600"
          />

          <StatsCard
            title="Pending"
            value={tasks.filter((t) => t.status === "Pending").length}
            icon={AlertCircle}
            gradient="from-orange-400 to-red-500"
          />
        </div>

        {/* Tasks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {tasks
            .filter((assignment) => assignment?.task) // ✅ remove broken ones
            .map((assignment) => {
              const task = assignment.task;

              const daysUntilDue = task?.dueDate
                ? getDaysUntilDue(task.dueDate)
                : null;

              const overdue = task?.dueDate ? isOverdue(task.dueDate) : false;

              return (
                <div
                  key={assignment._id}
                  className="group relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-md border border-white/40 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden"
                >
                  {/* Top Gradient Strip */}
                  <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
                          {task.title}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <div className="bg-indigo-100 p-1.5 rounded-lg">
                            <User size={14} className="text-indigo-600" />
                          </div>
                          <span>{task.createdBy?.name || "Expert"}</span>
                        </div>
                      </div>

                      <div
                        className={`px-3 py-1 rounded-full text-xs font-semibold border shadow-sm ${getStatusColor(
                          assignment.status,
                        )}`}
                      >
                        {assignment.status}
                      </div>
                    </div>

                    {/* Description */}
                    {task.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    {/* Due Date */}
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <div className="bg-gray-100 p-1.5 rounded-lg">
                        <Calendar size={16} className="text-gray-500" />
                      </div>
                      <span
                        className={`font-medium ${
                          overdue ? "text-red-600" : "text-gray-600"
                        }`}
                      >
                        {overdue
                          ? `Overdue by ${Math.abs(daysUntilDue)} day${
                              Math.abs(daysUntilDue) !== 1 ? "s" : ""
                            }`
                          : daysUntilDue === 0
                            ? "Due today"
                            : daysUntilDue === 1
                              ? "Due tomorrow"
                              : `Due in ${daysUntilDue} days`}
                      </span>
                    </div>

                    {/* Priority */}
                    <div className="mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          task.priority === "high"
                            ? "bg-gradient-to-r from-red-400 to-pink-500 text-white"
                            : task.priority === "medium"
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                              : "bg-gradient-to-r from-blue-400 to-indigo-500 text-white"
                        }`}
                      >
                        {task.priority?.toUpperCase() || "MEDIUM"}
                      </span>
                    </div>

                    {/* Attachments */}
                    {task.attachments && task.attachments.length > 0 && (
                      <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                        <div className="bg-purple-100 p-1.5 rounded-lg">
                          <FileText size={14} className="text-purple-600" />
                        </div>
                        <span>{task.attachments.length} attachment(s)</span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setSelectedTask(assignment)}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-md"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      {assignment.status !== "Completed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              task._id,
                              assignment.status === "Pending"
                                ? "In Progress"
                                : "Completed",
                            )
                          }
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 hover:scale-105 transition-all duration-300 text-sm shadow-sm"
                        >
                          {assignment.status === "Pending"
                            ? "Start"
                            : "Complete"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {tasks.length === 0 && (
          <div className="flex items-center justify-center py-20">
            <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 shadow-xl rounded-3xl p-10 max-w-md w-full text-center overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-40"></div>

              {/* Icon */}
              <div className="relative flex justify-center mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl shadow-lg animate-pulse">
                  <FileText size={50} className="text-white" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                No Tasks Assigned
              </h3>

              {/* Subtitle */}
              <p className="text-gray-600 leading-relaxed">
                You don't have any tasks assigned yet.
                <br />
                Once your expert assigns tasks, they will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetail
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
      />
    </div>
  );
}
