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
  Search,
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
import SimpleBarChart from "../Charts/SimpleBarChart";
import SimplePieChart from "../Charts/SimplePieChart";
import Spinner from "../Spinner";
import OverallStats from "./OverallStats";
import LeaderboardTable from "./LeaderboardTable";
import TaskCard from "./TaskCard";
import TaskDetailsModal from "./TaskDetailsModel";

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
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
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
    totalStudents: new Set(
      tasks.flatMap((t) => t.assignedTo?.map((s) => s._id) || []),
    ).size,
    avgCompletionRate:
      tasks.length > 0
        ? Math.round(
            tasks.reduce(
              (sum, t) => sum + (t.progress?.completionRate || 0),
              0,
            ) / tasks.length,
          )
        : 0,
    totalCompleted: tasks.filter((t) => t.progress?.completionRate === 100)
      .length,
    overdueTasks: tasks.filter(
      (t) =>
        new Date(t.dueDate) < new Date() && t.progress?.completionRate < 100,
    ).length,
  };

  // Calculate chart data
  const statusDistribution = [
    {
      label: "Completed",
      value: tasks.reduce((sum, t) => sum + (t.progress?.completed || 0), 0),
    },
    {
      label: "In Progress",
      value: tasks.reduce((sum, t) => sum + (t.progress?.inProgress || 0), 0),
    },
    {
      label: "Pending",
      value: tasks.reduce((sum, t) => sum + (t.progress?.pending || 0), 0),
    },
  ];

  // Performance leaderboard (students with most completed tasks)
  const studentPerformance = {};
  tasks.forEach((task) => {
    task.assignedTo?.forEach((student) => {
      if (!studentPerformance[student._id]) {
        studentPerformance[student._id] = {
          name: student.name,
          completed: 0,
          total: 0,
        };
      }
      studentPerformance[student._id].total++;
      if (task.progress?.completionRate === 100) {
        studentPerformance[student._id].completed++;
      }
    });
  });

  const leaderboard = Object.values(studentPerformance)
    .map((student) => ({
      ...student,
      completionRate:
        student.total > 0
          ? Math.round((student.completed / student.total) * 100)
          : 0,
    }))
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, 10);

  const leaderboardChartData = leaderboard.map((student) => ({
    label: student.name,
    value: student.completionRate,
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="indigo" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex flex-col md:flex-row">
      {/* Main */}
      <div className="flex-1 p-4 sm:p-6 md:p-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-8">
          <div className="mt-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-lg">
              Monitor and manage student progress
            </p>
          </div>

          {/* New Task Button */}
          <button
            onClick={() => setShowModal(true)}
            className="group relative inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out text-sm sm:text-base"
          >
            <PlusCircle
              size={18}
              className="transition-transform duration-300 group-hover:rotate-90"
            />
            <span className="font-semibold tracking-wide">New Task</span>
            <span className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition duration-300"></span>
          </button>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-10">
          <OverallStats
            title="Total Tasks"
            value={overallStats.totalTasks}
            icon={ClipboardList}
            gradient="from-indigo-500 to-purple-600"
          />
          <OverallStats
            title="Total Students"
            value={overallStats.totalStudents}
            icon={Users}
            gradient="from-blue-500 to-cyan-500"
          />
          <OverallStats
            title="Avg Completion"
            value={`${overallStats.avgCompletionRate}%`}
            icon={Target}
            gradient="from-pink-500 to-rose-500"
            progress={overallStats.avgCompletionRate}
          />
          <OverallStats
            title="Completed Tasks"
            value={overallStats.totalCompleted}
            icon={CheckCircle}
            gradient="from-emerald-500 to-green-600"
          />
          <OverallStats
            title="Overdue Tasks"
            value={overallStats.overdueTasks}
            icon={AlertCircle}
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-10">
          <div className="w-full min-w-0">
            <SimplePieChart
              data={statusDistribution}
              title="Task Status Distribution"
            />
          </div>
          <div className="w-full min-w-0">
            <SimpleBarChart
              data={
                leaderboardChartData.length > 0
                  ? leaderboardChartData
                  : [{ label: "No data", value: 0 }]
              }
              title="Top Performers (Completion Rate %)"
            />
          </div>
        </div>

        {/* Performance Leaderboard */}
        <LeaderboardTable data={leaderboard} title="Student Performance" />

        {/* Overdue Tasks Alert */}
        {overallStats.overdueTasks > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-red-800 font-semibold">
                You have {overallStats.overdueTasks} overdue task
                {overallStats.overdueTasks !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-gray-100 mb-8 flex flex-col sm:flex-row gap-3 sm:gap-5 items-stretch sm:items-center justify-between transition-all duration-300">
          {/* Search Box */}
          <div className="relative flex-1 w-full min-w-0">
            <Search
              size={18}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition"
            />
            <input
              type="text"
              placeholder="Search tasks..."
              className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-3 rounded-2xl border border-gray-200 bg-white/80 focus:ring-2 focus:ring-indigo-400 focus:outline-none shadow-sm transition-all duration-300 text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
            {["all", "completed", "in-progress", "pending"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                  filter === f
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={handleTaskClick}
              onView={handleTaskClick}
            />
          ))}
        </div>

        {/* No Tasks Found */}
        {filteredTasks.length === 0 && (
          <div className="relative text-center py-12 sm:py-16 px-4 sm:px-6 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-40 pointer-events-none rounded-3xl" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-indigo-100 p-5 rounded-full mb-4 sm:mb-6 animate-pulse">
                <ClipboardList size={42} className="text-indigo-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                No tasks found
              </h3>
              <p className="text-gray-500 max-w-xs sm:max-w-md text-sm sm:text-base">
                {searchTerm || filter !== "all"
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Create your first task to get started."}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Task Detail Modal */}
      <TaskDetailsModal
        isOpen={!!selectedTask}
        taskDetails={taskDetails}
        onClose={() => {
          setSelectedTask(null);
          setTaskDetails(null);
        }}
        onGradeUpdate={handleGradeUpdate}
      />

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
