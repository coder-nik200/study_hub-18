import { useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  ClipboardList,
  PlusCircle,
  ChartColumnDecreasing,
  Menu,
} from "lucide-react";
import { useState } from "react";

export default function ExpertAnalysis() {
  const location = useLocation();
  const tasks = location.state?.tasks || [];
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ Use assignedTo instead of students
  const totalTasks = tasks.length;

  const totalStudents = tasks.reduce(
    (acc, task) => acc + (task.assignedTo?.length || 0),
    0,
  );

  const completed = tasks.reduce(
    (acc, task) =>
      acc +
      (task.assignedTo?.filter((student) => student?.status === "Submitted")
        .length || 0),
    0,
  );

  const totalScore = tasks.reduce(
    (acc, task) =>
      acc +
      (task.assignedTo?.reduce(
        (sum, student) => sum + (student?.score || 0),
        0,
      ) || 0),
    0,
  );

  const avgScore =
    totalStudents > 0 ? Math.floor(totalScore / totalStudents) : 0;

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-5 left-5 z-50 bg-white shadow-lg p-2 rounded-lg"
      >
        <Menu size={22} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-40 min-h-screen w-64 
        bg-white/80 backdrop-blur-xl shadow-2xl p-6 border-r 
        transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <h2 className="text-2xl font-bold text-indigo-600 mb-10">
          Expert Panel
        </h2>

        <nav className="space-y-6 text-gray-700">
          <Link
            to="/expert"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 hover:text-indigo-600 transition"
          >
            <ClipboardList size={20} />
            Dashboard
          </Link>

          <Link
            to="/analysis"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 text-indigo-600 font-semibold"
          >
            <ChartColumnDecreasing size={20} />
            Analysis Mode
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 p-10 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/expert"
            className="bg-white shadow-md p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </Link>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Expert Analysis Dashboard
          </h1>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="opacity-80">Total Tasks</h3>
            <p className="text-3xl font-bold mt-2">{totalTasks}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="opacity-80">Total Students</h3>
            <p className="text-3xl font-bold mt-2">{totalStudents}</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="opacity-80">Completed</h3>
            <p className="text-3xl font-bold mt-2">{completed}</p>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="opacity-80">Average Score</h3>
            <p className="text-3xl font-bold mt-2">{avgScore}%</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-700">
            Student Performance Details
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-500 text-sm uppercase tracking-wider">
                  <th className="py-4">Student</th>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Score</th>
                </tr>
              </thead>

              <tbody>
                {tasks.flatMap((task) =>
                  (task.assignedTo || []).map((student) => (
                    <tr
                      key={`${task._id}-${student?._id}`}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="py-4 font-medium">{student?.name}</td>

                      <td>{task?.title}</td>

                      <td>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student?.status === "Submitted"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {student?.status || "In Progress"}
                        </span>
                      </td>

                      <td className="w-40">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${student?.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                      </td>

                      <td className="font-bold text-indigo-600">
                        {student?.score || 0}%
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
