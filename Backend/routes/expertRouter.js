const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  assignTask,
  getTasksByExpert,
  getTaskDetails,
  getAllStudents,
  updateAssignmentGrade,
  deleteTask,
} = require("../controllers/expertController");

const router = express.Router();

// Task assignment routes (Expert only)
router.post("/assign", authMiddleware, roleMiddleware(["expert"]), assignTask);
router.get("/expert-tasks", authMiddleware, roleMiddleware(["expert"]), getTasksByExpert);
router.get("/tasks/:taskId", authMiddleware, roleMiddleware(["expert"]), getTaskDetails);
router.get("/students", authMiddleware, roleMiddleware(["expert"]), getAllStudents);
router.patch("/assignments/:assignmentId/grade", authMiddleware, roleMiddleware(["expert"]), updateAssignmentGrade);
router.delete("/expert-tasks/:id", authMiddleware, roleMiddleware(["expert"]), deleteTask);

module.exports = router;
