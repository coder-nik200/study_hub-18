import { useContext, useEffect, useState } from "react";
import { Plus, Calendar, CheckSquare, TrendingUp } from "lucide-react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import CalendarView from "./CalendarView";
import ProgressStats from "./ProgressStats";
import {
  createTask,
  getTasks,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from "../../api/axios";
import { UserContext } from "../../context/UserContext";

const Dashboard = () => {
  const { user } = useContext(UserContext);

  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");

  /* ---------------- TASK ACTIONS ---------------- */

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (taskData) => {
    try {
      const res = await createTask(taskData);
      setTasks((prev) => [res.data, ...prev]);
      setShowTaskForm(false);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  const updateTask = async (id, updates) => {
    try {
      const res = await updateTaskAPI(id, updates);
      setTasks((tasks) =>
        tasks.map((task) => (task._id === id ? res.data : task)),
      );
      setEditingTask(null);
      setShowTaskForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskAPI(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskComplete = async (task) => {
    if (!task || !task._id) return;
    try {
      const res = await updateTaskAPI(task._id, {
        completed: !task.completed,
      });
      setTasks((tasks) =>
        tasks.map((t) => (t._id === task._id ? res.data : t)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen py-8 sm:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-300 pb-5 mb-8 gap-5">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Welcome back, {user?.name || "User"}!
            </h1>
            <p className="text-gray-500 text-base sm:text-lg pt-2">
              Let's make today productive 🚀
            </p>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 sm:gap-3 flex-nowrap">
            {[
              { key: "dashboard", icon: CheckSquare, label: "Dashboard" },
              { key: "calendar", icon: Calendar, label: "Calendar" },
              { key: "progress", icon: TrendingUp, label: "Progress" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveView(key)}
                className={`flex items-center gap-1.5 sm:gap-2
                  px-3 sm:px-5
                  py-2 sm:py-3
                  text-sm sm:text-base
                  rounded-lg border-2 font-medium transition
                  ${
                    activeView === key
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : "bg-white border-gray-200 text-gray-600 hover:border-indigo-700 hover:text-indigo-600"
                  }`}
              >
                <Icon size={18} className="sm:size-[20px]" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard View */}
        {activeView === "dashboard" && (
          <div className="flex flex-col gap-6 sm:gap-8">
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 w-fit bg-indigo-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              <Plus size={20} />
              Add New Task
            </button>

            <TaskList
              tasks={tasks}
              onToggleComplete={toggleTaskComplete}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowTaskForm(true);
              }}
              onDeleteTask={deleteTask}
            />
          </div>
        )}

        {activeView === "calendar" && <CalendarView tasks={tasks} />}
        {activeView === "progress" && <ProgressStats tasks={tasks} />}

        {/* Modal */}
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={
              editingTask
                ? (data) => updateTask(editingTask._id, data)
                : addTask
            }
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
