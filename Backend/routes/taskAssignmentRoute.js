const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  updateTaskStatus,
  getStudentTaskAssignments,
  getTaskAssignments,
} = require("../controllers/taskAssignmentController");

const router = express.Router();

// Task assignment status routes (All authenticated users)
router.patch("/tasks/:taskId/status", authMiddleware, updateTaskStatus);
router.get("/student/tasks", authMiddleware, getStudentTaskAssignments);
router.get("/tasks/:taskId/assignments", authMiddleware, roleMiddleware(["expert"]), getTaskAssignments);

module.exports = router;
