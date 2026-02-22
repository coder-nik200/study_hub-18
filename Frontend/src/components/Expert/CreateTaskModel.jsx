import { useEffect, useState } from "react";
import { X, Upload, XCircle, AlertCircle } from "lucide-react";
import { getAllStudents, createExpertTask } from "../../api/axios";
import { toast } from "react-toastify";

export default function CreateTaskModal({ show, onClose, onTaskCreated }) {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mount animation
  useEffect(() => {
    if (show) {
      setVisible(true);
      document.body.style.overflow = "hidden";
      fetchStudents();
    } else {
      setTimeout(() => setVisible(false), 500);
      document.body.style.overflow = "auto";
    }
  }, [show]);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setAllStudents(res.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to load students");
    }
  };

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Filter students based on search
  const filteredStudents = allStudents.filter(
    (student) =>
      !selectedStudents.find((s) => s._id === student._id) &&
      (student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  // Add student to selection
  const addStudent = (student) => {
    if (!selectedStudents.find((s) => s._id === student._id)) {
      setSelectedStudents([...selectedStudents, student]);
      setSearchTerm("");
      setShowStudentDropdown(false);
    }
  };

  // Remove student from selection
  const removeStudent = (studentId) => {
    setSelectedStudents(selectedStudents.filter((s) => s._id !== studentId));
  };

  // Handle file upload (for now, just store file info - in production, upload to cloud storage)
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments([
          ...attachments,
          {
            filename: file.name,
            url: event.target.result, // In production, this would be a cloud storage URL
            fileType: file.type,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        dueDate: deadline,
        priority,
        attachments,
        students: selectedStudents.map((s) => s._id),
      };

      await createExpertTask(taskData);
      toast.success("Task assigned successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setDeadline("");
      setPriority("medium");
      setSelectedStudents([]);
      setAttachments([]);

      if (onTaskCreated) {
        onTaskCreated();
      }
      onClose();
    } catch (error) {
      console.error("Error assigning task:", error);
      toast.error(error.response?.data?.message || "Failed to assign task");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-2 sm:px-0">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-all duration-500 backdrop-blur-md
      ${show ? "bg-black/50 opacity-100" : "bg-black/0 opacity-0"}`}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full sm:max-w-3xl
      bg-white/95 backdrop-blur-xl border border-white/40
      rounded-t-3xl sm:rounded-3xl
      shadow-[0_20px_60px_rgba(0,0,0,0.25)]
      p-4 sm:p-6 md:p-10
      max-h-[95vh] overflow-y-auto no-scrollbar
      transform transition-all duration-500
      ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-full sm:-translate-y-[120%] opacity-0"
      }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create Task
          </h2>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 transition"
          >
            <X size={22} className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
              Task Title *
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-2xl p-2 sm:p-3 focus:ring-2 focus:ring-indigo-400 transition shadow-sm text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
              Description
            </label>
            <textarea
              rows="4"
              className="w-full border border-gray-200 rounded-2xl p-2 sm:p-3 focus:ring-2 focus:ring-indigo-400 transition shadow-sm resize-none text-sm sm:text-base"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
                Due Date *
              </label>
              <input
                type="datetime-local"
                className="w-full border border-gray-200 rounded-2xl p-2 sm:p-3 focus:ring-2 focus:ring-indigo-400 transition shadow-sm text-sm sm:text-base"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
                Priority
              </label>
              <select
                className="w-full border border-gray-200 rounded-2xl p-2 sm:p-3 focus:ring-2 focus:ring-indigo-400 transition shadow-sm text-sm sm:text-base"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Student Selection */}
          <div className="relative">
            <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
              Assign To Students *
            </label>

            <input
              type="text"
              placeholder="Search students..."
              className="w-full border border-gray-200 rounded-2xl p-2 sm:p-3 focus:ring-2 focus:ring-indigo-400 transition shadow-sm text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowStudentDropdown(true);
              }}
              onFocus={() => setShowStudentDropdown(true)}
            />

            {showStudentDropdown && filteredStudents.length > 0 && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl max-h-40 sm:max-h-48 overflow-y-auto no-scrollbar text-sm">
                {filteredStudents.map((student) => (
                  <button
                    key={student._id}
                    type="button"
                    onClick={() => addStudent(student)}
                    className="w-full text-left px-3 sm:px-4 py-2 hover:bg-indigo-50 transition"
                  >
                    <div className="font-medium">{student.name}</div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {student.email}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {selectedStudents.length > 0 && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-3">
                {selectedStudents.map((student) => (
                  <span
                    key={student._id}
                    className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm flex items-center gap-1 sm:gap-2 shadow-sm"
                  >
                    {student.name}
                    <button
                      type="button"
                      onClick={() => removeStudent(student._id)}
                      className="hover:text-red-500 transition"
                    >
                      <XCircle size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-sm sm:text-base">
              Attachments (Optional)
            </label>

            <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-4 sm:p-6 text-center hover:bg-indigo-50 transition">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer text-indigo-600 hover:text-indigo-700 text-sm sm:text-base"
              >
                <Upload size={24} />
                <span className="font-medium">Click to upload files</span>
                <p className="text-xs sm:text-sm text-gray-500">
                  PDF, DOC, JPG, PNG (Max 10MB each)
                </p>
              </label>
            </div>

            {/* Attachment List */}
            {attachments.length > 0 && (
              <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-2 sm:p-3 rounded-xl shadow-sm text-sm sm:text-base"
                  >
                    <span className="truncate">{attachment.filename}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 sm:py-3 rounded-2xl font-semibold text-sm sm:text-base hover:scale-[1.02] hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Assigning...
              </>
            ) : (
              "Assign Task"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
