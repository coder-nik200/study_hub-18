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
        student.email.toLowerCase().includes(searchTerm.toLowerCase()))
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`absolute inset-0 transition-all duration-500 backdrop-blur-md
        ${show ? "bg-black/40 opacity-100" : "bg-black/0 opacity-0"}`}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white rounded-3xl shadow-2xl
        p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto
        transform transition-all duration-500
        ${
          show ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Task</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block font-medium mb-1">Task Title *</label>
            <input
              type="text"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              rows="4"
              className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Due Date *</label>
              <input
                type="datetime-local"
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Priority</label>
              <select
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
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
            <label className="block font-medium mb-1">Assign To Students *</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search students by name or email..."
                className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-indigo-400"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowStudentDropdown(true);
                }}
                onFocus={() => setShowStudentDropdown(true)}
              />
              {showStudentDropdown && filteredStudents.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredStudents.map((student) => (
                    <button
                      key={student._id}
                      type="button"
                      onClick={() => addStudent(student)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                    >
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Students */}
            {selectedStudents.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedStudents.map((student) => (
                  <span
                    key={student._id}
                    className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {student.name}
                    <button
                      type="button"
                      onClick={() => removeStudent(student._id)}
                      className="hover:text-red-600"
                    >
                      <XCircle size={16} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="block font-medium mb-1">Attachments (Optional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4">
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
                className="flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-700"
              >
                <Upload size={20} />
                <span>Click to upload files</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">
                PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
              </p>
            </div>

            {/* Attachment List */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{attachment.filename}</span>
                    <button
                      type="button"
                      onClick={() => removeAttachment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <XCircle size={18} />
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
            className="w-full bg-indigo-600 text-white py-3 rounded-2xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
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
