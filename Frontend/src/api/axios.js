import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default api;

// Regular tasks (student's own tasks)
export const createTask = (taskData) => api.post("/tasks", taskData);
export const getTasks = () => api.get("/tasks");
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// Expert task management
export const createExpertTask = (expertData) => api.post("/assign", expertData);
export const fetchExpertTasks = () => api.get("/expert-tasks");
export const getTaskDetails = (taskId) => api.get(`/tasks/${taskId}`);
export const getAllStudents = () => api.get("/students");
export const updateAssignmentGrade = (assignmentId, data) =>
  api.patch(`/assignments/${assignmentId}/grade`, data);

// Task assignments (student task management)
export const updateTaskStatus = (taskId, data) =>
  api.patch(`/tasks/${taskId}/status`, data);
export const getStudentTaskAssignments = () => api.get("/student/tasks");
export const getTaskAssignments = (taskId) => api.get(`/tasks/${taskId}/assignments`);

// Notifications
export const getNotifications = (unreadOnly = false) =>
  api.get(`/notifications${unreadOnly ? "?unreadOnly=true" : ""}`);
export const markNotificationAsRead = (notificationId) =>
  api.patch(`/notifications/${notificationId}/read`);
export const markAllNotificationsAsRead = () => api.patch("/notifications/read-all");
export const getUnreadNotificationCount = () => api.get("/notifications/unread-count");

// Profile
export const getProfile = () => api.get("/profile");
export const updateProfile = (formData) =>
  api.put("/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
