const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
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

// Task assignment routes (Expert only)
router.post("/assign", authMiddleware, roleMiddleware(["expert"]), assignTask);
router.get("/expert-tasks", authMiddleware, roleMiddleware(["expert"]), getTasksByExpert);
router.get("/tasks/:taskId", authMiddleware, roleMiddleware(["expert"]), getTaskDetails);
router.get("/students", authMiddleware, roleMiddleware(["expert"]), getAllStudents);
router.patch("/assignments/:assignmentId/grade", authMiddleware, roleMiddleware(["expert"]), updateAssignmentGrade);

// Task assignment status routes (All authenticated users)
router.patch("/tasks/:taskId/status", authMiddleware, updateTaskStatus);
router.get("/student/tasks", authMiddleware, getStudentTaskAssignments);
router.get("/tasks/:taskId/assignments", authMiddleware, roleMiddleware(["expert"]), getTaskAssignments);

module.exports = router;
