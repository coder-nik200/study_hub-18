import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export default api;

export const createTask = (taskData) => api.post("/tasks", taskData);
export const getTasks = () => api.get("/tasks");
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
