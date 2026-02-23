import React, { useState } from "react";
import {
  FileText,
  Calendar,
  User,
  Download,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  RotateCcw,
} from "lucide-react";

import { toast } from "react-toastify";
import { updateTaskStatus } from "../../api/axios";

const TaskDetail = ({ selectedTask, setSelectedTask, refreshTasks }) => {
  const [submitting, setSubmitting] = useState(false);
  const [submissionText, setSubmissionText] = useState("");

  if (!selectedTask) return null;

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, { status: newStatus });
      toast.success(`Task marked as ${newStatus}`);
      refreshTasks?.();
      setSelectedTask(null);
    } catch (error) {
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
        submissionData: { answer: submissionText },
      });

      toast.success("Task submitted successfully!");
      refreshTasks?.();
      setSubmissionText("");
      setSelectedTask(null);
    } catch (error) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedTask?.task?.title}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  {selectedTask?.task?.createdBy?.name || "Expert"}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(selectedTask?.task?.dueDate).toLocaleString()}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedTask(null);
                setSubmissionText("");
              }}
              className="p-2 rounded-lg text-gray-500 hover:text-red-500 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Status */}
          <div className="mb-6">
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(
                selectedTask?.status,
              )}`}
            >
              {getStatusIcon(selectedTask?.status)}
              {selectedTask?.status}
            </div>
          </div>

          {/* Description */}
          {selectedTask?.task?.description && (
            <div className="mb-8">
              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-4 tracking-tight">
                Description
              </h3>

              {/* Content Card */}
              <div className="relative bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-5 shadow-sm">
                {/* Soft Gradient Accent */}
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-2xl"></div>

                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap pl-3">
                  {selectedTask.task.description}
                </p>
              </div>
            </div>
          )}

          {/* Attachments */}
          {selectedTask?.task?.attachments?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Attachments</h3>
              <div className="space-y-2">
                {selectedTask.task.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <FileText size={18} />
                    <span className="text-sm flex-1">
                      {attachment.filename}
                    </span>
                    <Download size={16} />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Submit Section */}
          {selectedTask?.status !== "Completed" && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Submit Your Work
              </h3>

              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <textarea
                  rows="5"
                  className="w-full resize-none rounded-xl border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none p-4 text-gray-700 placeholder-gray-400 transition-all duration-300 mb-4"
                  placeholder="Write your submission here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                />

                <button
                  onClick={() => handleSubmitTask(selectedTask?.task?._id)}
                  disabled={submitting}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? "⏳ Submitting..." : "🚀 Submit Task"}
                </button>
              </div>
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
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Your Answer:
                  </p>
                  <p className="text-green-700 whitespace-pre-wrap">
                    {selectedTask.submission.answer}
                  </p>
                </div>
              )}
              {selectedTask.score !== undefined && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-green-800">
                    Score: {selectedTask.score}/100
                  </p>
                </div>
              )}
              {selectedTask.feedback && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-green-800 mb-1">
                    Feedback:
                  </p>
                  <p className="text-green-700">{selectedTask.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Quick Actions */}
          {selectedTask && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              {/* Pending → In Progress */}
              {selectedTask?.status === "Pending" && (
                <button
                  onClick={() =>
                    handleStatusChange(selectedTask?.task?._id, "In Progress")
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <Play size={18} />
                  Mark as In Progress
                </button>
              )}

              {/* In Progress → Pending */}
              {selectedTask?.status === "In Progress" && (
                <button
                  onClick={() =>
                    handleStatusChange(selectedTask?.task?._id, "Pending")
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-3 rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
                >
                  <RotateCcw size={18} />
                  Mark as Pending
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={() => {
                  setSelectedTask(null);
                  setSubmissionText("");
                }}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-100 hover:shadow-sm transition-all duration-300"
              >
                <X size={18} />
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
