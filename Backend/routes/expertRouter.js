const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  assignTask,
  getTasksByExpert,
  getTaskDetails,
  getAllStudents,
  updateAssignmentGrade,
} = require("../controllers/expertController");
const {
  updateTaskStatus,
  getStudentTaskAssignments,
  getTaskAssignments,
} = require("../controllers/taskAssignmentController");

const router = express.Router();

// Task assignment routes
router.post("/assign", authMiddleware, assignTask);
router.get("/expert-tasks", authMiddleware, getTasksByExpert);
router.get("/tasks/:taskId", authMiddleware, getTaskDetails);
router.get("/students", authMiddleware, getAllStudents);
router.patch("/assignments/:assignmentId/grade", authMiddleware, updateAssignmentGrade);

// Task assignment status routes
router.patch("/tasks/:taskId/status", authMiddleware, updateTaskStatus);
router.get("/student/tasks", authMiddleware, getStudentTaskAssignments);
router.get("/tasks/:taskId/assignments", authMiddleware, getTaskAssignments);

module.exports = router;
